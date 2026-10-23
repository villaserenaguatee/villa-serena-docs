#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { load } from 'js-yaml';
import openapiTS, { astToString } from 'openapi-typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const canonical = resolve(root, 'openapi.yaml');
const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']);

// Solo compara operaciones HTTP. No acredita conformidad de DTO, seguridad ni reglas.
export function operationDifferences(expected, actual) {
  const operations = (schema) => new Set(Object.entries(schema.paths ?? {}).flatMap(([path, item]) =>
    Object.keys(item).filter((method) => methods.has(method)).map((method) => `${method.toUpperCase()} ${path}`)));
  const wanted = operations(expected);
  const found = operations(actual);
  return {
    missing: [...wanted].filter((operation) => !found.has(operation)).sort(),
    extra: [...found].filter((operation) => !wanted.has(operation)).sort(),
  };
}

export async function generatedTypes(schema, sourceHash) {
  const ids = new Set();
  for (const item of Object.values(schema.paths ?? {})) {
    for (const [method, operation] of Object.entries(item)) {
      if (!methods.has(method)) continue;
      if (!operation.operationId || ids.has(operation.operationId)) {
        throw new Error('Cada operación debe tener un operationId único.');
      }
      ids.add(operation.operationId);
    }
  }
  const ast = await openapiTS(schema);
  return `/** Generado desde villa-serena-docs/openapi.yaml. No editar.\n * Contrato SHA-256: ${sourceHash}\n */\n${astToString(ast)}`;
}

// Referencia histórica anterior a la reorganización de la wiki que se conserva sin reescribir el archivo archivado.
const ARCHIVED_HISTORICAL_LINKS = new Set([
  '04-guias-y-referencia/historico/contexto-original-chat.md -> 20%20-%20Diagramas%20del%20Sistema/README.md',
]);

function headingSlugs(markdown) {
  const counts = new Map();
  const slugs = new Set();
  for (const line of markdown.replace(/```[\s\S]*?```/g, '').split(/\r?\n/)) {
    const match = /^#{1,6}\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const base = match[1].trim().toLowerCase().replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    slugs.add(count === 0 ? base : `${base}-${count}`);
  }
  return slugs;
}

export function validateMarkdownLinks(baseDir = root) {
  const resolvedRoot = resolve(baseDir);
  const slugCache = new Map();
  const getSlugs = (filePath) => {
    if (!slugCache.has(filePath)) slugCache.set(filePath, headingSlugs(readFileSync(filePath, 'utf8')));
    return slugCache.get(filePath);
  };
  const walk = (dir) => readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.') && entry.name !== 'node_modules')
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const full = resolve(dir, entry.name);
      return entry.isDirectory() ? walk(full) : (entry.name.endsWith('.md') ? [full] : []);
    });

  const errors = [];
  for (const file of walk(resolvedRoot)) {
    const relFile = relative(resolvedRoot, file).replaceAll('\\', '/');
    const content = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
    for (const match of content.matchAll(/\[([^\]]+)\]\(([^)]*)\)/g)) {
      const rawTarget = match[2].trim().replace(/^<|>$/g, '').replace(/\s+(?:"[^"]*"|'[^']*')$/, '').trim();
      if (/^(https?:|mailto:)/i.test(rawTarget)) continue;
      if (ARCHIVED_HISTORICAL_LINKS.has(`${relFile} -> ${rawTarget}`)) continue;
      if (!rawTarget || rawTarget === '#') {
        errors.push(`${relFile}: enlace vacío o ficticio (${rawTarget || 'vacío'})`);
        continue;
      }
      const [rawPath, ...fragmentParts] = rawTarget.split('#');
      const rawFragment = fragmentParts.join('#');
      let decodedPath, decodedFragment;
      try {
        decodedPath = rawPath ? decodeURIComponent(rawPath) : '';
        decodedFragment = rawFragment ? decodeURIComponent(rawFragment).toLowerCase() : '';
      } catch {
        errors.push(`${relFile}: URL mal codificada (${rawTarget})`);
        continue;
      }
      const targetPath = decodedPath ? resolve(dirname(file), decodedPath) : file;
      const relTarget = relative(resolvedRoot, targetPath).replaceAll('\\', '/');
      if (relTarget.startsWith('..') || !existsSync(targetPath)) {
        errors.push(`${relFile}: destino inexistente (${rawTarget})`);
        continue;
      }
      const stat = statSync(targetPath);
      const docForFragment = stat.isDirectory() ? resolve(targetPath, 'README.md') : targetPath;
      if (rawFragment) {
        if (!existsSync(docForFragment) || !statSync(docForFragment).isFile()) {
          errors.push(`${relFile}: directorio sin README.md para validar fragmento (${rawTarget})`);
          continue;
        }
        if (!getSlugs(docForFragment).has(decodedFragment)) {
          errors.push(`${relFile}: fragmento inexistente #${rawFragment} en (${rawTarget})`);
        }
      }
    }
  }
  return errors;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const { values, positionals } = parseArgs({ args, allowPositionals: true, options: {
    revision: { type: 'string' }, output: { type: 'string' }, check: { type: 'boolean', default: false }, schema: { type: 'string' },
  } });
  if (!['info', 'validate', 'types', 'check-api'].includes(command) || positionals.length ||
      (values.output && command !== 'types') || (values.check && command !== 'types') ||
      (values.schema && command !== 'check-api')) {
    throw new Error('Uso: contrato-api.mjs info | validate | types --output RUTA [--check] | check-api --schema OPENAPI_SPRING');
  }
  if (values.revision) {
    if (!/^[a-f0-9]{40}$/.test(values.revision)) throw new Error('--revision requiere el SHA completo de 40 caracteres.');
    const commit = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const pending = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all', '--', 'openapi.yaml', 'scripts', 'package.json', 'pnpm-lock.yaml'], { encoding: 'utf8' }).trim();
    if (commit !== values.revision || pending) throw new Error('El checkout de docs no corresponde a la revisión fijada o tiene cambios locales en el contrato o las herramientas.');
  }
  const source = readFileSync(canonical);
  const hash = createHash('sha256').update(source).digest('hex');
  const schema = load(source.toString('utf8'));
  if (command === 'info') {
    const commit = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const pending = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=all', '--', 'openapi.yaml', 'scripts', 'package.json', 'pnpm-lock.yaml'], { encoding: 'utf8' }).trim();
    console.log(JSON.stringify({ repository: 'villaserenaguatee/villa-serena-docs', commit, workingTreeModified: Boolean(pending), sha256: hash }, null, 2));
    return;
  }
  if (command === 'check-api') {
    if (!values.schema) throw new Error('check-api requiere --schema con el OpenAPI exportado por Spring (JSON o YAML).');
    const actual = load(readFileSync(resolve(values.schema), 'utf8'));
    if (!actual?.openapi || !actual.paths) throw new Error('La exportación de Spring no contiene OpenAPI y paths.');
    const differences = operationDifferences(schema, actual);
    console.log(JSON.stringify(differences, null, 2));
    console.log('Comparación de rutas y métodos únicamente; requiere pruebas adicionales de DTO y seguridad.');
    if (differences.missing.length || differences.extra.length) process.exitCode = 1;
    return;
  }
  if (command === 'types' && !values.output) throw new Error('types requiere --output con el archivo TypeScript de destino.');
  const output = values.output ? resolve(values.output) : undefined;
  if (output && !output.endsWith('.d.ts')) throw new Error('El destino debe terminar en .d.ts; no se exportan copias YAML.');
  const generated = await generatedTypes(schema, hash);
  if (command === 'validate') {
    const linkErrors = validateMarkdownLinks(root);
    if (linkErrors.length) throw new Error(`Enlaces Markdown rotos:\n${linkErrors.join('\n')}`);
    console.log('Contrato validado, generación TypeScript y enlaces Markdown comprobados.');
  } else if (values.check) {
    if (readFileSync(output, 'utf8') !== generated) throw new Error('Tipos desactualizados: regenera desde el mismo commit fijado de docs.');
    console.log(`Tipos al día: ${output}`);
  } else {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, generated);
    console.log(`Tipos generados: ${output}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}

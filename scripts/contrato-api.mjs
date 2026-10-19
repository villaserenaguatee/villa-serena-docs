#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
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
    console.log('Contrato validado y generación TypeScript comprobada.');
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

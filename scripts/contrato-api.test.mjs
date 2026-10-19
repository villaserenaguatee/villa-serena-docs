import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { operationDifferences, generatedTypes } from './contrato-api.mjs';

const schema = {
  openapi: '3.1.0', info: { title: 'Prueba', version: '1.0.0' },
  paths: { '/api/v1/prueba': { get: { operationId: 'prueba', responses: { 200: { description: 'OK' } } } } },
};

test('detecta rutas y métodos faltantes y adicionales sin tratar parámetros como operaciones', () => {
  const expected = { paths: { '/a': { get: {}, parameters: [] }, '/b': { post: {} } } };
  const actual = { paths: { '/a': { get: {}, post: {} } } };
  assert.deepEqual(operationDifferences(expected, actual), { missing: ['POST /b'], extra: ['POST /a'] });
  assert.deepEqual(operationDifferences(expected, expected), { missing: [], extra: [] });
});

test('rechaza referencias rotas y operationId duplicados', async () => {
  await assert.rejects(generatedTypes({ ...schema, paths: { '/a': { get: { ...schema.paths['/api/v1/prueba'].get, responses: { 200: { $ref: '#/components/responses/NoExiste' } } } } } }, 'prueba'));
  await assert.rejects(generatedTypes({ ...schema, paths: { ...schema.paths, '/otra': schema.paths['/api/v1/prueba'] } }, 'prueba'));
});

test('genera tipos desde docs y detecta cambios sin escribir YAML en el consumidor', () => {
  const directory = mkdtempSync(join(tmpdir(), 'contrato-types-'));
  const output = join(directory, 'schema.d.ts');
  const script = fileURLToPath(new URL('./contrato-api.mjs', import.meta.url));
  const run = (...args) => execFileSync(process.execPath, [script, ...args], { encoding: 'utf8', stdio: 'pipe' });
  try {
    assert.throws(() => run('types', '--output', join(directory, 'openapi.yaml')));
    assert.throws(() => run('types', '--output', output, '--revision', '0'.repeat(40)));
    assert.throws(() => run('types', '--output', output, '--check'));
    run('types', '--output', output);
    assert.match(readFileSync(output, 'utf8'), /Contrato SHA-256: [a-f0-9]{64}/);
    run('types', '--output', output, '--check');
    writeFileSync(output, '// edición manual\n');
    const result = spawnSync(process.execPath, [script, 'types', '--output', output, '--check'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Tipos desactualizados/);
    assert.equal(readFileSync(output, 'utf8'), '// edición manual\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

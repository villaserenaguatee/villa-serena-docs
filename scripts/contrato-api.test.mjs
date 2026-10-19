import test from 'node:test';
import { load } from 'js-yaml';
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

// Regression checks for the payment block reconciled with API #54.
const contract = load(readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));
const definitions = contract.components.schemas;
test('Recurrente replaces only the Stripe webhook operation outside the inventory reconciliation', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  // Fixed pre-migration baseline: HEAD already contains Recurrente after committing.
  // CI fetches history so this object exists in both branch and PR merge checkouts.
  const previousRevision = 'f30ff74fe939d467728c51c31d7aca157b3be34e';
  const previous = load(execFileSync('git', ['-C', root, 'show', `${previousRevision}:openapi.yaml`], { encoding: 'utf8' }));
  const withoutInventory = document => ({ paths: Object.fromEntries(Object.entries(document.paths)
    .filter(([path]) => !path.startsWith('/api/v1/admin/inventario/') && !['insumos', 'compras', 'movimientos'].some(name => path === `/api/v1/gestion/${name}`))) });
  assert.deepEqual(operationDifferences(withoutInventory(previous), withoutInventory(contract)), {
    missing: ['POST /api/v1/pagos/stripe/webhook'],
    extra: ['POST /api/v1/pagos/recurrente/webhook'],
  });
  for (const route of ['/api/v1/publico/reservas/{codigo}/pago', '/api/v1/publico/reservas/{codigo}/estado', '/api/v1/app/reservas/{codigo}/pago-saldo']) assert.ok(contract.paths[route]);
  assert.deepEqual(definitions.HuespedDatos, previous.components.schemas.HuespedDatos);
  assert.deepEqual(definitions.HuespedAdicionalDatos, previous.components.schemas.HuespedAdicionalDatos);
});

test('inventario sustituye las operaciones propuestas y conserva las demás operaciones de la base', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const previous = load(execFileSync('git', ['-C', root, 'show', 'b7d957385a78a932c433e4cd11bd9575c51665ab:openapi.yaml'], { encoding: 'utf8' }));
  assert.deepEqual(operationDifferences(previous, contract), {
    missing: [
      'GET /api/v1/admin/inventario/productos',
      'GET /api/v1/admin/inventario/productos/{id}/movimientos',
      'PATCH /api/v1/admin/inventario/productos/{id}',
      'POST /api/v1/admin/inventario/productos',
      'POST /api/v1/admin/inventario/productos/{id}/desactivar',
      'POST /api/v1/admin/inventario/productos/{id}/movimientos',
    ],
    extra: ['GET', 'POST'].flatMap(method => ['compras', 'insumos', 'movimientos'].map(name => `${method} /api/v1/gestion/${name}`)),
  });
  for (const [path, item] of Object.entries(contract.paths)) {
    if (path.startsWith('/api/v1/gestion/')) continue;
    assert.deepEqual(item, previous.paths[path], path);
  }
});

test('movimientos conserva el intercambio de la web y los errores del API', () => {
  const op = contract.paths['/api/v1/gestion/movimientos'].post;
  const request = definitions.MovimientoInventarioPeticion;
  const data = definitions.MovimientoInventarioDatos;
  const response = definitions.MovimientoInventario;
  assert.deepEqual(request.required, ['id', 'datos']);
  assert.equal(request.properties.id.format, 'uuid');
  assert.equal(request.properties.version.default, 0);
  assert.equal(data.properties.insumoId.format, 'uuid');
  assert.deepEqual(data.properties.tipo.enum, ['entrada', 'salida', 'merma']);
  assert.equal(data.additionalProperties, true);
  assert.deepEqual(data.properties.cantidad.oneOf.map(branch => branch.type), ['number', 'string']);
  assert.equal(data.properties.motivo.maxLength, 500);
  assert.ok(op.responses['200']);
  assert.equal(op.responses['201'], undefined);
  assert.deepEqual(response.required, ['insumoId', 'tipo', 'cantidad', 'motivo', 'id', 'version', 'fecha']);
  assert.equal(response.properties.responsable, undefined);
  assert.equal(response.properties.stockResultante, undefined);
  assert.match(op.description, /VERSION_CAMBIADA/);
  assert.match(op.description, /STOCK_INSUFICIENTE/);
  assert.match(op.description, /inmutables/);
  assert.match(op.description, /sin repetir sus efectos/);
  assert.deepEqual(op['x-autorizacion'].roles, ['ADMIN']);
  assert.deepEqual(contract.paths['/api/v1/gestion/insumos'].get['x-autorizacion'].roles, ['ADMIN', 'MANTENIMIENTO_LIMPIEZA']);
  assert.deepEqual(contract.paths['/api/v1/gestion/insumos'].post['x-autorizacion'].roles, ['ADMIN']);
  assert.deepEqual(definitions.CompraInventarioDatos.properties.estado.enum, ['pagada', 'pendiente']);
});
test('payment DTO keeps urlPago and expiraEn, with historical STRIPE and new RECURRENTE', () => {
  const dto = definitions.PagoIniciado;
  assert.deepEqual(dto.required, ['urlPago', 'expiraEn']);
  assert.deepEqual(Object.keys(dto.properties), ['urlPago', 'expiraEn']);
  assert.equal(dto.properties.urlPago.format, 'uri');
  assert.deepEqual(dto.properties.expiraEn.anyOf, [{ $ref: '#/components/schemas/FechaHora' }, { type: 'null' }]);
  assert.ok(definitions.MetodoPago.enum.includes('STRIPE'));
  assert.ok(definitions.MetodoPago.enum.includes('RECURRENTE'));
  assert.deepEqual(definitions.EstadoReservaPublico.required, ['codigo', 'estadoReserva', 'estadoPago', 'puedeReintentar']);
});
test('webhook requires three Svix headers together and describes reconciliation, not browser approval', () => {
  const op = contract.paths['/api/v1/pagos/recurrente/webhook'].post;
  assert.deepEqual(op.security, [{ recurrenteFirma: [], recurrenteId: [], recurrenteTimestamp: [] }]);
  for (const [key, name] of [['recurrenteId', 'svix-id'], ['recurrenteTimestamp', 'svix-timestamp'], ['recurrenteFirma', 'svix-signature']]) {
    assert.equal(contract.components.securitySchemes[key].name, name);
    assert.equal(contract.components.securitySchemes[key].in, 'header');
  }
  assert.equal(op.requestBody.content['application/json'].schema.$ref, '#/components/schemas/EventoRecurrente');
  assert.match(op.description, /cinco minutos/); assert.match(op.description, /GTQ/);
  assert.match(op.description, /retorno del navegador no aprueba pagos/);
  for (const status of ['200', '400', '409', '502']) assert.ok(op.responses[status]);
  assert.equal(contract.components.securitySchemes.stripeFirma, undefined);
});
test('event shape permits backend type fallback, does not require body id, and requires checkout for handled events', () => {
  const event = definitions.EventoRecurrente;
  assert.equal(event.required, undefined);
  assert.deepEqual(event.anyOf.map(branch => branch.required), [['event_type'], ['type']]);
  assert.equal(event.anyOf[1].properties.event_type.type, 'null');
  assert.deepEqual(event.if.anyOf[0].properties.event_type.enum, ['intent.succeeded', 'checkout.expired']);
  assert.deepEqual(event.then.required, ['checkout']);
  assert.deepEqual(event.then.properties.checkout.required, ['id']);
  assert.equal(event.additionalProperties, true);
  assert.equal(definitions.EventoStripe, undefined);
});

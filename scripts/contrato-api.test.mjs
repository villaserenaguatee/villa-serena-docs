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
test('Recurrente sustituye la operación de webhook de Stripe en las rutas de pagos', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  // Fixed pre-migration baseline: HEAD already contains Recurrente after committing.
  // CI fetches history so this object exists in both branch and PR merge checkouts.
  const previousRevision = 'f30ff74fe939d467728c51c31d7aca157b3be34e';
  const previous = load(execFileSync('git', ['-C', root, 'show', `${previousRevision}:openapi.yaml`], { encoding: 'utf8' }));
  const payments = document => ({ paths: Object.fromEntries(Object.entries(document.paths)
    .filter(([path]) => path.startsWith('/api/v1/pagos/'))) });
  assert.deepEqual(operationDifferences(payments(previous), payments(contract)), {
    missing: ['POST /api/v1/pagos/stripe/webhook'],
    extra: ['POST /api/v1/pagos/recurrente/webhook'],
  });
  for (const route of ['/api/v1/publico/reservas/{codigo}/pago', '/api/v1/publico/reservas/{codigo}/estado', '/api/v1/app/reservas/{codigo}/pago-saldo']) assert.ok(contract.paths[route]);
  assert.deepEqual(definitions.HuespedDatos, previous.components.schemas.HuespedDatos);
  assert.deepEqual(definitions.HuespedAdicionalDatos, previous.components.schemas.HuespedAdicionalDatos);
});

test('inventario sustituye las operaciones propuestas por las consumidas en gestion', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const previous = load(execFileSync('git', ['-C', root, 'show', 'b7d957385a78a932c433e4cd11bd9575c51665ab:openapi.yaml'], { encoding: 'utf8' }));
  const inventory = document => ({ paths: Object.fromEntries(Object.entries(document.paths)
    .filter(([path]) => path.startsWith('/api/v1/admin/inventario/') || ['insumos', 'compras', 'movimientos'].some(name => path === `/api/v1/gestion/${name}`))) });
  assert.deepEqual(operationDifferences(inventory(previous), inventory(contract)), {
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
});

test('hora estimada de llegada es opcional y nullable, con minutos locales estrictos y sin valor por defecto', () => {
  const hora = definitions.HoraEstimadaLlegada;
  assert.deepEqual(hora.type, ['string', 'null']);
  assert.equal(hora.default, undefined);
  assert.ok(!definitions.ReservaWebPeticion.required.includes('horaEstimadaLlegada'));
  assert.ok(definitions.ReservaDetalle.required.includes('horaEstimadaLlegada'));
  for (const name of ['ReservaWebPeticion', 'ReservaDetalle']) {
    assert.equal(definitions[name].properties.horaEstimadaLlegada.$ref, '#/components/schemas/HoraEstimadaLlegada');
  }
  const valid = new RegExp(hora.pattern);
  assert.equal(hora.minLength, 5);
  assert.equal(hora.maxLength, 5);
  for (const value of ['00:00', '09:05', '18:30', '23:59']) assert.ok(valid.test(value), value);
  for (const value of ['', '9:05', '24:00', '18:60', '18:30:00', '18:30Z', '18:30-06:00', ' 18:30']) assert.ok(!valid.test(value), value);
  assert.match(hora.description, /America\/Guatemala/);
  assert.match(hora.description, /Sin valor por defecto ni relleno histórico/);
});

test('ambas reservas públicas aceptan hora y conservan privacidad, permisos y reenvíos', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const previous = load(execFileSync('git', ['-C', root, 'show', '827cafcb98932ca93a81575bec6e26736663bcfe:openapi.yaml'], { encoding: 'utf8' }));
  const creations = document => ({ paths: Object.fromEntries(Object.entries(document.paths)
    .filter(([path, item]) => item.post && (path === '/api/v1/publico/reservas' || path.startsWith('/api/v1/publico/ofertas/')))
    .map(([path, item]) => [path, { post: item.post }])) });
  assert.deepEqual(operationDifferences(creations(previous), creations(contract)), { missing: [], extra: ['POST /api/v1/publico/ofertas/{slug}/reservas'] });
  for (const path of ['/api/v1/publico/reservas', '/api/v1/publico/ofertas/{slug}/reservas']) {
    const op = contract.paths[path].post;
    assert.deepEqual(op.security, []);
    assert.equal(op.requestBody.content['application/json'].schema.$ref, '#/components/schemas/ReservaWebPeticion');
    assert.equal(op.requestBody.content['application/json'].example.horaEstimadaLlegada, '18:30');
    assert.match(op.description, /BOOKING_REQUEST_CONFLICT/);
    assert.match(op.description, /omitirla y enviar null son equivalentes/);
    assert.ok(op.responses['201']);
    assert.ok(op.responses['400']);
    assert.ok(op.responses['409']);
    assert.equal(op.parameters.find(p => p.name === 'Idempotency-Key').required, true);
  }
  for (const name of ['EstadoReservaPublico', 'ReservaWebCreada', 'ReservaResumen', 'ReservaCalendario']) {
    assert.deepEqual(definitions[name], previous.components.schemas[name], name);
  }
  for (const [path, item] of Object.entries(previous.paths)) {
    for (const [method, operation] of Object.entries(item)) {
      assert.deepEqual(contract.paths[path][method].security, operation.security, `${method} ${path}`);
    }
  }
  const example = contract.paths['/api/v1/reservas/{codigo}'].get.responses['200'].content['application/json'].example;
  assert.equal(example.horaEstimadaLlegada, '18:30');
  for (const item of Object.values(contract.paths)) for (const op of Object.values(item)) {
    for (const response of Object.values(op.responses ?? {})) {
      const media = response.content?.['application/json'];
      if (media?.schema?.$ref === '#/components/schemas/ReservaDetalle') {
        assert.ok(Object.hasOwn(media.example, 'horaEstimadaLlegada'));
      }
    }
  }
});

test('consultas de ofertas públicas documentan el catálogo consumido por web sin notas internas', () => {
  const op = contract.paths['/api/v1/publico/ofertas'].get;
  assert.deepEqual(op.security, []);
  assert.equal(op.responses['200'].content['application/json'].schema.items.$ref, '#/components/schemas/OfertaPublica');
  const dto = definitions.OfertaPublica;
  for (const field of ['slug', 'name', 'price', 'capacity', 'apiTypeId', 'bookable']) assert.ok(dto.required.includes(field));
  assert.deepEqual(dto.not, { required: ['pendingFeatures'] });
  assert.equal(dto.properties.image.format, undefined); // Las imágenes del API pueden ser rutas relativas.
  const example = op.responses['200'].content['application/json'].example[0];
  for (const field of dto.required) assert.ok(Object.hasOwn(example, field), field);
  assert.ok(!Object.hasOwn(example, 'pendingFeatures'));
  assert.match(op.description, /no garantiza disponibilidad/);
});

test('disponibilidad de ofertas usa los parámetros de Spring, cotización fija e inventario compartido', () => {
  const op = contract.paths['/api/v1/publico/ofertas/disponibilidad'].get;
  assert.deepEqual(op.security, []);
  assert.deepEqual(op.parameters.map(p => p.$ref), ['Entrada', 'Salida', 'Huespedes'].map(name => `#/components/parameters/${name}`));
  assert.equal(contract.components.parameters.Huespedes.name, 'huespedes');
  assert.ok(op.responses['400']);
  const dto = definitions.OpcionOfertaDisponible;
  assert.ok(dto.required.includes('ofertaSlug'));
  assert.ok(dto.required.includes('inventarioCompartido'));
  assert.equal(dto.properties.tipoHabitacion.properties.fotos.items.format, undefined);
  const example = op.responses['200'].content['application/json'].example[0];
  for (const field of dto.required) assert.ok(Object.hasOwn(example, field), field);
  assert.equal(example.inventarioCompartido, `tipo-${example.tipoHabitacion.id}`);
  assert.equal(example.noches, example.desglose.length);
  assert.equal(example.total, example.desglose.reduce((sum, night) => sum + night.precio, 0));
  for (const night of example.desglose) {
    assert.equal(night.precio, example.tipoHabitacion.precioBaseNoche);
    assert.equal(night.temporada, null);
    assert.equal(night.finDeSemana, false);
  }
  const fixedPrice = dto.properties.desglose.items.allOf[1].properties;
  assert.equal(fixedPrice.temporada.type, 'null');
  assert.equal(fixedPrice.finDeSemana.const, false);
  for (const path of ['/api/v1/publico/ofertas', '/api/v1/publico/ofertas/disponibilidad']) {
    assert.deepEqual(contract['x-permisos'][`GET ${path}`].roles, []);
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

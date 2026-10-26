import test from 'node:test';
import { load } from 'js-yaml';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { operationDifferences, generatedTypes, validateMarkdownLinks } from './contrato-api.mjs';

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
  for (const name of ['ReservaWebCreada', 'ReservaResumen', 'ReservaCalendario']) {
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
  assert.equal(definitions.EstadoReservaPublico.allOf[0].$ref, '#/components/schemas/ProcesoPago');
  assert.deepEqual(definitions.EstadoReservaPublico.allOf[1].required, ['codigo', 'estadoReserva', 'pagoVenceEn']);
});

test('proceso de pago distingue acción y checkout sin perder los campos públicos previos', () => {
  assert.deepEqual(definitions.EstadoCheckout.enum, ['SIN_CHECKOUT', 'ABIERTO', 'PROCESANDO', 'PAGADO', 'VENCIDO', 'NO_VERIFICADO']);
  assert.deepEqual(definitions.AccionPago.enum, ['INICIAR', 'CONTINUAR', 'ESPERAR', 'REINTENTAR', 'NINGUNA']);
  const process = definitions.ProcesoPago;
  assert.deepEqual(process.required, ['estadoPago', 'estadoCheckout', 'accionPago', 'puedeReintentar', 'urlPago', 'expiraEn']);
  assert.deepEqual(process.properties.urlPago.type, ['string', 'null']);
  assert.match(process.properties.puedeReintentar.description, /solo para REINTENTAR/);
  const op = contract.paths['/api/v1/publico/reservas/{codigo}/estado'].get;
  assert.deepEqual(op.security, []);
  assert.match(op.description, /no acredita pagos ni crea sesiones/);
  const example = op.responses['200'].content['application/json'].examples.pendiente.value;
  assert.equal(example.estadoPago, 'PENDIENTE');
  assert.equal(example.accionPago, 'ESPERAR');
  assert.equal(example.puedeReintentar, false);
  assert.equal(example.urlPago, null);
  assert.ok(example.pagoVenceEn);
  for (const field of ['nombre', 'correo', 'huesped', 'checkoutId']) {
    assert.equal(process.properties[field], undefined);
    assert.equal(definitions.EstadoReservaPublico.allOf[1].properties[field], undefined);
  }
});

test('recuperación exige prueba vigente y conserva la compatibilidad de los reenvíos históricos', () => {
  const op = contract.paths['/api/v1/publico/reservas/intento'].get;
  assert.deepEqual(op.security, []);
  const names = op.parameters.filter(p => p.$ref).map(p => p.$ref.split('/').at(-1));
  assert.deepEqual(names, ['BookingIdempotencyKey', 'BookingDraft', 'BookingEmailVerification']);
  for (const name of names) assert.equal(contract.components.parameters[name].required, true);
  assert.deepEqual(op.parameters.find(p => p.name === 'origen').schema.enum, ['RESERVA', 'OFERTA']);
  for (const status of ['200', '400', '404', '409', '429']) assert.ok(op.responses[status]);
  assert.match(op.description, /nunca autoriza generar otra clave/);
  for (const path of ['/api/v1/publico/reservas', '/api/v1/publico/ofertas/{slug}/reservas']) {
    const params = contract.paths[path].post.parameters;
    for (const name of ['X-Booking-Draft', 'X-Booking-Email-Verification']) {
      assert.equal(params.find(p => p.name === name).required, false);
    }
    assert.equal(contract.paths[path].post.requestBody.content['application/json'].example.horaEstimadaLlegada, '18:30');
  }
  const guest = contract.paths['/api/v1/app/reservas/{codigo}/pago-saldo/estado'].get;
  assert.deepEqual(guest.security, [{ bearerAuth: [] }]);
  assert.deepEqual(guest['x-autorizacion'].roles, ['HUESPED']);
  assert.match(guest['x-autorizacion'].propiedad.regla, /ajeno responde 404/);
  assert.equal(guest.responses['200'].content['application/json'].schema.$ref, '#/components/schemas/ProcesoPago');
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

test('fotos de tipos de habitación exigen ADMIN, JPG/PNG hasta 5 MiB y ejemplos públicos en CDN sin MinIO', () => {
  const upload = contract.paths['/api/v1/archivos/imagenes'].post;
  const associate = contract.paths['/api/v1/admin/tipos-habitacion/{id}/fotos'].put;
  assert.deepEqual(upload.security, [{ bearerAuth: [] }]);
  assert.deepEqual(associate.security, [{ bearerAuth: [] }]);
  assert.deepEqual(associate['x-autorizacion'].roles, ['ADMIN']);
  assert.ok(definitions.SubirImagenPeticion.properties.uso.enum.includes('TIPO_HABITACION'));
  assert.match(upload.description, /JPG\/PNG hasta 5 MiB/);
  assert.match(associate.description, /exactamente una principal/);
  assert.deepEqual(definitions.ImagenSubida.required, ['clave']);
  assert.deepEqual(definitions.FotoCatalogo.required, ['clave', 'url', 'principal', 'orden']);
  assert.match(definitions.FotoCatalogo.examples[0].url, /^https:\/\/d13s29erv78l4g\.cloudfront\.net\/tipos\//);
  assert.doesNotMatch(definitions.UrlFoto.description, /\bMinIO\b/i);
});

test('valida todos los enlaces Markdown locales del repositorio sin destinos ni fragmentos rotos', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  assert.deepEqual(validateMarkdownLinks(root), []);
});

test('detecta ruta correcta, ruta inexistente, archivo movido, URL codificada, directorios y fragmento inválido', () => {
  const directory = mkdtempSync(join(tmpdir(), 'markdown-links-'));
  try {
    mkdirSync(join(directory, '02-producto/historias-de-usuario'), { recursive: true });
    mkdirSync(join(directory, '03-arquitectura/diagramas-sistema'), { recursive: true });
    mkdirSync(join(directory, '04-guias-y-referencia/historico'), { recursive: true });
    writeFileSync(join(directory, '02-producto/reglas-de-negocio.md'), '# Reglas de Negocio (RN)\n\n## 3. Reservas — RN-RES\n');
    writeFileSync(join(directory, '02-producto/historias-de-usuario/HU - Cliente y Huesped.md'), '# HU Cliente\n\n## Criterios de aceptación\n');
    writeFileSync(join(directory, '03-arquitectura/arquitectura-sistema.md'), '# Tecnologías y Arquitectura\n\n## 2. Decisiones de arquitectura\n');
    writeFileSync(
      join(directory, '04-guias-y-referencia/historico/contexto-original-chat.md'),
      '# Contexto histórico\n\n- [`20 - Diagramas del Sistema/`](20%20-%20Diagramas%20del%20Sistema/README.md)\n',
    );
    writeFileSync(
      join(directory, '03-arquitectura/diagramas-sistema/01-prueba.md'),
      [
        '# Diagrama de prueba',
        '- [Ruta correcta](../arquitectura-sistema.md#2-decisiones-de-arquitectura)',
        '- [URL codificada con espacios](../../02-producto/historias-de-usuario/HU%20-%20Cliente%20y%20Huesped.md#criterios-de-aceptación)',
        '- [Directorio válido](../../02-producto/)',
        '```markdown',
        '[Enlace dentro de bloque de código](../no-se-evalua.md)',
        '```',
      ].join('\n'),
    );
    assert.deepEqual(validateMarkdownLinks(directory), []);

    writeFileSync(
      join(directory, '03-arquitectura/diagramas-sistema/02-errores.md'),
      [
        '# Casos de fallo',
        '- [Ruta inexistente](./no-existe.md)',
        '- [Archivo movido de numeración antigua](../14%20-%20Tecnologias%20y%20Arquitectura.md)',
        '- [Fragmento inválido](../../02-producto/reglas-de-negocio.md#seccion-inexistente)',
        '- [Enlace ficticio](#)',
      ].join('\n'),
    );
    const errors = validateMarkdownLinks(directory);
    assert.equal(errors.length, 4);
    assert.match(errors[0], /destino inexistente \(\.\/no-existe\.md\)/);
    assert.match(errors[1], /destino inexistente \(\.\.\/14%20-%20Tecnologias%20y%20Arquitectura\.md\)/);
    assert.match(errors[2], /fragmento inexistente #seccion-inexistente/);
    assert.match(errors[3], /enlace vacío o ficticio \(#\)/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('inicialización del hotel tiene creación y repetición sin campos de fotos o facturación', () => {
  const operation=contract.paths['/api/v1/admin/hotel/inicializacion'].post;
  assert.equal(operation.operationId,'inicializarHotelAdmin');
  assert.deepEqual(operation['x-autorizacion'].roles,['ADMIN']);
  assert.deepEqual(Object.keys(operation.responses).sort(),['200','201','400','401','403','409']);
  const input=definitions.InicializarHotelPeticion;
  assert.equal(input.additionalProperties,false);
  assert.deepEqual(input.required,[ 'nombre','descripcion','direccion','telefono','correo','nombreComercial','razonSocial','nit','direccionFiscal']);
  assert.deepEqual(Object.keys(input.properties),input.required);
  assert.equal(input.properties.descripcion.maxLength,4000);
  assert.match(operation.description,/Idempotencia natural/);
  assert.deepEqual(contract['x-permisos']['POST /api/v1/admin/hotel/inicializacion'].roles,['ADMIN']);
});
test('GET y PUT del hotel documentan ausencia sin inicialización implícita', () => {
  for(const method of ['get','put']) assert.match(contract.paths['/api/v1/admin/hotel'][method].responses['404'].description,/HOTEL_NO_CONFIGURADO/);
  assert.match(contract.paths['/api/v1/admin/hotel'].put.description,/Solo actualiza una configuración existente/);
});

test('galería HOTEL reutiliza operaciones y protege cambios sin exigir revisión fiscal', () => {
  const path=contract.paths['/api/v1/admin/hotel'];
  assert.ok(path.get.responses['200'].headers.ETag);
  assert.ok(path.put.responses['200'].headers.ETag);
  const revision=path.put.parameters.find(p=>p.name==='If-Match');
  assert.equal(revision.in,'header');
  assert.equal(revision.required,false);
  assert.match(revision.description,/GALERIA_CAMBIADA/);
  assert.ok(!definitions.HotelAdminPeticion.required.includes('fotos'));
  assert.equal(definitions.HotelAdminPeticion.properties.fotos.type,'array');
  assert.match(definitions.HotelAdminPeticion.properties.fotos.description,/sin borrar objetos/);
  assert.equal(path.delete,undefined);
  assert.ok(definitions.SubirImagenPeticion.properties.uso.enum.includes('HOTEL'));
});

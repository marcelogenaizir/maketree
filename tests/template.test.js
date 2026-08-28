const { test } = require('uvu');
const assert = require('uvu/assert');
const { getTemplate, getAvailableTemplates } = require('../src/templates');

test('Templates: Obtener plantilla por clave y por alias', () => {
  const goDirect = getTemplate('go-ddd');
  const goAlias = getTemplate('go');

  assert.ok(goDirect);
  assert.is(goDirect.key, goAlias.key);
});

test('Templates: Listar plantillas disponibles', () => {
  const list = getAvailableTemplates();
  assert.ok(list.length >= 4);
});

test('Templates: Muestra la lista de plantillas disponibles con clave y descripción', () => {
  const list = getAvailableTemplates();
  assert.ok(Array.isArray(list));
  assert.ok(list.length > 0);
  assert.ok(list[0].key);
  assert.ok(list[0].description);
});

test.run();
// ── Canselion SRL · Google Apps Script ───────────────────────────────────────
// Publica este archivo como Web App en Google Apps Script.
// Cada POST del formulario /registros agrega una fila en la hoja "Registros".
//
// Pasos para publicar:
//   1. Abrí script.google.com → Nuevo proyecto
//   2. Pegá este código completo
//   3. Guardá (Ctrl+S)
//   4. Implementar → Nueva implementación → Tipo: Aplicación web
//      - Ejecutar como: Yo (tu cuenta de Google)
//      - Quién tiene acceso: Cualquier usuario (Anyone, even anonymous)
//   5. Copiá la URL generada → pegala en Vercel como VITE_GAS_ENDPOINT
// ─────────────────────────────────────────────────────────────────────────────

var SHEET_ID      = '1ufXrnJ0cf5jeceeDaZBebxg2o6-I5gMxqF5_mrKJEyE';
var SHEET_NAME    = 'Registros';
var MAX_POR_HORA  = 60;

// Columnas en orden
var COLUMNAS = [
  'Fecha y hora',
  'Nombre y apellido',
  'Celular',
  'Localidad / Departamento',
  '¿Ya es socio/a?',
  'Situación',
  'Consentimiento aceptado',
  'Origen del lead',
  'UTM Source',
  'UTM Campaign',
  'UTM Ad',
  'UTM Content',
  'Estado',
  'Promotor asignado',
  'Observaciones',
];

// Verifica que el request venga del formulario (clave guardada en PropertiesService)
function verificarApiKey(key) {
  var stored = PropertiesService.getScriptProperties().getProperty('API_SECRET');
  if (!stored || !key) return false;
  return stored === key;
}

// Limita a MAX_POR_HORA envíos por hora usando LockService para evitar race conditions
function verificarRateLimit() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(3000);
    var props = PropertiesService.getScriptProperties();
    var raw   = props.getProperty('RATE_LIMIT') || '{}';
    var rl    = JSON.parse(raw);
    var ahora = Date.now();
    if (!rl.resetAt || ahora > rl.resetAt) {
      rl = { count: 1, resetAt: ahora + 3600000 };
    } else {
      rl.count = (rl.count || 0) + 1;
    }
    props.setProperty('RATE_LIMIT', JSON.stringify(rl));
    return rl.count <= MAX_POR_HORA;
  } catch (e) {
    return true;
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Valida que los campos obligatorios tengan valores esperados
function validarDatos(data) {
  var nombre    = (data.nombre    || '').trim();
  var celular   = (data.celular   || '').replace(/\D/g, '');
  var esSocio   = (data.esSocio   || '').trim();
  var situacion = (data.situacion || '').trim();

  if (!nombre || nombre.length > 120 || nombre.indexOf(' ') === -1) return false;
  if (celular.length !== 9 || celular.substring(0, 2) !== '09')     return false;
  if (['Sí', 'No'].indexOf(esSocio) === -1)                         return false;
  if (['Jubilado/a', 'Pensionista'].indexOf(situacion) === -1)      return false;
  if (data.consentimiento !== 'Sí')                                  return false;
  return true;
}

function sanitizar(val) {
  var s = (val || '').toString().trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    var raw  = (e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    if (!verificarApiKey(data.apiSecret)) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (!verificarRateLimit()) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Rate limit exceeded' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (!validarDatos(data)) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Invalid data' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss   = SpreadsheetApp.openById(SHEET_ID);
    var hoja = ss.getSheetByName(SHEET_NAME);

    if (!hoja) {
      hoja = ss.insertSheet(SHEET_NAME);
    }

    if (hoja.getLastRow() === 0) {
      hoja.appendRow(COLUMNAS);
      hoja.getRange(1, 1, 1, COLUMNAS.length)
        .setFontWeight('bold')
        .setBackground('#1e3a5f')
        .setFontColor('#ffffff');
      hoja.setFrozenRows(1);
      // Fuerza la columna Celular (C) a texto para preservar ceros iniciales
      hoja.getRange(2, 3, 10000, 1).setNumberFormat('@');
    }

    var celularNuevo = (data.celular || '').replace(/\D/g, '');
    var esDuplicado  = false;
    var ultimaFila   = hoja.getLastRow();
    if (celularNuevo && ultimaFila > 1) {
      var celulares = hoja.getRange(2, 3, ultimaFila - 1, 1).getValues();
      esDuplicado = celulares.some(function(r) {
        return r[0].toString().replace(/\D/g, '') === celularNuevo;
      });
    }

    hoja.appendRow([
      sanitizar(data.fecha),
      sanitizar(data.nombre),
      sanitizar(data.celular),
      sanitizar(data.localidad),
      sanitizar(data.esSocio),
      sanitizar(data.situacion),
      sanitizar(data.consentimiento),
      sanitizar(data.origen) || 'Directo',
      sanitizar(data.utmSource),
      sanitizar(data.utmCampaign),
      sanitizar(data.utmAd),
      sanitizar(data.utmContent),
      esDuplicado ? 'Duplicado' : 'Nuevo',
      '',
      '',
    ]);

    if (esDuplicado) {
      hoja.getRange(hoja.getLastRow(), 1, 1, COLUMNAS.length)
        .setBackground('#fecaca');
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET de prueba — abrí la URL del Web App en el navegador para verificar que funciona
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: 'Apps Script activo · Canselion SRL' }))
    .setMimeType(ContentService.MimeType.JSON);
}


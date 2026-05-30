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

var SHEET_ID     = '1ufXrnJ0cf5jeceeDaZBebxg2o6-I5gMxqF5_mrKJEyE';
var SHEET_NAME   = 'Registros';
var MAX_POR_HORA = 60;

// Columnas en orden
var COLUMNAS = [
  'Fecha y hora',              // 1
  'Nombre y apellido',         // 2
  'Celular',                   // 3
  'Cédula',                    // 4  ← nuevo
  'Localidad / Departamento',  // 5
  '¿Ya es socio/a?',           // 6
  'Situación',                 // 7
  '¿Qué buscás?',              // 8
  'Consentimiento aceptado',   // 9
  'Origen del lead',           // 10
  'UTM Source',                // 11
  'UTM Campaign',              // 12
  'UTM Ad',                    // 13
  'UTM Content',               // 14
  'Estado',                    // 15
  'Promotor asignado',         // 16
  'Observaciones',             // 17
];

var COL_CEDULA   = 4;
var COL_ES_SOCIO = 6;

function jsonResp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function verificarApiKey(key) {
  var stored = PropertiesService.getScriptProperties().getProperty('API_SECRET');
  if (!stored || !key) return false;
  return stored === key;
}

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

function validarDatos(data) {
  var nombre    = (data.nombre    || '').trim();
  var celular   = (data.celular   || '').replace(/\D/g, '');
  var cedula    = (data.cedula    || '').replace(/\D/g, '');
  var situacion = (data.situacion || '').trim();
  var busqueda  = (data.busqueda  || '').trim();

  if (!nombre || nombre.length > 120 || nombre.indexOf(' ') === -1) return false;
  if (celular.length !== 9 || celular.substring(0, 2) !== '09')     return false;
  if (cedula.length < 6 || cedula.length > 8)                       return false;
  if (['Jubilado/a', 'Pensionista'].indexOf(situacion) === -1)      return false;
  if (['Préstamo en efectivo', 'Electrodoméstico', 'Servicios médicos y odontológicos'].indexOf(busqueda) === -1) return false;
  if (data.consentimiento !== 'Sí')                                  return false;
  return true;
}

function sanitizar(val) {
  var s = (val || '').toString().trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Busca la fila más reciente por cédula y actualiza la columna ¿Ya es socio/a?
function actualizarSocioEnHoja(cedula, esSocio) {
  var ss   = SpreadsheetApp.openById(SHEET_ID);
  var hoja = ss.getSheetByName(SHEET_NAME);
  if (!hoja || hoja.getLastRow() < 2) return false;

  var cedulaBuscada = cedula.replace(/\D/g, '');
  var filas = hoja.getRange(2, COL_CEDULA, hoja.getLastRow() - 1, 1).getValues();

  for (var i = filas.length - 1; i >= 0; i--) {
    var cedFila = filas[i][0].toString().replace(/\D/g, '');
    if (cedFila && cedFila === cedulaBuscada) {
      hoja.getRange(i + 2, COL_ES_SOCIO).setValue(sanitizar(esSocio));
      return true;
    }
  }
  return false;
}

function doPost(e) {
  try {
    var raw  = (e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    if (!verificarApiKey(data.apiSecret)) {
      return jsonResp({ ok: false, error: 'Unauthorized' });
    }

    // Segundo envío: actualiza esSocio en la fila ya guardada
    if (data.tipo === 'actualizarSocio') {
      var cedula  = (data.cedula  || '').replace(/\D/g, '');
      var esSocio = (data.esSocio || '').trim();
      if (!cedula || ['Sí', 'No'].indexOf(esSocio) === -1) {
        return jsonResp({ ok: false, error: 'Invalid data' });
      }
      var updated = actualizarSocioEnHoja(cedula, esSocio);
      return jsonResp({ ok: true, updated: updated });
    }

    // Primer envío: registro completo sin esSocio
    if (!verificarRateLimit()) {
      return jsonResp({ ok: false, error: 'Rate limit exceeded' });
    }

    if (!validarDatos(data)) {
      return jsonResp({ ok: false, error: 'Invalid data' });
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
      hoja.getRange(2, 3, 10000, 1).setNumberFormat('@'); // Celular como texto
      hoja.getRange(2, 4, 10000, 1).setNumberFormat('@'); // Cédula como texto
    }

    var celularNuevo = (data.celular || '').replace(/\D/g, '');
    var cedulaNueva  = (data.cedula  || '').replace(/\D/g, '');
    var esDuplicado  = false;
    var ultimaFila   = hoja.getLastRow();
    if (ultimaFila > 1) {
      var celulares = hoja.getRange(2, 3, ultimaFila - 1, 1).getValues();
      var cedulas   = hoja.getRange(2, 4, ultimaFila - 1, 1).getValues();
      esDuplicado = celulares.some(function(r, i) {
        var cel = r[0].toString().replace(/\D/g, '');
        var ced = cedulas[i][0].toString().replace(/\D/g, '');
        return (celularNuevo && cel === celularNuevo) || (cedulaNueva && ced === cedulaNueva);
      });
    }

    hoja.appendRow([
      sanitizar(data.fecha),
      sanitizar(data.nombre),
      sanitizar(data.celular),
      sanitizar(data.cedula),
      sanitizar(data.localidad),
      'Pendiente',             // esSocio se actualiza con el segundo envío
      sanitizar(data.situacion),
      sanitizar(data.busqueda),
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

    return jsonResp({ ok: true });

  } catch (err) {
    return jsonResp({ ok: false, error: err.toString() });
  }
}

// GET de prueba — abrí la URL del Web App en el navegador para verificar que funciona
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: 'Apps Script activo · Canselion SRL' }))
    .setMimeType(ContentService.MimeType.JSON);
}

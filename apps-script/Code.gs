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

var SHEET_ID          = '1ufXrnJ0cf5jeceeDaZBebxg2o6-I5gMxqF5_mrKJEyE';
var SHEET_NAME        = 'Registros';
var TURNSTILE_SECRET  = 'REMOVED_SECRET';           // nombre de la hoja (pestaña)

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

function verificarTurnstile(token) {
  if (!token) return false;
  try {
    var resp = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
      method:      'post',
      contentType: 'application/x-www-form-urlencoded',
      payload:     'secret=' + TURNSTILE_SECRET + '&response=' + encodeURIComponent(token),
    });
    return JSON.parse(resp.getContentText()).success === true;
  } catch (e) {
    return false;
  }
}

function sanitizar(val) {
  var s = (val || '').toString().trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    var raw  = (e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    if (!verificarTurnstile(data.turnstileToken)) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Verificación de seguridad fallida' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var hoja  = ss.getSheetByName(SHEET_NAME);

    // Si la hoja no existe la crea
    if (!hoja) {
      hoja = ss.insertSheet(SHEET_NAME);
    }

    // Agrega encabezados si la hoja está vacía
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

    // Detectar celular duplicado comparando dígitos solamente
    var celularNuevo = (data.celular || '').replace(/\D/g, '');
    var esDuplicado  = false;
    var ultimaFila   = hoja.getLastRow();
    if (celularNuevo && ultimaFila > 1) {
      var celulares = hoja.getRange(2, 3, ultimaFila - 1, 1).getValues();
      esDuplicado = celulares.some(function(r) {
        return r[0].toString().replace(/\D/g, '') === celularNuevo;
      });
    }

    // Nueva fila de datos
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

    // Si es duplicado, pintá toda la fila de rojo
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

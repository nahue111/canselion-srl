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

var SHEET_ID   = '1ufXrnJ0cf5jeceeDaZBebxg2o6-I5gMxqF5_mrKJEyE';
var SHEET_NAME = 'Registros';           // nombre de la hoja (pestaña)

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

function doPost(e) {
  try {
    var raw  = (e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

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
    }

    // Nueva fila de datos
    hoja.appendRow([
      data.fecha        || '',
      data.nombre       || '',
      data.celular      || '',
      data.localidad    || '',
      data.esSocio      || '',
      data.situacion    || '',
      data.consentimiento || '',
      data.origen       || 'Directo',
      data.utmSource    || '',
      data.utmCampaign  || '',
      data.utmAd        || '',
      data.utmContent   || '',
      'Nuevo',           // Estado por defecto
      '',                // Promotor asignado (vacío)
      '',                // Observaciones (vacío)
    ]);

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

// ============================================================
// CONFIGURACIÓN - REEMPLAZA ESTOS VALORES
// ============================================================

const SHEET_ID = "1kYhZxMIgJcfYtd4uHw2ctuH3aDepknUpy1Oce80WCJo";  // ID del Google Sheet "Inscripciones Campeonato Regional Matagalpa 2026"
const SHEET_NAME = "Hoja 1";  // Nombre de la hoja principal

// IDs de carpetas de Google Drive para guardar fotos
const DRIVE_FOLDERS = {
  selfies: "1iVQFPQTgbGsIXF6SZDSciBSdLWu9Ti6Z",        // ID carpeta SELFIES
  cedulaFrente: "1PJ2ZdOFxABR5tUbhp3a9aBplFb_hCPJt",    // ID carpeta CEDULA_FRENTE
  cedulaReverso: "1Vcnch4JcRgA9tZ3lP3izEZJE7_0ifo3o"    // ID carpeta CEDULA_REVERSO
};

// Email para notificaciones (opcional)
const ADMIN_EMAIL = "tu_email@gmail.com";

// ============================================================
// FUNCIÓN PRINCIPAL: recibir datos del formulario
// ============================================================

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // Procesar fotos y obtener URLs
    const fotoSelfieUrl = procesarFoto(
      payload.fotoSelfie.base64, 
      `${payload.cedula}_selfie.jpg`,
      DRIVE_FOLDERS.selfies
    );
    
    const fotoCedulaFrenteUrl = procesarFoto(
      payload.fotoCedulaFrente.base64,
      `${payload.cedula}_cedula_frente.jpg`,
      DRIVE_FOLDERS.cedulaFrente
    );
    
    const fotoCedulaReversoUrl = procesarFoto(
      payload.fotoCedulaReverso.base64,
      `${payload.cedula}_cedula_reverso.jpg`,
      DRIVE_FOLDERS.cedulaReverso
    );
    
    // Preparar fila para Google Sheets
    const row = [
      payload.timestamp || new Date().toLocaleString("es-NI", { timeZone: "America/Managua" }),
      payload.nombreCompleto,
      payload.cedula,
      payload.sexo === "masculino" ? "M" : "F",
      payload.edad || calcularEdad(payload.fechaNacimiento),
      payload.fechaNacimiento,
      payload.telefono,
      payload.email,
      payload.departamento,
      payload.ciudad,
      payload.direccion,
      payload.club || (payload.atletaLibre ? "ATLETA LIBRE" : ""),
      payload.atletaLibre ? "SÍ" : "NO",
      payload.entrenador || "",
      payload.telefonoEntrenador || "",
      payload.experienciaEntrenador || "",
      payload.pesoActual,
      payload.estatura,
      payload.contactoEmergencia,
      payload.telefonoEmergencia,
      payload.parentesco || "",
      fotoSelfieUrl,
      fotoCedulaFrenteUrl,
      fotoCedulaReversoUrl
    ];
    
    // Guardar en Google Sheets
    agregarFila(row);
    
    // Enviar notificación (opcional)
    if (ADMIN_EMAIL && ADMIN_EMAIL !== "tu_email@gmail.com") {
      enviarNotificacion(payload, fotoSelfieUrl);
    }
    
    // Respuesta exitosa
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Inscripción registrada correctamente",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================
// FUNCIÓN: Calcular edad a partir de fecha de nacimiento
// ============================================================

function calcularEdad(fechaNacimiento) {
  try {
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  } catch (error) {
    return "";
  }
}

// ============================================================
// FUNCIÓN: Procesar y guardar foto en Google Drive
// ============================================================

function procesarFoto(base64String, nombreArchivo, folderId) {
  try {
    // Limpiar el base64 si tiene prefijo
    let cleanBase64 = base64String;
    if (base64String.startsWith('data:image/')) {
      cleanBase64 = base64String.split(',')[1];
    }
    
    // Decodificar Base64
    const binaryString = Utilities.base64Decode(cleanBase64);
    const blob = Utilities.newBlob(binaryString, "image/jpeg", nombreArchivo);
    
    // Obtener carpeta y guardar archivo
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    
    // Obtener URL de descarga
    const fileUrl = file.getUrl();
    
    Logger.log(`Foto guardada: ${nombreArchivo} - ${fileUrl}`);
    return fileUrl;
    
  } catch (error) {
    Logger.log("Error procesando foto: " + error);
    return "Error al guardar";
  }
}

// ============================================================
// FUNCIÓN: Agregar fila a Google Sheets
// ============================================================

function agregarFila(row) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, crearla
    if (!sheet) {
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      setupSheet(newSheet);
    }
    
    // Obtener última fila y agregar nueva
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow + 1, 1, 1, row.length);
    range.setValues([row]);
    
    Logger.log(`Fila ${lastRow + 1} agregada exitosamente`);
    
  } catch (error) {
    Logger.log("Error agregando fila: " + error);
    throw error;
  }
}

// ============================================================
// FUNCIÓN: Configurar hoja con encabezados
// ============================================================

function setupSheet(sheet) {
  const headers = [
    "Timestamp", "Nombre", "Cédula", "Sexo", "Edad", "Fecha Nac", "Teléfono", "Email", 
    "Depto", "Ciudad", "Dirección", "Club", "Atleta Libre", "Entrenador", "Telf Entrenador", 
    "Años Exp", "Peso (Kg)", "Estatura (Mt)", "Emergencia", "Telf Emerg", "Parentesco", 
    "Selfie URL", "Cédula Frente URL", "Cédula Reverso URL"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange("A1:X1").setFontWeight("bold");
  sheet.autoResizeColumns();
}

// ============================================================
// FUNCIÓN: Enviar notificación por email
// ============================================================

function enviarNotificacion(payload, fotoSelfieUrl) {
  try {
    const asunto = `✅ Nueva Inscripción: ${payload.nombreCompleto}`;
    const cuerpo = `
      <h2>🏆 Inscripción Registrada - FENIFISC 2026</h2>
      <p><strong>Evento:</strong> ${payload.evento || "Campeonato Departamental del Norte 2026"}</p>
      <p><strong>Atleta:</strong> ${payload.nombreCompleto}</p>
      <p><strong>Cédula:</strong> ${payload.cedula}</p>
      <p><strong>Peso:</strong> ${payload.pesoActual} Kg</p>
      <p><strong>Estatura:</strong> ${payload.estatura} Mt</p>
      <p><strong>Team/Gym:</strong> ${payload.atletaLibre ? "Atleta Libre" : (payload.club || "No especificado")}</p>
      <p><strong>Email:</strong> ${payload.email || "No proporcionado"}</p>
      <p><strong>Teléfono:</strong> ${payload.telefono}</p>
      <p><strong>Timestamp:</strong> ${payload.timestamp}</p>
      <hr>
      <p><em>📸 Fotos procesadas y almacenadas en Google Drive</em></p>
      <p><a href="${fotoSelfieUrl}">Ver Selfie</a></p>
    `;
    
    MailApp.sendEmail(ADMIN_EMAIL, asunto, "", { htmlBody: cuerpo });
    Logger.log("Notificación enviada a " + ADMIN_EMAIL);
    
  } catch (error) {
    Logger.log("Error enviando email: " + error);
  }
}

// ============================================================
// FUNCIÓN: Probar el script (opcional)
// ============================================================

function testScript() {
  Logger.log("✅ Script de FENIFISC 2026 cargado correctamente");
  Logger.log("📊 Sheet ID: " + SHEET_ID);
  Logger.log("📁 Carpetas configuradas: " + Object.keys(DRIVE_FOLDERS).length);
  Logger.log("📧 Email notificaciones: " + ADMIN_EMAIL);
  Logger.log("⏰ Esperando requests POST...");
}

// ============================================================
// FUNCIÓN: Obtener estadísticas (opcional)
// ============================================================

function getEstadisticas() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) return { error: "Hoja no encontrada" };
    
    const data = sheet.getDataRange().getValues();
    const totalInscripciones = data.length - 1; // Restar encabezado
    
    // Contar por sexo
    let masculinos = 0, femeninos = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i][3] === "M") masculinos++;
      else if (data[i][3] === "F") femeninos++;
    }
    
    return {
      total: totalInscripciones,
      masculinos: masculinos,
      femeninos: femeninos,
      fecha: new Date().toLocaleString("es-NI", { timeZone: "America/Managua" })
    };
    
  } catch (error) {
    Logger.log("Error obteniendo estadísticas: " + error);
    return { error: error.toString() };
  }
}

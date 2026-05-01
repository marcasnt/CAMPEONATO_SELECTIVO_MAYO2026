// ============================================================
// CONFIGURACIÓN - REEMPLAZA ESTOS VALORES
// ============================================================

// EVENTO ACTUAL: Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua
const EVENTO = "Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua";
const FECHA_EVENTO = "Sábado 23 de Mayo de 2026";
const LUGAR_EVENTO = "Polideportivo España, Managua";
const LUGAR_PESAJE = "Polideportivo España";
const HORA_PESAJE = "12:00 PM - 3:00 PM";
const HORA_EVENTO = "5:00 PM";

// ID del Google Sheet (REEMPLAZA CON EL TUYO)
const SHEET_ID = "TU_SHEET_ID_AQUI";
const SHEET_NAME = "Hoja 1";

// ID de carpeta principal de Google Drive donde se crearán las carpetas por atleta
// (REEMPLAZA CON TU PROPIO FOLDER_ID)
const DRIVE_MAIN_FOLDER = "TU_FOLDER_ID_PRINCIPAL";

// Email para notificaciones (opcional)
const ADMIN_EMAIL = "fenific@gmail.com";

// ============================================================
// FUNCIÓN PRINCIPAL: recibir datos del formulario
// ============================================================

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // Crear carpeta del atleta: "Nombre_Cedula"
    const nombreCarpeta = `${limpiarNombre(payload.nombreCompleto)}_${payload.cedula}`;
    const carpetaAtleta = crearCarpetaAtleta(nombreCarpeta, DRIVE_MAIN_FOLDER);

    // Procesar fotos y guardarlas en la carpeta del atleta
    const fotoSelfieUrl = procesarFoto(
      payload.fotoSelfie.base64,
      "selfie.jpg",
      carpetaAtleta
    );

    const fotoCedulaFrenteUrl = procesarFoto(
      payload.fotoCedulaFrente.base64,
      "cedula_frente.jpg",
      carpetaAtleta
    );

    const fotoCedulaReversoUrl = procesarFoto(
      payload.fotoCedulaReverso.base64,
      "cedula_reverso.jpg",
      carpetaAtleta
    );

    // Obtener URL de la carpeta del atleta
    const carpetaAtletaUrl = carpetaAtleta.getUrl();

    // Preparar fila para Google Sheets
    const row = [
      payload.timestamp || new Date().toLocaleString("es-NI", { timeZone: "America/Managua" }),
      EVENTO, // Columna B: Evento
      payload.nombreCompleto,
      payload.cedula,
      payload.sexo === "masculino" ? "M" : "F",
      payload.edad || calcularEdad(payload.fechaNacimiento),
      payload.fechaNacimiento,
      payload.telefono,
      payload.email,
      payload.departamento,
      payload.ciudad || "",
      payload.direccion || "",
      payload.club || (payload.atletaLibre ? "ATLETA LIBRE" : ""),
      payload.atletaLibre ? "SÍ" : "NO",
      payload.entrenador || "",
      payload.pesoActual,
      payload.estatura,
      payload.contactoEmergencia,
      payload.telefonoEmergencia,
      carpetaAtletaUrl,
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
// FUNCIÓN: Limpiar nombre para nombre de carpeta
// ============================================================

function limpiarNombre(nombre) {
  // Eliminar acentos y caracteres especiales, reemplazar espacios por guiones bajos
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toUpperCase();
}

// ============================================================
// FUNCIÓN: Crear carpeta para el atleta
// ============================================================

function crearCarpetaAtleta(nombreCarpeta, parentFolderId) {
  try {
    const parentFolder = DriveApp.getFolderById(parentFolderId);

    // Buscar si ya existe una carpeta con ese nombre
    const existingFolders = parentFolder.getFoldersByName(nombreCarpeta);
    if (existingFolders.hasNext()) {
      Logger.log(`Carpeta ya existe: ${nombreCarpeta}`);
      return existingFolders.next();
    }

    // Crear nueva carpeta
    const newFolder = parentFolder.createFolder(nombreCarpeta);
    Logger.log(`Carpeta creada: ${nombreCarpeta}`);
    return newFolder;

  } catch (error) {
    Logger.log("Error creando carpeta: " + error);
    throw error;
  }
}

// ============================================================
// FUNCIÓN: Procesar y guardar foto en carpeta del atleta
// ============================================================

function procesarFoto(base64String, nombreArchivo, carpetaAtleta) {
  try {
    // Limpiar el base64 si tiene prefijo
    let cleanBase64 = base64String;
    if (base64String.startsWith('data:image/')) {
      cleanBase64 = base64String.split(',')[1];
    }

    // Decodificar Base64
    const binaryString = Utilities.base64Decode(cleanBase64);
    const blob = Utilities.newBlob(binaryString, "image/jpeg", nombreArchivo);

    // Guardar archivo en la carpeta del atleta
    const file = carpetaAtleta.createFile(blob);

    // Obtener URL de descarga
    const fileUrl = file.getUrl();

    Logger.log(`Foto guardada en carpeta: ${nombreArchivo} - ${fileUrl}`);
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
    "Timestamp", "Evento", "Nombre", "Cédula", "Sexo", "Edad", "Fecha Nac", "Teléfono", "Email",
    "Departamento", "Ciudad", "Dirección", "Club", "Atleta Libre", "Entrenador",
    "Peso (Kg)", "Estatura (Mt)", "Emergencia", "Telf Emergencia",
    "Carpeta Atleta", "Selfie URL", "Cédula Frente URL", "Cédula Reverso URL"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange("A1:Y1").setFontWeight("bold");
  sheet.autoResizeColumns();
}

// ============================================================
// FUNCIÓN: Enviar notificación por email
// ============================================================

function enviarNotificacion(payload, fotoSelfieUrl) {
  try {
    const asunto = `✅ Nueva Inscripción: ${payload.nombreCompleto} - ${EVENTO}`;
    const cuerpo = `
      <h2>🏆 Nueva Inscripción - ${EVENTO}</h2>
      <p><strong>Atleta:</strong> ${payload.nombreCompleto}</p>
      <p><strong>Cédula:</strong> ${payload.cedula}</p>
      <p><strong>Sexo:</strong> ${payload.sexo === "masculino" ? "Masculino" : "Femenino"}</p>
      <p><strong>Fecha Nac:</strong> ${payload.fechaNacimiento}</p>
      <p><strong>Teléfono:</strong> ${payload.telefono}</p>
      <p><strong>Email:</strong> ${payload.email || "No proporcionado"}</p>
      <p><strong>Departamento:</strong> ${payload.departamento}</p>
      <p><strong>Ciudad:</strong> ${payload.ciudad || "No especificada"}</p>
      <p><strong>Club/Team:</strong> ${payload.atletaLibre ? "ATLETA LIBRE" : (payload.club || "No especificado")}</p>
      <p><strong>Entrenador:</strong> ${payload.entrenador || "No especificado"}</p>
      <p><strong>Peso:</strong> ${payload.pesoActual} Kg</p>
      <p><strong>Estatura:</strong> ${payload.estatura} Mt</p>
      <p><strong>Contacto Emergencia:</strong> ${payload.contactoEmergencia} (${payload.telefonoEmergencia})</p>
      <hr>
      <h3>📅 Fechas Importantes</h3>
      <p><strong>Fecha del Evento:</strong> ${FECHA_EVENTO}</p>
      <p><strong>Lugar:</strong> ${LUGAR_EVENTO}</p>
      <p><strong>Pesaje:</strong> ${LUGAR_PESAJE}, ${HORA_PESAJE}</p>
      <p><strong>Inicio:</strong> ${HORA_EVENTO}</p>
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
  Logger.log("=".repeat(50));
  Logger.log("✅ Script FENIFISC - " + EVENTO);
  Logger.log("=".repeat(50));
  Logger.log("📅 Fecha: " + FECHA_EVENTO);
  Logger.log("📍 Lugar: " + LUGAR_EVENTO);
  Logger.log("📊 Sheet ID: " + SHEET_ID);
  Logger.log("📁 Carpeta Principal: " + DRIVE_MAIN_FOLDER);
  Logger.log("📧 Email: " + ADMIN_EMAIL);
  Logger.log("⏰ Esperando inscripciones...");
  Logger.log("📂 Estructura: Carpetas por atleta (Nombre_Cedula)");
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

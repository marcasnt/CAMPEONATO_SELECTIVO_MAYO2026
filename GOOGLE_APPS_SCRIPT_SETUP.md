# 🚀 Guía Completa: Google Apps Script para FENIFISC Inscripción 2026

## Descripción General
Esta guía te ayudará a configurar un **Google Apps Script** que recopile automáticamente:
- ✅ Información de inscripción en **Google Sheets**
- 📸 Fotos de inscripción (Selfie + Cédula) en **Google Drive**
- 📧 Notificaciones por correo (opcional)

---

## 📋 PASO 1: Preparar Google Drive

### 1.1 Crear una carpeta para el evento

1. Ve a [Google Drive](https://drive.google.com)
2. Haz clic derecho → **Nueva carpeta**
3. Nombra la carpeta: `FENIFISC - Inscripciones 2026`
4. **Copia el ID de la carpeta** de la URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```
   Ejemplo: `1A2B3C4D5E6F7G8H9I0J`

### 1.2 Crear subcarpetas (opcional pero recomendado)

Dentro de la carpeta principal, crea:
- `Selfies`
- `Cedulas - Frente`
- `Cedulas - Reverso`

Cada una debe tener su propio **FOLDER_ID**

---

## 📊 PASO 2: Crear Google Sheet

### 2.1 Crear el spreadsheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Haz clic en **+ Nuevo Spreadsheet**
3. Nombra: `Inscripciones Campeonato Departamental del Norte 2026`
4. **Copia el SHEET_ID** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### 2.2 Crear las hojas (sheets)

Renombra la hoja `Sheet1` a `Inscripciones` y crea estos encabezados:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Timestamp** | **Nombre** | **Cédula** | **Sexo** | **Edad** | **Fecha Nac** | **Teléfono** | **Email** | **Depto** | **Ciudad** | **Dirección** | **Club** | **Atleta Libre** | **Entrenador** | **Telf Entrenador** | **Años Exp** | **Peso (Kg)** | **Estatura (Mt)** | **Emergencia** | **Telf Emerg** | **Parentesco** | **Selfie URL** | **Cédula Frente URL** | **Cédula Reverso URL** |

---

## 🔧 PASO 3: Crear Google Apps Script

### 3.1 Abrir Script Editor

1. Ve a tu **Google Sheet**
2. Click en **Herramientas** → **Editor de secuencias de comandos**
3. O accede directamente a [script.google.com](https://script.google.com)

### 3.2 Copiar el código principal

**Borra el código predeterminado** y copia este:

```javascript
// ============================================================
// CONFIGURACIÓN
// ============================================================

const SHEET_ID = "TU_SHEET_ID_AQUI";  // Reemplaza con tu Sheet ID
const SHEET_NAME = "Inscripciones";

// IDs de carpetas de Google Drive para guardar fotos
const DRIVE_FOLDERS = {
  selfies: "TU_FOLDER_ID_SELFIES",        // Copia el FOLDER_ID aquí
  cedulaFrente: "TU_FOLDER_ID_CEDULA_FRENTE",
  cedulaReverso: "TU_FOLDER_ID_CEDULA_REVERSO"
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
      payload.edad,
      payload.fechaNacimiento,
      payload.telefono,
      payload.email,
      payload.departamento,
      payload.ciudad,
      payload.direccion,
      payload.club,
      payload.atletaLibre ? "SÍ" : "NO",
      payload.entrenador,
      payload.telefonoEntrenador,
      payload.experienciaEntrenador,
      payload.pesoActual,
      payload.estatura,
      payload.contactoEmergencia,
      payload.telefonoEmergencia,
      payload.parentesco,
      fotoSelfieUrl,
      fotoCedulaFrenteUrl,
      fotoCedulaReversoUrl
    ];
    
    // Guardar en Google Sheets
    agregarFila(row);
    
    // Enviar notificación (opcional)
    enviarNotificacion(payload);
    
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
// FUNCIÓN: Procesar y guardar foto en Google Drive
// ============================================================

function procesarFoto(base64String, nombreArchivo, folderId) {
  try {
    // Decodificar Base64
    const binaryString = Utilities.base64Decode(base64String);
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
// FUNCIÓN: Enviar notificación por email
// ============================================================

function enviarNotificacion(payload) {
  try {
    const asunto = `✅ Nueva Inscripción: ${payload.nombreCompleto}`;
    const cuerpo = `
      <h2>Inscripción Registrada</h2>
      <p><strong>Evento:</strong> ${payload.evento || "Campeonato Departamental del Norte 2026"}</p>
      <p><strong>Atleta:</strong> ${payload.nombreCompleto}</p>
      <p><strong>Cédula:</strong> ${payload.cedula}</p>
      <p><strong>Peso:</strong> ${payload.pesoActual} Kg</p>
      <p><strong>Estatura:</strong> ${payload.estatura} Mt</p>
      <p><strong>Team/Gym:</strong> ${payload.atletaLibre ? "Atleta Libre" : payload.club}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Timestamp:</strong> ${payload.timestamp}</p>
      <hr>
      <p><em>Fotos procesadas y almacenadas en Google Drive</em></p>
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
  Logger.log("Script cargado correctamente. Esperando requests POST...");
}
```

---

## 🌐 PASO 4: Desplegar el Script

### 4.1 Crear un nuevo despliegue

1. En el editor de Apps Script, haz clic en **Nuevo despliegue** (botón arriba a la derecha)
2. Selecciona **Tipo**: "Aplicación web"
3. **Ejecutar como**: Tu cuenta Google
4. **Quién tiene acceso**: "Cualquiera"
5. Haz clic en **Desplegar**

### 4.2 Obtener la URL de despliegue

Se abrirá una ventana mostrando:
```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercontent
```

**Copia esta URL completa**

---

## 🔗 PASO 5: Conectar con el Formulario Web

### 5.1 Actualizar la URL en el código React/Vite

En tu archivo `src/App.tsx`, reemplaza:

```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpSdsycSoZVBzIOHSzIQ0_FV34ckCvBo60sSaPmXjTS6wosrOLSiH_sDBJCX7Ee64/exec";
```

Con tu nueva URL:

```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/[TU_DEPLOYMENT_ID]/usercontent";
```

### 5.2 Estructura de envío esperada

El formulario envía un JSON así:

```json
{
  "nombreCompleto": "Juan Pérez",
  "cedula": "000-000000-0000X",
  "sexo": "masculino",
  "edad": "28",
  "fechaNacimiento": "1996-05-15",
  "telefono": "+505 8123-4567",
  "email": "juan@example.com",
  "departamento": "Matagalpa",
  "ciudad": "Matagalpa",
  "direccion": "Bo. El Laborío",
  "atletaLibre": false,
  "club": "Gym Power Matagalpa",
  "entrenador": "Carlos López",
  "telefonoEntrenador": "+505 8765-4321",
  "experienciaEntrenador": "5 años",
  "pesoActual": "75",
  "estatura": "1.75",
  "contactoEmergencia": "María Pérez",
  "telefonoEmergencia": "+505 8111-2222",
  "parentesco": "Madre",
  "fotoSelfie": {
    "base64": "data:image/jpeg;base64,...",
    "name": "selfie.jpg",
    "type": "image/jpeg"
  },
  "fotoCedulaFrente": {
    "base64": "data:image/jpeg;base64,...",
    "name": "cedula_frente.jpg",
    "type": "image/jpeg"
  },
  "fotoCedulaReverso": {
    "base64": "data:image/jpeg;base64,...",
    "name": "cedula_reverso.jpg",
    "type": "image/jpeg"
  },
  "timestamp": "15/12/2025 10:30:45",
  "evento": "Campeonato Departamental del Norte 2026"
}
```

---

## ✅ PASO 6: Configuración Final

### 6.1 Permisos de carpetas

**Asegúrate que:**
1. Las carpetas de Google Drive están compartidas con tu cuenta
2. Tienes permisos de escritura en las carpetas
3. El Google Apps Script tiene acceso a Google Drive

### 6.2 Permisos del Spreadsheet

1. Abre tu Google Sheet
2. Copia el **SHEET_ID** de la URL
3. Asegúrate de tener acceso de edición

### 6.3 Variables a reemplazar en el script

| Variable | Dónde encontrarla | Ejemplo |
|----------|------------------|---------|
| `SHEET_ID` | URL del Spreadsheet | `1A2B3C4D5E6F7G8H9I0J` |
| `DRIVE_FOLDERS.selfies` | URL carpeta Drive | `2X3Y4Z5A6B7C8D9E0F1G` |
| `DRIVE_FOLDERS.cedulaFrente` | URL carpeta Drive | `3Y4Z5A6B7C8D9E0F1G2H` |
| `DRIVE_FOLDERS.cedulaReverso` | URL carpeta Drive | `4Z5A6B7C8D9E0F1G2H3I` |
| `ADMIN_EMAIL` | Tu email Gmail | `tu_email@gmail.com` |

---

## 🧪 PASO 7: Pruebas

### 7.1 Prueba desde el formulario web

1. Accede a tu formulario
2. Completa todos los campos
3. Sube las fotos
4. Haz clic en "Enviar Inscripción"
5. Deberías ver el mensaje de éxito

### 7.2 Verificar en Google Sheets

1. Abre tu Google Sheet
2. Deberías ver una nueva fila con los datos
3. Las columnas de fotos tendrán URLs clicables

### 7.3 Verificar en Google Drive

1. Abre la carpeta `FENIFISC - Inscripciones 2026`
2. Verifica que las fotos se guardaron en las subcarpetas correspondientes
3. Las imágenes deben ser descargables y visualizables

---

## 🐛 Solución de Problemas

### Problema: "Error: Invalid Sheet ID"

**Solución:**
- Verifica que copiaste el SHEET_ID correctamente
- Asegúrate que el email de la cuenta tiene acceso al Sheet

### Problema: "Error: Invalid Folder ID"

**Solución:**
- Copia nuevamente el FOLDER_ID de Google Drive
- Verifica que la carpeta existe y es accesible

### Problema: Las fotos no se guardan

**Solución:**
- Verifica que el Base64 se envía correctamente
- Revisa los logs del Apps Script
- Asegúrate que las carpetas tienen permisos de escritura

### Problema: CORS Error en el navegador

**Solución:**
- Esto es normal con `no-cors` mode
- El servidor responderá con tipo "opaque"
- El script aún procesará los datos correctamente

---

## 📊 Estructura de Google Drive esperada

```
FENIFISC - Inscripciones 2026/
├── Selfies/
│   ├── 000-000000-0000X_selfie.jpg
│   └── 000-111111-1111Y_selfie.jpg
├── Cedulas - Frente/
│   ├── 000-000000-0000X_cedula_frente.jpg
│   └── 000-111111-1111Y_cedula_frente.jpg
└── Cedulas - Reverso/
    ├── 000-000000-0000X_cedula_reverso.jpg
    └── 000-111111-1111Y_cedula_reverso.jpg
```

---

## 📈 Monitoreo y Reportes

### Ver logs del Apps Script

1. En el editor de Apps Script
2. Click en **Ejecuciones** (ícono de reloj)
3. Verás todas las solicitudes procesadas
4. Puedes ver errores y detalles

### Crear reportes automáticos

Puedes agregar al script:

```javascript
function crearReporte() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName("Inscripciones");
  const data = sheet.getDataRange().getValues();
  
  const reporte = {
    totalInscripciones: data.length - 1,
    fecha: new Date().toLocaleString("es-NI", { timeZone: "America/Managua" })
  };
  
  console.log(JSON.stringify(reporte));
}
```

---

## 🔐 Seguridad

### Recomendaciones:

1. **Cambiar permisos de despliegue**: Una vez en producción, cambia "Quién tiene acceso" a "Solo yo"
2. **Validar datos**: Agrega validaciones en el lado del servidor
3. **Encriptación**: Considera usar HTTPS y encriptación de Base64
4. **Logs**: Revisa regularmente los logs del Apps Script
5. **Backups**: Haz copias periódicas del Google Sheet

---

## 📞 Contacto de Soporte

- **FENIFISC**: fenific@gmail.com
- **Soporte técnico**: abdalah92@hotmail.com
- **Teléfono**: 2705252, 088-35971

---

## ✨ Conclusión

¡Tu sistema de inscripción está listo! 

Ahora tienes:
- ✅ Formulario web completamente funcional
- ✅ Almacenamiento automático en Google Sheets
- ✅ Backup de fotos en Google Drive
- ✅ Notificaciones por email
- ✅ Sistema escalable para múltiples inscripciones

**¡Que comience el Campeonato Departamental del Norte 2026!** 🏆🎉


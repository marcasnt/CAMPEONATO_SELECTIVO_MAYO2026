# ⚡ Inicio Rápido: Google Apps Script (5 minutos)

## 🎯 Lo que necesitas

1. Una cuenta Google (Gmail)
2. El navegador web

---

## ✅ Paso 1: Crear Google Sheet (1 minuto)

```
1. Abre: sheets.google.com
2. Click en "+ Nuevo Spreadsheet"
3. Nombra: "Inscripciones Campeonato 2026"
4. COPIA el ID de la URL:
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

**Crea una fila de encabezados en A1:**
```
Timestamp | Nombre | Cédula | Sexo | Email | Teléfono | Peso | Estatura | Selfie URL | Cédula Frente | Cédula Reverso
```

---

## ✅ Paso 2: Crear carpetas en Drive (1 minuto)

```
1. Abre: drive.google.com
2. Click derecho → Nueva carpeta
3. Crea carpeta: "FENIFISC-Inscripciones-2026"
4. COPIA el FOLDER_ID de la URL
5. Dentro, crea 3 subcarpetas:
   - Selfies
   - Cedulas-Frente
   - Cedulas-Reverso
6. COPIA cada FOLDER_ID
```

---

## ✅ Paso 3: Crear Apps Script (2 minutos)

### Opción A: Desde Google Sheet
```
1. Tu Sheet → Herramientas → Editor de secuencias de comandos
2. Borra todo el código
3. Pega el código de abajo
4. REEMPLAZA estas líneas con tus IDs:
   - const SHEET_ID = "TU_SHEET_ID"
   - const FOLDER_SELFIES = "TU_FOLDER_ID"
   - etc...
5. Presiona Ctrl+S para guardar
```

### Opción B: Desde script.google.com
```
1. Abre: script.google.com
2. Nuevo proyecto
3. Pega el código
4. Reemplaza los IDs
5. Presiona Ctrl+S
```

---

## 📋 Código (Copia y pega):

```javascript
const SHEET_ID = "TU_SHEET_ID_AQUI";
const SHEET_NAME = "Sheet1";

const FOLDER_SELFIES = "TU_FOLDER_ID";
const FOLDER_CEDULA_FRENTE = "TU_FOLDER_ID";
const FOLDER_CEDULA_REVERSO = "TU_FOLDER_ID";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Guardar fotos
    const selfieUrl = guardarFoto(data.fotoSelfie.base64, data.cedula + "_selfie.jpg", FOLDER_SELFIES);
    const cedulaFrenteUrl = guardarFoto(data.fotoCedulaFrente.base64, data.cedula + "_cedula_frente.jpg", FOLDER_CEDULA_FRENTE);
    const cedulaReversoUrl = guardarFoto(data.fotoCedulaReverso.base64, data.cedula + "_cedula_reverso.jpg", FOLDER_CEDULA_REVERSO);
    
    // Guardar en Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date().toLocaleString(),
      data.nombreCompleto,
      data.cedula,
      data.sexo,
      data.email,
      data.telefono,
      data.pesoActual,
      data.estatura,
      selfieUrl,
      cedulaFrenteUrl,
      cedulaReversoUrl
    ]);
    
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch(error) {
    Logger.log(error);
    return ContentService.createTextOutput("ERROR").setMimeType(ContentService.MimeType.TEXT);
  }
}

function guardarFoto(base64, nombre, folderId) {
  try {
    const binaryString = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(binaryString, "image/jpeg", nombre);
    const file = DriveApp.getFolderById(folderId).createFile(blob);
    return file.getUrl();
  } catch(e) {
    Logger.log("Error: " + e);
    return "ERROR";
  }
}
```

---

## 🚀 Paso 4: Desplegar (1 minuto)

```
1. Apps Script → Nuevo despliegue (arriba)
2. Tipo: "Aplicación web"
3. Ejecutar como: Tu cuenta
4. Quién tiene acceso: "Cualquiera"
5. Click DESPLEGAR
6. COPIA la URL que aparece
```

Verás algo como:
```
https://script.google.com/macros/s/AKfycb...../usercontent
```

---

## 🔗 Paso 5: Conectar el Formulario

En tu archivo `src/App.tsx`, línea ~23:

```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/[PEGA_TU_URL_AQUI]/usercontent";
```

---

## ✨ ¡Listo!

Prueba el formulario:
1. Completa todos los campos
2. Sube las fotos
3. Click "Enviar"
4. Verifica en Google Sheet (los datos aparecen)
5. Verifica en Drive (las fotos aparecen)

---

## 🆘 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| "Invalid Sheet ID" | Copia bien el SHEET_ID de la URL |
| Las fotos no aparecen | Verifica que copiaste los FOLDER_ID correctamente |
| Error de CORS | Esto es normal, los datos se guardan igual |
| Script no responde | Revisa los logs en Apps Script → Ejecuciones |

---

## 📞 Más info

- Guía completa: Ver `GOOGLE_APPS_SCRIPT_SETUP.md`
- Contacto: fenific@gmail.com

¡Que funcione! 🎉


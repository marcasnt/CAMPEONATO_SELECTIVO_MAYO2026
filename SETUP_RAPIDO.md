# 🚀 Guía Rápida: Configuración Google Apps Script

## Pasos para configurar el sistema:

### 1. Crear Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea nuevo spreadsheet: "Inscripciones FENIFISC 2026"
3. Copia el ID de la URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

### 2. Crear Carpetas en Google Drive
1. Ve a [Google Drive](https://drive.google.com)
2. Crea carpeta principal: "FENIFISC - Inscripciones 2026"
3. Dentro crea 3 subcarpetas:
   - "Selfies"
   - "Cedulas - Frente" 
   - "Cedulas - Reverso"
4. Copia el ID de cada carpeta desde la URL

### 3. Configurar Google Apps Script
1. Ve a [script.google.com](https://script.google.com)
2. Crea nuevo proyecto
3. Copia el código del archivo `google-apps-script.js`
4. Reemplaza las variables:
   - `SHEET_ID`: ID del Google Sheet
   - `DRIVE_FOLDERS.selfies`: ID carpeta Selfies
   - `DRIVE_FOLDERS.cedulaFrente`: ID carpeta Cedulas - Frente
   - `DRIVE_FOLDERS.cedulaReverso`: ID carpeta Cedulas - Reverso
   - `ADMIN_EMAIL`: Tu email para notificaciones

### 4. Desplegar el Script
1. En el editor, haz clic en "Nuevo despliegue"
2. Tipo: "Aplicación web"
3. Ejecutar como: Tu cuenta
4. Quién tiene acceso: "Cualquiera"
5. Haz clic en "Desplegar"
6. Copia la URL generada

### 5. Actualizar el Proyecto React
1. Abre `src/App.tsx`
2. Reemplaza la constante `GOOGLE_SCRIPT_URL` con tu nueva URL
3. Construye el proyecto: `npm run build`

## Variables Configuradas

```javascript
const SHEET_ID = "1kYhZxMIgJcfYtd4uHw2ctuH3aDepknUpy1Oce80WCJo";  // Google Sheet "Inscripciones Campeonato Regional Matagalpa 2026"
const SHEET_NAME = "Hoja 1";  // Hoja principal del spreadsheet
const DRIVE_FOLDERS = {
  selfies: "1iVQFPQTgbGsIXF6SZDSciBSdLWu9Ti6Z",        // Carpeta SELFIES
  cedulaFrente: "1PJ2ZdOFxABR5tUbhp3a9aBplFb_hCPJt",    // Carpeta CEDULA_FRENTE
  cedulaReverso: "1Vcnch4JcRgA9tZ3lP3izEZJE7_0ifo3o"    // Carpeta CEDULA_REVERSO
};
const ADMIN_EMAIL = "marcasnt@gmail.com"; // Email para notificaciones configurado
```

## Estructura de Datos

El formulario envía:
```json
{
  "nombreCompleto": "Juan Pérez",
  "cedula": "000-000000-0000X",
  "fotoSelfie": { "base64": "..." },
  "fotoCedulaFrente": { "base64": "..." },
  "fotoCedulaReverso": { "base64": "..." }
}
```

El script guarda en Google Sheets con 24 columnas incluyendo URLs de las fotos.

## Pruebas

1. Inicia el proyecto: `npm run dev`
2. Completa el formulario de prueba
3. Verifica que los datos aparezcan en el Google Sheet
4. Revisa las fotos en las carpetas de Google Drive

## Soporte

- FENIFISC: fenific@gmail.com
- Soporte técnico: abdalah92@hotmail.com

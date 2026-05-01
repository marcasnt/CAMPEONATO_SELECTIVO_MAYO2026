# 📸 Guía Visual: Google Apps Script (Paso a Paso)

## 📱 PARTE 1: Preparar Google Drive

### Paso 1.1: Ir a Google Drive

```
URL: https://drive.google.com
```

**Pantalla que verás:**
- Panel izquierdo con "Mi unidad"
- Botón azul "+ Nuevo" en la esquina superior izquierda

### Paso 1.2: Crear carpeta principal

**Acciones:**
```
1. Click en "+ Nuevo"
2. Selecciona "Carpeta"
3. Escribe: "FENIFISC-Inscripciones-2026"
4. Click en "Crear"
```

**Pantalla esperada:**
- Nueva carpeta aparece en tu Drive
- Color amarillo con ícono de carpeta

### Paso 1.3: Obtener ID de la carpeta

**En la carpeta abierta:**
```
Mira la URL del navegador:
https://drive.google.com/drive/folders/[AQUI_ESTA_TU_FOLDER_ID]

Ejemplo:
https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J
                                      ^^^^^^^^^^^^^^^^^^^
                                      Copia esto (el FOLDER_ID)
```

**Guárdalo en un bloc de notas:**
```
FOLDER_ID_PRINCIPAL = 1A2B3C4D5E6F7G8H9I0J
```

### Paso 1.4: Crear subcarpetas

**Dentro de "FENIFISC-Inscripciones-2026":**

```
1. Click en "+ Nuevo" → "Carpeta"
2. Escribe: "Selfies"
3. Repite para crear:
   - "Cedulas-Frente"
   - "Cedulas-Reverso"
```

**Estructura final:**
```
FENIFISC-Inscripciones-2026/
├── Selfies/
├── Cedulas-Frente/
└── Cedulas-Reverso/
```

### Paso 1.5: Obtener IDs de subcarpetas

**Para cada subcarpeta:**
```
1. Abre la subcarpeta
2. Copia su FOLDER_ID de la URL
3. Guarda en el bloc de notas
```

**Ejemplo:**
```
FOLDER_SELFIES = 2X3Y4Z5A6B7C8D9E0F1G
FOLDER_CEDULA_FRENTE = 3Y4Z5A6B7C8D9E0F1G2H
FOLDER_CEDULA_REVERSO = 4Z5A6B7C8D9E0F1G2H3I
```

---

## 📊 PARTE 2: Crear Google Sheet

### Paso 2.1: Ir a Google Sheets

```
URL: https://sheets.google.com
```

**Pantalla que verás:**
- Galería de plantillas
- Botón azul "+ Nuevo Spreadsheet"

### Paso 2.2: Crear nuevo Spreadsheet

**Acciones:**
```
1. Click en "+ Nuevo Spreadsheet" (o "Lienzo en blanco")
2. Se abre una hoja nueva
3. En la esquina superior izquierda verás "Spreadsheet sin título"
```

### Paso 2.3: Renombrar Spreadsheet

**Acciones:**
```
1. Click en "Spreadsheet sin título"
2. Escribe: "Inscripciones Campeonato 2026"
3. Presiona Enter
```

### Paso 2.4: Obtener ID del Spreadsheet

**En la URL del navegador:**
```
https://docs.google.com/spreadsheets/d/[AQUI_ESTA_TU_SHEET_ID]/edit

Ejemplo:
https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit
                                      ^^^^^^^^^^^^^^^^^^^
                                      Copia esto (el SHEET_ID)
```

**Guarda en tu bloc de notas:**
```
SHEET_ID = 1A2B3C4D5E6F7G8H9I0J
```

### Paso 2.5: Crear los encabezados

**En la celda A1, escribe los títulos de las columnas:**

```
Columna | Encabezado
--------|------------------
A       | Timestamp
B       | Nombre Completo
C       | Cédula
D       | Sexo
E       | Edad
F       | Fecha Nacimiento
G       | Teléfono
H       | Email
I       | Departamento
J       | Ciudad
K       | Dirección
L       | Team/Gym
M       | Atleta Libre
N       | Entrenador
O       | Tel Entrenador
P       | Años Exp
Q       | Peso (Kg)
R       | Estatura (Mt)
S       | Contacto Emergencia
T       | Tel Emergencia
U       | Parentesco
V       | Foto Selfie URL
W       | Cedula Frente URL
X       | Cedula Reverso URL
```

**Pantalla esperada:**
- Fila 1 con todos los encabezados
- Filas 2 en adelante vacías (se llenarán con datos)

### Paso 2.6: Formatear (opcional)

**Para que se vea mejor:**
```
1. Selecciona la fila 1 (encabezados)
2. Click derecho → "Formato de celda"
3. Pestaña "Relleno" → Color gris o azul
4. Pestaña "Texto" → Bold, color blanco
5. Pestaña "Alineación" → Centrado
6. Click en "Aplicar"
```

---

## ⚙️ PARTE 3: Crear Google Apps Script

### Paso 3.1: Acceder al Editor de Scripts

**Opción A - Desde el Sheet (Recomendado):**
```
1. En tu Google Sheet abierto
2. Click en menú "Herramientas"
3. Selecciona "Editor de secuencias de comandos"
4. Se abre el Apps Script Editor
```

**Opción B - Directo desde Script:**
```
1. Abre: https://script.google.com
2. Click en "+ Nuevo proyecto"
3. Se abre el editor
```

### Paso 3.2: Ver la plantilla por defecto

**En el editor verás:**
```javascript
function myFunction() {
  
}
```

### Paso 3.3: Borrar el código existente

**Acciones:**
```
1. Selecciona TODO el código (Ctrl+A)
2. Presiona Delete o Backspace
3. El editor queda vacío
```

### Paso 3.4: Copiar el código principal

**Copia este código completo:**

```javascript
// ============================================================
// CONFIGURACIÓN - REEMPLAZA ESTOS IDs
// ============================================================

const SHEET_ID = "REEMPLAZA_CON_TU_SHEET_ID";
const SHEET_NAME = "Sheet1";

const FOLDER_SELFIES = "REEMPLAZA_CON_TU_FOLDER_ID";
const FOLDER_CEDULA_FRENTE = "REEMPLAZA_CON_TU_FOLDER_ID";
const FOLDER_CEDULA_REVERSO = "REEMPLAZA_CON_TU_FOLDER_ID";

const ADMIN_EMAIL = "tu_email@gmail.com"; // Opcional

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // Guardar fotos
    const selfieUrl = guardarFoto(
      payload.fotoSelfie.base64,
      payload.cedula + "_selfie.jpg",
      FOLDER_SELFIES
    );
    
    const cedulaFrenteUrl = guardarFoto(
      payload.fotoCedulaFrente.base64,
      payload.cedula + "_cedula_frente.jpg",
      FOLDER_CEDULA_FRENTE
    );
    
    const cedulaReversoUrl = guardarFoto(
      payload.fotoCedulaReverso.base64,
      payload.cedula + "_cedula_reverso.jpg",
      FOLDER_CEDULA_REVERSO
    );
    
    // Preparar datos para Google Sheets
    const fila = [
      new Date().toLocaleString("es-NI", { timeZone: "America/Managua" }),
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
      selfieUrl,
      cedulaFrenteUrl,
      cedulaReversoUrl
    ];
    
    // Guardar en Google Sheets
    agregarFila(fila);
    
    // Enviar notificación (opcional)
    // enviarEmail(payload);
    
    return ContentService.createTextOutput("OK");
    
  } catch (error) {
    Logger.log("Error: " + error);
    return ContentService.createTextOutput("ERROR");
  }
}

// ============================================================
// FUNCIÓN AUXILIAR: Guardar foto en Drive
// ============================================================

function guardarFoto(base64, nombreArchivo, folderId) {
  try {
    const binaryString = Utilities.base64Decode(base64);
    const blob = Utilities.newBlob(binaryString, "image/jpeg", nombreArchivo);
    const file = DriveApp.getFolderById(folderId).createFile(blob);
    Logger.log("Foto guardada: " + nombreArchivo);
    return file.getUrl();
  } catch (error) {
    Logger.log("Error guardando foto: " + error);
    return "Error";
  }
}

// ============================================================
// FUNCIÓN AUXILIAR: Agregar fila a Google Sheets
// ============================================================

function agregarFila(fila) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow(fila);
    Logger.log("Fila agregada exitosamente");
  } catch (error) {
    Logger.log("Error agregando fila: " + error);
    throw error;
  }
}

// ============================================================
// FUNCIÓN OPCIONAL: Enviar email de notificación
// ============================================================

function enviarEmail(payload) {
  try {
    const asunto = "✅ Nueva inscripción: " + payload.nombreCompleto;
    const mensaje = "Inscripción registrada para " + payload.evento;
    MailApp.sendEmail(ADMIN_EMAIL, asunto, mensaje);
    Logger.log("Email enviado a " + ADMIN_EMAIL);
  } catch (error) {
    Logger.log("Error enviando email: " + error);
  }
}
```

### Paso 3.5: Reemplazar los IDs

**En el código, busca y reemplaza:**

```javascript
// ANTES:
const SHEET_ID = "REEMPLAZA_CON_TU_SHEET_ID";
const FOLDER_SELFIES = "REEMPLAZA_CON_TU_FOLDER_ID";
// etc...

// DESPUÉS (ejemplo con tus valores):
const SHEET_ID = "1A2B3C4D5E6F7G8H9I0J";
const FOLDER_SELFIES = "2X3Y4Z5A6B7C8D9E0F1G";
const FOLDER_CEDULA_FRENTE = "3Y4Z5A6B7C8D9E0F1G2H";
const FOLDER_CEDULA_REVERSO = "4Z5A6B7C8D9E0F1G2H3I";
const ADMIN_EMAIL = "tu_email@gmail.com";
```

### Paso 3.6: Guardar el script

**Acciones:**
```
1. Presiona Ctrl+S (o Cmd+S en Mac)
2. Verás un mensaje "Proyecto guardado"
3. En la esquina superior izquierda verás el nombre del proyecto
```

---

## 🚀 PARTE 4: Desplegar el Script

### Paso 4.1: Hacer el despliegue

**En el editor de Apps Script:**
```
1. Busca el botón "Nuevo despliegue" (arriba a la derecha)
2. O click en "Implementar" → "Nuevo despliegue"
3. Se abre una ventana con un formulario
```

### Paso 4.2: Configurar despliegue

**En la ventana de despliegue:**

```
Campo 1: Tipo
├─ Haz click en el desplegable
├─ Selecciona "Aplicación web"
└─ ✓

Campo 2: Ejecutar como
├─ Selecciona tu cuenta Google
└─ ✓

Campo 3: Quién tiene acceso
├─ Click en el desplegable
├─ Selecciona "Cualquiera"
└─ ✓

Botón: "Desplegar"
├─ Click aquí
└─ Espera a que se complete
```

### Paso 4.3: Copiar la URL de despliegue

**Cuando se complete:**
```
Verás una ventana con:

✓ Despliegue completado
Versión de despliegue: 1

ID de despliegue: AKfycb....[LONG_ID]

Enlace de despliegue:
https://script.google.com/macros/s/[LONG_ID]/usercontent

⬅️ Botón para copiar
```

**Copia el enlace completo** (incluye `/usercontent` al final):
```
https://script.google.com/macros/s/AKfycb123456789ABC/usercontent
```

**Guárdalo en tu bloc de notas:**
```
GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/AKfycb.../usercontent
```

### Paso 4.4: Cerrar la ventana

```
Click en X o en el botón "Cerrar"
```

---

## 🔗 PARTE 5: Conectar con el Formulario

### Paso 5.1: Abrir tu proyecto React

```
Archivo: src/App.tsx
```

### Paso 5.2: Buscar la línea de la URL

**Busca (Ctrl+F) esta línea:**
```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/...exec";
```

**O busca cercana a la línea 23:**
```typescript
const GOOGLE_SCRIPT_URL = 
```

### Paso 5.3: Reemplazar la URL

**Cambia de:**
```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpSdsycSoZVBzIOHSzIQ0_FV34ckCvBo60sSaPmXjTS6wosrOLSiH_sDBJCX7Ee64/exec";
```

**A:**
```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/[TU_DEPLOYMENT_ID]/usercontent";
```

**Donde [TU_DEPLOYMENT_ID] es el ID largo de tu despliegue.**

**Ejemplo:**
```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbAbCdEfGhIjKlMnOpQrStUvWxYz1234567890/usercontent";
```

### Paso 5.4: Guardar el archivo

```
Ctrl+S o Cmd+S
```

---

## ✅ PARTE 6: Prueba Final

### Paso 6.1: Iniciar el servidor de desarrollo

```bash
npm run dev
```

### Paso 6.2: Llenar el formulario

```
1. Abre http://localhost:5173 (o la URL que te indique)
2. Completa TODOS los campos
3. Sube las 3 fotos (Selfie, Cédula Frente, Cédula Reverso)
4. Avanza por los 5 pasos
5. En el último paso, haz click en "Enviar Inscripción"
```

### Paso 6.3: Verifica en Google Sheets

```
1. Abre tu Google Sheet
2. Deberías ver una NUEVA FILA con todos los datos
3. Las últimas 3 columnas (V, W, X) deben tener URLs
```

### Paso 6.4: Verifica en Google Drive

```
1. Abre Google Drive
2. Ve a FENIFISC-Inscripciones-2026
3. Abre cada subcarpeta:
   - Selfies → debe tener la foto de perfil
   - Cedulas-Frente → debe tener la foto del frente
   - Cedulas-Reverso → debe tener la foto del reverso
4. Las fotos deben ser descargables
```

---

## 🎉 ¡Éxito!

Si llegaste aquí, tu sistema está **100% funcional**.

Ahora puedes:
- ✅ Aceptar inscripciones por web
- ✅ Guardar datos en Google Sheets
- ✅ Almacenar fotos en Google Drive
- ✅ Acceder a todo desde cualquier dispositivo

---

## 🆘 Troubleshooting Visual

### Problema: En Google Sheets aparece "Error"

**Pantalla que ves:**
- Columnas V, W, X muestran "Error" en lugar de URLs

**Causas comunes:**
1. El FOLDER_ID está mal copiado
2. Los permisos de la carpeta son insuficientes
3. El formato Base64 de la foto no es correcto

**Solución:**
1. Copia de nuevo el FOLDER_ID
2. Abre la carpeta → Click derecho → Compartir
3. Asegúrate que TU email tiene acceso de edición

### Problema: "Invalid Sheet ID"

**Pantalla que ves:**
- Error en el navegador
- Los datos no se guardan

**Causa:**
- El SHEET_ID está mal

**Solución:**
1. Abre tu Google Sheet
2. Copia la URL completa
3. Verifica el SHEET_ID entre `/d/` y `/edit`
4. Actualiza en el Apps Script

### Problema: CORS Error (Rojo en consola)

**Pantalla que ves:**
- Mensaje rojo en la consola del navegador
- Pero el formulario muestra "¡Envío exitoso!"

**Causa:**
- Normal con `no-cors` mode (no es un error real)

**Solución:**
- Ignóralo, los datos se guardan correctamente
- Verifica en Google Sheets y Google Drive

---

## 📞 Contacto

- Documentación completa: `GOOGLE_APPS_SCRIPT_SETUP.md`
- Guía rápida: `GOOGLE_APPS_SCRIPT_QUICK_START.md`
- Email: fenific@gmail.com

¡Éxito con tu inscripción! 🏆🎉


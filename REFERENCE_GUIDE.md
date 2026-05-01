# 📚 Guía de Referencia Completa - FENIFISC Inscripción 2026

## 📑 Índice

1. [IDs y URLs Necesarios](#ids-y-urls-necesarios)
2. [Estructura de Datos JSON](#estructura-de-datos-json)
3. [Códigos de Error](#códigos-de-error)
4. [Funciones Google Apps Script](#funciones-google-apps-script)
5. [Variables de Entorno](#variables-de-entorno)
6. [Rutas de Archivos](#rutas-de-archivos)
7. [Categorías de Competencia](#categorías-de-competencia)
8. [Cambios Futuros](#cambios-futuros)

---

## IDs y URLs Necesarios

### Tabla de IDs a configurar

| Concepto | Tipo | Ejemplo | Dónde encontrarlo |
|----------|------|---------|------------------|
| **SHEET_ID** | Google Sheet | `1A2B3C4D5E6F7G8H9I0J` | URL del Sheet entre `/d/` y `/edit` |
| **FOLDER_ID** (Selfies) | Google Drive | `2X3Y4Z5A6B7C8D9E0F1G` | URL de la carpeta en Drive |
| **FOLDER_ID** (Cedula Frente) | Google Drive | `3Y4Z5A6B7C8D9E0F1G2H` | URL de la carpeta en Drive |
| **FOLDER_ID** (Cedula Reverso) | Google Drive | `4Z5A6B7C8D9E0F1G2H3I` | URL de la carpeta en Drive |
| **DEPLOYMENT_ID** | Apps Script | `AKfycbAbCdEfGhIjKlMnOpQr...` | URL de despliegue del script |
| **GOOGLE_SCRIPT_URL** | URL completa | `https://script.google.com/...` | Despliegue → URL del despliegue |

### Obtener IDs - Cheat Sheet

```
🔹 SHEET_ID:
   URL: https://docs.google.com/spreadsheets/d/[AQUI]/edit
        https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit
        ID = 1A2B3C4D5E6F7G8H9I0J

🔹 FOLDER_ID:
   URL: https://drive.google.com/drive/folders/[AQUI]
        https://drive.google.com/drive/folders/2X3Y4Z5A6B7C8D9E0F1G
        ID = 2X3Y4Z5A6B7C8D9E0F1G

🔹 DEPLOYMENT_ID:
   URL: https://script.google.com/macros/s/[AQUI]/usercontent
        https://script.google.com/macros/s/AKfycbAb.../usercontent
        ID = AKfycbAb...
```

---

## Estructura de Datos JSON

### Formato de envío desde formulario

```json
{
  "nombreCompleto": "Juan Carlos Pérez Martínez",
  "cedula": "001-120695-0001A",
  "sexo": "masculino",
  "edad": "28",
  "fechaNacimiento": "1996-05-15",
  "telefono": "+505 8123-4567",
  "email": "juan.perez@example.com",
  "departamento": "Matagalpa",
  "ciudad": "Matagalpa",
  "direccion": "Barrio El Laborío, Casa #45",
  "atletaLibre": false,
  "club": "Gym Power Matagalpa",
  "entrenador": "Carlos López García",
  "telefonoEntrenador": "+505 8765-4321",
  "experienciaEntrenador": "5",
  "pesoActual": "75.5",
  "estatura": "1.75",
  "contactoEmergencia": "María Pérez López",
  "telefonoEmergencia": "+505 8111-2222",
  "parentesco": "Madre",
  "fotoSelfie": {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "name": "selfie.jpg",
    "type": "image/jpeg"
  },
  "fotoCedulaFrente": {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "name": "cedula_frente.jpg",
    "type": "image/jpeg"
  },
  "fotoCedulaReverso": {
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "name": "cedula_reverso.jpg",
    "type": "image/jpeg"
  },
  "timestamp": "15/12/2025 10:30:45",
  "evento": "Campeonato Departamental del Norte 2026",
  "lugar": "Centro Cultural Héroes y Mártires, Matagalpa"
}
```

### Respuesta esperada del servidor

```json
{
  "status": "success",
  "message": "Inscripción registrada correctamente",
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

---

## Códigos de Error

### Errores de Validación (Frontend)

| Código | Mensaje | Solución |
|--------|---------|----------|
| `ERR_001` | Nombre completo requerido | Completa el campo de nombre |
| `ERR_002` | Cédula requerida | Ingresa tu número de cédula |
| `ERR_003` | Formato de cédula inválido | Formato: XXX-XXXXXX-XXXXC |
| `ERR_004` | Email inválido | Verifica el formato del email |
| `ERR_005` | Teléfono requerido | Ingresa tu número de teléfono |
| `ERR_006` | Foto no soportada | Solo JPG, PNG, WEBP (máx 5MB) |
| `ERR_007` | Fotos incompletas | Sube todas las 3 fotos |
| `ERR_008` | Debe aceptar reglamento | Lee y acepta los términos |

### Errores de Google Apps Script

| Código | Mensaje | Solución |
|--------|---------|----------|
| `ERR_GAS_001` | Invalid Sheet ID | Verifica el SHEET_ID en el código |
| `ERR_GAS_002` | Invalid Folder ID | Verifica los FOLDER_ID en el código |
| `ERR_GAS_003` | No puedo escribir en Sheet | Verifica permisos de edición |
| `ERR_GAS_004` | No puedo escribir en Drive | Verifica permisos de la carpeta |
| `ERR_GAS_005` | Base64 inválido | La imagen no se codificó bien |

### Errores de Red

| Código | Mensaje | Solución |
|--------|---------|----------|
| `ERR_NET_001` | CORS Error | Normal, intenta de nuevo |
| `ERR_NET_002` | Conexión perdida | Verifica tu internet |
| `ERR_NET_003` | Timeout | Espera un poco e intenta de nuevo |

---

## Funciones Google Apps Script

### Función Principal: `doPost(e)`

```javascript
/**
 * Función disparada cuando el formulario envía datos
 * @param {Object} e - Evento POST con los datos JSON
 * @returns {ContentService} Respuesta al navegador
 */
function doPost(e) {
  // Procesa el JSON recibido
  // Guarda fotos en Drive
  // Registra datos en Sheet
  // Retorna respuesta
}
```

**Parámetros de entrada:**
```javascript
e.postData.contents  // JSON string con los datos del formulario
```

**Procesos internos:**
1. Parse del JSON
2. Procesar y guardar 3 fotos en Drive
3. Obtener URLs de las fotos
4. Preparar fila de datos
5. Agregar fila a Google Sheets
6. Enviar notificación por email (opcional)
7. Retornar respuesta

---

### Función: `procesarFoto(base64String, nombreArchivo, folderId)`

```javascript
/**
 * Decodifica Base64, crea archivo en Drive y retorna URL
 * @param {String} base64String - Contenido en Base64
 * @param {String} nombreArchivo - Nombre del archivo (con extensión)
 * @param {String} folderId - ID de la carpeta destino
 * @returns {String} URL del archivo creado
 */
function procesarFoto(base64String, nombreArchivo, folderId) {
  const binaryString = Utilities.base64Decode(base64String);
  const blob = Utilities.newBlob(binaryString, "image/jpeg", nombreArchivo);
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  return file.getUrl();
}
```

---

### Función: `agregarFila(row)`

```javascript
/**
 * Agrega una fila a Google Sheets
 * @param {Array} row - Array con los datos (23 columnas)
 */
function agregarFila(row) {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  const range = sheet.getRange(lastRow + 1, 1, 1, row.length);
  range.setValues([row]);
}
```

---

### Función: `enviarNotificacion(payload)`

```javascript
/**
 * Envía un email de notificación al administrador
 * @param {Object} payload - Datos de la inscripción
 */
function enviarNotificacion(payload) {
  const asunto = `✅ Nueva Inscripción: ${payload.nombreCompleto}`;
  const cuerpo = `
    <h2>Inscripción Registrada</h2>
    <p><strong>Atleta:</strong> ${payload.nombreCompleto}</p>
    <p><strong>Cédula:</strong> ${payload.cedula}</p>
    <p><strong>Peso:</strong> ${payload.pesoActual} Kg</p>
    ...
  `;
  MailApp.sendEmail(ADMIN_EMAIL, asunto, "", { htmlBody: cuerpo });
}
```

---

## Variables de Entorno

### En Google Apps Script

```javascript
// REQUERIDAS
const SHEET_ID = "1A2B3C4D5E6F7G8H9I0J";
const SHEET_NAME = "Inscripciones";
const FOLDER_SELFIES = "2X3Y4Z5A6B7C8D9E0F1G";
const FOLDER_CEDULA_FRENTE = "3Y4Z5A6B7C8D9E0F1G2H";
const FOLDER_CEDULA_REVERSO = "4Z5A6B7C8D9E0F1G2H3I";

// OPCIONAL
const ADMIN_EMAIL = "tu_email@gmail.com";
const EVENT_NAME = "Campeonato Departamental del Norte 2026";
```

### En el formulario React (`src/App.tsx`)

```typescript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/[DEPLOYMENT_ID]/usercontent";

const DEPARTAMENTOS_NI = [
  "Matagalpa", "Jinotega", "Estelí", "Madriz", "Nueva Segovia",
  "Managua", "León", "Chinandega", "Masaya", "Granada", "Carazo",
  "Rivas", "Boaco", "Chontales", "Río San Juan", "RACCN", "RACCS"
];

const CATEGORIAS_MASCULINAS = {
  "Fisicoculturismo": ["Hasta 65 Kg", "Hasta 70 Kg", ...],
  "Men's Physique": ["Hasta 1.74 Mt", "Más de 1.74 Mt"],
  ...
};

const CATEGORIAS_FEMENINAS = {
  "Women's Physique": ["Única Categoría"],
  "Bikini": ["Categoría Alta", "Categoría Baja"],
  ...
};
```

---

## Rutas de Archivos

### Estructura del Proyecto React

```
proyecto-fenifisc/
├── src/
│   ├── App.tsx                 ← Componente principal del formulario
│   ├── main.tsx                ← Punto de entrada
│   └── index.css               ← Estilos globales
├── index.html                  ← HTML principal
├── vite.config.ts              ← Configuración de Vite
├── tailwind.config.ts          ← Configuración de Tailwind
├── tsconfig.json               ← Configuración de TypeScript
├── package.json                ← Dependencias
├── GOOGLE_APPS_SCRIPT_SETUP.md ← Guía completa (ESTE ARCHIVO)
├── GOOGLE_APPS_SCRIPT_QUICK_START.md ← Guía rápida
└── dist/                       ← Compilado (se genera con npm run build)
    └── index.html              ← HTML final para desplegar
```

### Google Apps Script

```
script.google.com/
└── [PROYECTO]
    ├── Code.gs                 ← Código principal (aquí va el script)
    ├── appsscript.json         ← Manifest (auto-generado)
    └── Despliegues             ← Versiones desplegadas
        ├── 1 (actual)
        ├── 2
        └── 3
```

### Google Drive

```
Google Drive/
└── FENIFISC-Inscripciones-2026/
    ├── Selfies/
    │   ├── 001-120695-0001A_selfie.jpg
    │   ├── 001-120695-0002B_selfie.jpg
    │   └── ...
    ├── Cedulas-Frente/
    │   ├── 001-120695-0001A_cedula_frente.jpg
    │   └── ...
    └── Cedulas-Reverso/
        ├── 001-120695-0001A_cedula_reverso.jpg
        └── ...
```

### Google Sheets

```
Spreadsheet: Inscripciones Campeonato 2026
├── Hoja: Inscripciones
│   ├── Fila 1: Encabezados (23 columnas)
│   ├── Fila 2: Primera inscripción
│   ├── Fila 3: Segunda inscripción
│   └── ...
├── Hoja: Reportes (opcional)
└── Hoja: Análisis (opcional)
```

---

## Categorías de Competencia

### Categorías Masculinas

```javascript
{
  "Fisicoculturismo": [
    "Hasta 65 Kg",
    "Hasta 70 Kg",
    "Hasta 75 Kg",
    "Hasta 80 Kg",
    "Hasta 85 Kg",
    "Más de 85 Kg"
  ],
  "Men's Physique": [
    "Hasta 1.74 Mt",
    "Más de 1.74 Mt"
  ],
  "Físico Clásico": [
    "Hasta 1.71 Mt",
    "Más de 1.71 Mt"
  ],
  "Classic Physique": [
    "Hasta 1.71 Mt",
    "Más de 1.71 Mt"
  ]
}
```

**Nota especial - Classic Physique:**
> Los atletas deben realizar el "Vacío Abdominal" en la mesa de inscripción. Si no pueden, pierden el derecho de participar.

### Categorías Femeninas

```javascript
{
  "Women's Physique": [
    "Única Categoría"
  ],
  "Bikini": [
    "Categoría Alta",
    "Categoría Baja"
  ],
  "Body Fitness": [
    "Categoría Baja",
    "Categoría Alta"
  ],
  "Wellness": [
    "Categoría Libre"
  ]
}
```

---

## Detalles del Evento

### Información Básica

| Aspecto | Detalles |
|--------|----------|
| **Evento** | Campeonato Departamental del Norte 2026 |
| **Organización** | FENIFISC, IND, Asociación Departamental Matagalpa |
| **Fecha** | Sábado 12 de Abril, 2026 |
| **Lugar** | Centro Cultural Héroes y Mártires, Matagalpa |
| **Horario de Pesaje** | 12:00 PM - 3:00 PM |
| **Horario del Evento** | 5:00 PM |

### Reglas Importantes

1. **Pesaje Obligatorio:**
   - Hora: 12:00 PM - 3:00 PM
   - Lugar: Centro Cultural Héroes y Mártires
   - Si llegas después, pierdes el derecho de participar

2. **Documentos Requeridos:**
   - Cédula de identidad original
   - Fotos actualizadas (serán verificadas)

3. **Categoría Selection:**
   - Se elige EL DÍA del evento en la mesa de inscripción
   - Basado en peso, estatura y en el vacío abdominal (Classic Physique)

4. **Reglamento IFBB:**
   - Todas las competencias siguen reglas IFBB
   - Los jueces son certificados

---

## Cambios Futuros

### Mejoras Planificadas

- [ ] Integración con sistema de pagos online
- [ ] Confirmación automática por SMS
- [ ] Portal de seguimiento para atletas
- [ ] Generación automática de credenciales
- [ ] Integración con Facebook/Instagram para promoción
- [ ] Dashboard de administración en tiempo real

### Mantenimiento Recomendado

1. **Semanal:**
   - Revisar Google Sheets para nuevas inscripciones
   - Verificar que las fotos se guardaron correctamente

2. **Mensual:**
   - Hacer backup del Google Sheet
   - Limpiar fotos duplicadas o incorrectas
   - Actualizar reporte de inscritos

3. **Antes del Evento:**
   - Exportar lista final de inscritos
   - Crear etiquetas/credenciales
   - Notificar a jueces y staff
   - Hacer test final del sistema de pesaje

---

## Preguntas Frecuentes

**P: ¿Puedo cambiar los IDs después?**
R: Sí, pero debes actualizar el código del Apps Script y hacer un nuevo despliegue.

**P: ¿Las fotos se pueden ver después?**
R: Sí, tienes URLs clicables en Google Sheets que te llevan a Google Drive.

**P: ¿Puedo recibir notificaciones por email?**
R: Sí, descomenta la línea `enviarEmail(payload);` en el código.

**P: ¿Qué pasa si alguien intenta enviar dos veces?**
R: Se crea un registro duplicado. Puedes limpiar manualmente en Sheets.

**P: ¿Puedo editar los datos después?**
R: Sí, directamente en Google Sheets (busca la fila y edita).

---

## Contacto y Soporte

- **FENIFISC:** fenific@gmail.com
- **Teléfono:** 2705252, 088-35971
- **Fax:** 2705251
- **Soporte Técnico:** abdalah92@hotmail.com

---

**Última actualización:** 15 de Diciembre, 2025
**Versión:** 1.0
**Estado:** Listo para Producción


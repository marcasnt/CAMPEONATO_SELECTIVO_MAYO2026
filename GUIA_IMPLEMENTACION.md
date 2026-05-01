# Guía de Implementación - Google Apps Script

## Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua

---

## Información del Evento

| Campo | Valor |
|-------|-------|
| **Evento** | Campeonato Nacional Selectivo de Fisicoculturismo 2026 |
| **Lugar** | Managua, Nicaragua |
| **Fecha** | Sábado 23 de Mayo de 2026 |
| **Lugar Evento** | Polideportivo España, Managua |
| **Pesaje** | 12:00 PM - 3:00 PM |
| **Hora Evento** | 5:00 PM |
| **Organiza** | FENIFISC, IND, Asociación Departamental de Managua |

---

## Paso 1: Crear Carpeta Principal en Google Drive

1. Ve a [drive.google.com](https://drive.google.com)
2. Crea una carpeta nueva llamada: `FENIFISC-Managua2026-Archivos`
3. **No necesitas crear subcarpetas** - el script creará automáticamente una carpeta por cada atleta

**IMPORTANTE**: Copia el ID de la carpeta de la URL:

```
https://drive.google.com/drive/folders/ABCD1234567890XYZ
                                      ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                                      ID AQUÍ (sin guiones)
```

Ejemplo: Si la URL es `https://drive.google.com/drive/folders/1ABC123def456GHI789`, el ID es `1ABC123def456GHI789`

---

## Paso 2: Crear Google Sheets

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea un nuevo spreadsheet
3. Nómbralo: `Inscripciones FENIFISC 2026`
4. Renombra la primera hoja como `Inscripciones`
5. En la primera fila, agrega estos encabezados (exactamente en este orden):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Evento | Nombre | Cédula | Sexo | Edad | Fecha Nac | Teléfono | Email | Departamento | Ciudad | Dirección | Club | Atleta Libre | Entrenador | Peso (Kg) | Estatura (Mt) | Emergencia | Telf Emergencia | **Carpeta Atleta** | Selfie URL | Cédula Frente URL | Cédula Reverso URL |

6. Copia el **SHEET_ID** de la URL:
```
https://docs.google.com/spreadsheets/d/1ABC123.../edit#gid=0
                              ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                              SHEET_ID AQUÍ
```

---

## Paso 3: Configurar Google Apps Script

### Opción A: Editor de Apps Script (Recomendado)

1. Abre tu Google Sheet
2. Ve a **Extensiones** → **Apps Script**
3. Elimina cualquier código que haya
4. Abre el archivo `google-apps-script.js` de este proyecto
5. Copia todo el código
6. Pega en el editor de Apps Script

### Configurar las Variables

En el código, busca la sección `CONFIGURACIÓN` y reemplaza los valores:

```javascript
// REEMPLAZA ESTOS VALORES:
const SHEET_ID = "TU_SHEET_ID_AQUI";  // Pega tu SHEET_ID

// ID de la carpeta PRINCIPAL (donde se crearán las carpetas por atleta)
const DRIVE_MAIN_FOLDER = "TU_FOLDER_ID_PRINCIPAL";

const ADMIN_EMAIL = "fenific@gmail.com";  // Tu email para notificaciones
```

### Guardar y Desplegar

1. Presiona **Ctrl+S** (Guardar)
2. Presiona el botón **+** (Agregar función) y selecciona `testScript`
3. Presiona **Run** (Ejecutar)
4. Autoriza los permisos (selecciona tu cuenta, luego "Avanzado" → "Ir a (nombre) (no seguro)" → "允许")
5. En el menú desplegable, selecciona **Desplegar** → **Nueva implementación**
6. Configura:
   - **Tipo**: Aplicación web
   - **Descripción**: FENIFISC 2026 Managua
   - **Ejecutar como**: Tú mismo
   - **Quién tiene acceso**: Cualquier persona
7. Presiona **Desplegar**
8. **COPIA LA URL** del despliegue (algo como `https://script.google.com/macros/s/AKfycb.../exec`)

---

## Paso 4: Conectar con el Formulario

1. Abre `src/App.tsx` en tu proyecto
2. Busca la línea (al inicio del archivo):
   ```typescript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwu_u9NUOsgkLz75Bonk8HcQpSQDL4O3bbNmZervxys1_tFe5Lb9yDGwIDpBOToiEV3/exec";
   ```
3. Reemplaza con tu URL del despliegue:
   ```typescript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/TU_NUEVA_URL_AQUI/exec";
   ```

---

## Paso 5: Probar

1. En terminal, ejecuta:
   ```bash
   npm install
   npm run dev
   ```
2. Abre [http://localhost:5173](http://localhost:5173)
3. Completa el formulario de inscripción
4. Verifica:
   - ✅ Los datos aparecen en Google Sheets
   - ✅ Las fotos aparecen en Google Drive
   - ✅ Si configuraste email, recibes notificación

---

## Solución de Problemas

### Error: "No se ha definido SHEET_ID"
- Asegúrate de haber reemplazado `"TU_SHEET_ID_AQUI"` con tu ID real

### Error: "Carpeta no encontrada"
- Verifica que los IDs de Drive sean correctos
- Asegúrate de que las carpetas existan y estén compartidas (o visibles)

### Las fotos no se guardan
- Verifica que las carpetas existan en Drive
- Revisa el log de Apps Script (Ver → Registros)

### Los datos no aparecen en Sheets
- Verifica que los encabezados coincidan exactamente
- Revisa el log de Apps Script para ver errores

### Error CORS
- Este es normal con `mode: "no-cors"` - el formulario funciona aunque no muestre respuesta

---

## Estructura de Carpetas en Google Drive

El sistema crea automáticamente una carpeta por cada atleta inscribirse:

```
FENIFISC-Managua2026-Archivos/
├── JUAN_PEREZ_001-123456-0001A/
│   ├── selfie.jpg
│   ├── cedula_frente.jpg
│   └── cedula_reverso.jpg
├── MARIA_GARCIA_001-987654-0002B/
│   ├── selfie.jpg
│   ├── cedula_frente.jpg
│   └── cedula_reverso.jpg
└── ...
```

**Nombre de carpeta**: `NOMBREAPELLIDO_CEDULA` (sin acentos, espacios换成 guiones bajos)

---

## Estructura de Datos que Envía el Formulario

```javascript
{
  evento: "Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua",
  nombreCompleto: "Juan Pérez",
  cedula: "001-123456-0001A",
  fechaNacimiento: "1995-03-15",
  sexo: "masculino",
  telefono: "8888-8888",
  email: "juan@email.com",
  departamento: "Matagalpa",
  ciudad: "Matagalpa",
  atletaLibre: false,
  club: "Iron Gym",
  entrenador: "Coach Carlos",
  pesoActual: "75",
  estatura: "1.70",
  contactoEmergencia: "María Pérez",
  telefonoEmergencia: "8888-0000",
  aceptaReglamento: true,
  aceptaHorario: true,
  autorizaDatos: true,
  fotoSelfie: { base64: "...", name: "selfie.jpg", type: "image/jpeg" },
  fotoCedulaFrente: { base64: "...", name: "cedula_frente.jpg", type: "image/jpeg" },
  fotoCedulaReverso: { base64: "...", name: "cedula_reverso.jpg", type: "image/jpeg" },
  timestamp: "23/05/2026 10:30:00"
}
```

---

## Personalización Adicional

Si necesitas modificar el evento en el código:

**En `src/App.tsx`** (línea ~239):
```typescript
evento: "Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua",
```

**En `google-apps-script.js`** (al inicio):
```javascript
const EVENTO = "Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua";
```

---

## Contacto de Soporte

- **Email**: fenific@gmail.com
- **Teléfono**: 2705252, 088-35971
- **Web**: https://fenifisc.com

---

**Fecha de creación**: Mayo 2026
**Versión**: 1.0
**Evento**: Campeonato Nacional Selectivo de Fisicoculturismo 2026 - Managua
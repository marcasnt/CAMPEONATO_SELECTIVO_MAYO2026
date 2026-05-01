# 🚀 Guía de Despliegue - FENIFISC Inscripción 2026

Cómo poner tu sitio web en vivo para que todos puedan acceder.

---

## 📋 Opciones de Despliegue

| Opción | Precio | Dificultad | Velocidad | Recomendado |
|--------|--------|-----------|-----------|------------|
| **Vercel** (Recomendado) | GRATIS | Muy fácil | Rápido | ✅ Sí |
| **Netlify** | GRATIS | Muy fácil | Rápido | ✅ Sí |
| **GitHub Pages** | GRATIS | Fácil | Normal | ✅ Para aprender |
| **Firebase** | GRATIS + Pago | Fácil | Rápido | ✅ Escalable |
| **Servidor propio** | Depende | Difícil | Depende | ❌ No recomendado |

---

## 🟢 OPCIÓN 1: Vercel (MÁS FÁCIL - RECOMENDADO)

### Paso 1: Ir a Vercel

```
https://vercel.com
```

### Paso 2: Crear cuenta

```
1. Click en "Sign Up"
2. Opción: "Continue with GitHub"
   (Necesitarás una cuenta GitHub)
3. O: "Continue with Email"
4. Completa el registro
```

### Paso 3: Importar proyecto

```
1. En tu dashboard de Vercel
2. Click en "Add New..."
3. Selecciona "Project"
4. Selecciona "Import Git Repository"
5. Pega la URL de tu repositorio GitHub
   (Ejemplo: https://github.com/tu_usuario/fenifisc-inscripcion)
```

### Paso 4: Configurar

```
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### Paso 5: Desplegar

```
Click en "Deploy"
Espera 1-2 minutos
¡Listo! Tu sitio estará en vivo en una URL como:
https://fenifisc-inscripcion.vercel.app
```

### Ventajas
- ✅ GRATIS
- ✅ Deploy automático cuando subes código
- ✅ HTTPS incluido
- ✅ Muy rápido
- ✅ Solo 1 click

---

## 🔵 OPCIÓN 2: Netlify (CASI TAN FÁCIL)

### Paso 1: Ir a Netlify

```
https://netlify.com
```

### Paso 2: Conectar GitHub

```
1. Click en "Sign Up"
2. "Continue with GitHub"
3. Autoriza Netlify
```

### Paso 3: Crear nuevo sitio

```
1. Click en "New site from Git"
2. Selecciona tu repositorio GitHub
3. Netlify detecta automáticamente:
   - Build command: npm run build
   - Publish directory: dist
```

### Paso 4: Deploy

```
Netlify automáticamente:
1. Clona tu repositorio
2. Corre npm run build
3. Publica en dist/
4. Te da una URL como:
   https://fenifisc-inscripcion.netlify.app
```

---

## 🟣 OPCIÓN 3: GitHub Pages (GRATIS)

### Paso 1: Preparar repositorio

```bash
# 1. Asegúrate que tu código está en GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu_usuario/fenifisc-inscripcion.git
git push -u origin main
```

### Paso 2: Configurar Vite

En `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react(), singleFile()],
  base: '/fenifisc-inscripcion/', // Si es repositorio personal
  // O si es tu usuario.github.io:
  // base: '/',
})
```

### Paso 3: Configurar GitHub Pages

```
1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Build and deployment:
   - Source: GitHub Actions
   - Selecciona "Vite" como template
4. GitHub automáticamente crea workflow
```

### Paso 4: Deploy automático

```
Tu sitio se publicará en:
https://tu_usuario.github.io/fenifisc-inscripcion
```

---

## 🟠 OPCIÓN 4: Firebase Hosting (ESCALABLE)

### Paso 1: Crear proyecto Firebase

```
1. Abre https://firebase.google.com
2. "Get Started"
3. Click en "Create a project"
4. Nombre: fenifisc-2026
5. Crea el proyecto
```

### Paso 2: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### Paso 3: Login

```bash
firebase login
```

### Paso 4: Inicializar Firebase

```bash
firebase init hosting
```

Responde:
```
¿Qué carpeta usar para desplegar? → dist
¿Configurar como SPA? → Y (Yes)
¿Sobrescribir index.html? → N (No)
```

### Paso 5: Build y Deploy

```bash
npm run build
firebase deploy
```

Se publicará en:
```
https://fenifisc-2026.web.app
```

---

## 🌐 Configurar Dominio Personalizado

### Si quieres: inscripciones.fenifisc.com

#### Opción A: Con Vercel/Netlify

```
1. Tu dashboard → Settings
2. Domains
3. Add Custom Domain
4. fenifisc.com
5. Sigue las instrucciones DNS
```

#### Opción B: Con Firebase

```
1. Consola de Firebase
2. Hosting → Dominios personalizados
3. Conectar dominio
4. Verifica propiedad en registrador
5. Espera propagación DNS (24-48h)
```

---

## ✅ Checklist Antes de Desplegar

- [ ] Todos los IDs de Google están actualizados en `App.tsx`
- [ ] Google Apps Script está desplegado
- [ ] Google Sheet está configurado
- [ ] Google Drive tiene las carpetas
- [ ] Probaste localmente: `npm run dev`
- [ ] Generaste el build: `npm run build`
- [ ] El archivo `dist/index.html` existe
- [ ] El sitio funciona en producción

---

## 🧪 Verificar Despliegue

### 1. Ver el sitio en vivo

```
Abre tu URL en el navegador:
https://fenifisc-inscripcion.vercel.app
```

### 2. Llenar el formulario de prueba

```
1. Completa todos los campos
2. Sube fotos
3. Envía
```

### 3. Verificar que se guardó

```
1. Abre tu Google Sheet
2. Verifica que aparece la nueva fila
3. Abre Google Drive
4. Verifica que aparecen las fotos
```

### 4. Compartir el link

```
Copia tu URL y comparte:
- WhatsApp
- Facebook
- Email
- Página web
```

---

## 🔄 Actualizar el Sitio Después del Deploy

### Si usas Vercel/Netlify con GitHub

```bash
# 1. Haces cambios locales
# 2. Commits y push a GitHub
git add .
git commit -m "Actualización del formulario"
git push

# 3. Vercel/Netlify automáticamente:
#    - Detecta el cambio
#    - Corre npm run build
#    - Publica los cambios
#    (No necesitas hacer nada más)
```

### Si usas Firebase

```bash
# 1. Haces cambios locales
# 2. Rebuild
npm run build

# 3. Redeploy
firebase deploy

# El sitio se actualiza en segundos
```

---

## 🔐 Variables Secretas (si usas API keys)

### En Vercel/Netlify

```
1. Tu dashboard → Settings
2. Environment Variables
3. Agrega: VITE_GOOGLE_SCRIPT_URL = tu_url
```

En `src/App.tsx`:
```typescript
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
```

### En Firebase

```bash
firebase functions:config:set alguna.key="value"
```

---

## 📊 Monitoreo

### Vercel
```
Dashboard → Analytics
- Visitas
- Velocidad
- Errores
```

### Netlify
```
Site settings → Analytics
- Usuarios
- Performance
- Errores
```

### Firebase
```
Consola → Analytics
- Pageviews
- Session duration
- Dispositivos
```

---

## 🆘 Problemas Comunes

### Error: "Cannot find module"

```
Solución:
1. npm install
2. npm run build
3. Redeploy
```

### Error: "VITE_... is undefined"

```
Solución:
Agregaste una variable de entorno?
1. Reinicia npm run dev
2. Verifica en src/App.tsx que está correcto
3. Redeploy a producción
```

### El sitio dice "Not Found"

```
Solución 1: Espera 2 minutos (puede estar compilando)
Solución 2: Verifica que base en vite.config.ts es correcto
Solución 3: Reconstruye: npm run build
```

### Las fotos no se guardan

```
Solución:
1. Verifica que Google Apps Script está desplegado
2. Verifica que la URL del script es correcta
3. Abre DevTools (F12) → Console
4. Busca mensajes de error
5. Revisa los logs de Google Apps Script
```

---

## 📈 Escalar Después del Evento

### Si tienes muchas inscripciones

1. **Google Sheets** puede manejar 5 millones de celdas
2. **Google Drive** tiene almacenamiento limitado (15GB gratis)
3. **Considera:**
   - Comprimir las fotos
   - Archivar datos antiguos
   - Crear nuevos Sheets por categoría

### Si quieres mejorar

1. **Base de datos real** (Firebase Realtime Database)
2. **API Backend** (Node.js, Python, etc.)
3. **Sistema de pagos** (Stripe, PayPal)
4. **Dashboard de administración** (React Admin)

---

## 🎓 Recursos de Aprendizaje

### Documentación oficial
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Docs](https://vitejs.dev)

### Tutoriales
- YouTube: "Deploy Vite React to Vercel"
- YouTube: "Deploy Vite React to Netlify"
- Documentación oficial de cada plataforma

---

## 📞 Soporte

Si necesitas ayuda:

1. **Vercel Support:** https://vercel.com/support
2. **Netlify Support:** https://support.netlify.com
3. **Firebase Support:** https://firebase.google.com/support
4. **Nuestra email:** fenific@gmail.com

---

## ✨ Resumen

**Opción más fácil:** Vercel
1. Sign Up en Vercel
2. Conecta GitHub
3. Un click para desplegar
4. Automático para futuros cambios

**Tiempo total:** 5 minutos
**Costo:** GRATIS
**Resultado:** Sitio en vivo con HTTPS

---

**¡A desplegar!** 🚀


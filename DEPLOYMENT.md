# 🚀 Guía de Despliegue

Esta guía explica cómo desplegar All-in-One Toolbox en diferentes plataformas.

## 📋 Tabla de Contenidos

1. [Versión Web](#versión-web)
2. [Versión Escritorio Windows](#versión-escritorio-windows)
3. [Despliegue Rápido](#despliegue-rápido)

---

## 🌐 Versión Web

### Construcción

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Construir para producción
npm run build
```

Esto generará la carpeta `dist/` con todos los archivos optimizados.

### Opciones de Despliegue

#### 1. Vercel (Recomendado - Gratis)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

O conecta tu repositorio Git en https://vercel.com

**Configuración:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Vite`

#### 2. Netlify (Gratis)

**Opción A - Netlify CLI:**
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Desplegar
netlify deploy --prod --dir=dist
```

**Opción B - Arrastra y suelta:**
1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `dist/` a la página

**Configuración:**
- Build Command: `npm run build`
- Publish Directory: `dist`

#### 3. GitHub Pages (Gratis)

```bash
# Instalar gh-pages
npm i -D gh-pages

# Añadir script a package.json:
# "deploy": "gh-pages -d dist"

# Desplegar
npm run build
npm run deploy
```

Luego activa GitHub Pages en Settings → Pages → Source: gh-pages branch

#### 4. Servidor Propio

Copia el contenido de `dist/` a tu servidor web:

```bash
# Ejemplo con SCP
scp -r dist/* user@servidor:/var/www/html/toolbox/

# O con rsync
rsync -avz dist/ user@servidor:/var/www/html/toolbox/
```

**Configuración de servidor (Nginx):**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html/toolbox;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cacheo de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Configuración de servidor (Apache):**
```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /var/www/html/toolbox

    <Directory /var/www/html/toolbox>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Cacheo de assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

#### 5. Cloudflare Pages (Gratis)

1. Conecta tu repositorio en https://pages.cloudflare.com
2. Configura:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Build output: `dist`

---

## 🖥️ Versión Escritorio Windows

### Requisitos Previos

1. **Node.js 20+**
   - Descarga: https://nodejs.org/

2. **Rust**
   - Descarga: https://rustup.rs/
   - Ejecuta `rustup-init.exe`
   - Reinicia tu terminal después de la instalación

3. **Visual Studio Build Tools** (Windows)
   - Descarga: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Instala "Desktop development with C++"

### Construcción Automática

```bash
# Windows
.\build-all.bat

# Linux/Mac
chmod +x build-all.sh
./build-all.sh
```

### Construcción Manual

```bash
# Instalar dependencias
npm install

# Construir aplicación de escritorio
npm run tauri:build
```

El proceso tarda 5-15 minutos la primera vez (compila Rust).

### Ubicación de los Instaladores

Los instaladores se generan en:
```
src-tauri/target/release/bundle/
├── msi/
│   └── All-in-One Toolbox_1.0.0_x64_en-US.msi
└── nsis/
    └── All-in-One Toolbox_1.0.0_x64-setup.exe
```

### Tipos de Instaladores

**MSI (Recomendado para empresas):**
- Instalación silenciosa: `msiexec /i installer.msi /qn`
- Desinstalación desde Panel de Control
- Soporte de Group Policy

**NSIS (Recomendado para usuarios):**
- Instalador más pequeño
- Más opciones de personalización
- Mejor para distribución directa

### Firma de Código (Opcional)

Para producción, se recomienda firmar los ejecutables:

```bash
# Windows - con signtool
signtool sign /f certificado.pfx /p password /t http://timestamp.digicert.com installer.exe
```

---

## ⚡ Despliegue Rápido

### Para Testing Local

```bash
# Modo desarrollo (con hot reload)
npm run dev

# La app estará en http://localhost:1420
```

### Para Demo Rápida

```bash
# Construir y previsualizar
npm run build
npm run preview

# Acceder en http://localhost:4173
```

### Preview de Escritorio (Sin Compilar)

```bash
# Modo desarrollo de Tauri
npm run tauri:dev

# Se abrirá la ventana de la aplicación
```

---

## 🔧 Variables de Entorno

Si necesitas configuración personalizada, crea un archivo `.env`:

```env
# Ejemplo
VITE_APP_NAME=All-in-One Toolbox
VITE_VERSION=1.0.0
```

Accede en el código:
```typescript
const appName = import.meta.env.VITE_APP_NAME
```

---

## 📊 Monitoreo Post-Despliegue

### Analítica (Opcional)

Si decides añadir analítica respetando la privacidad:

1. **Plausible Analytics** (Recomendado)
   - Privacy-friendly
   - Sin cookies
   - GDPR compliant

2. **Fathom Analytics**
   - Similar a Plausible
   - Enfocado en privacidad

**Importante:** El proyecto está diseñado para **no tener tracking**. Solo añade analítica si es absolutamente necesario y siempre respetando la privacidad.

---

## 🐛 Troubleshooting

### Error: "command not found: vite"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de Rust/Tauri

```bash
# Actualizar Rust
rustup update

# Limpiar cache de Cargo
cargo clean
```

### Error de permisos (Linux/Mac)

```bash
# Dar permisos al script
chmod +x build-all.sh

# Ejecutar con sudo si es necesario
sudo ./build-all.sh
```

### Build muy lento

Primera compilación de Tauri es lenta (5-15 min). Las siguientes son más rápidas.

---

## 📝 Checklist Pre-Despliegue

- [ ] Código compilado sin errores
- [ ] Probado en Chrome, Firefox y Edge
- [ ] Probado en móvil
- [ ] Todas las herramientas funcionan
- [ ] Sin errores en consola
- [ ] README actualizado
- [ ] Versión correcta en package.json
- [ ] Licencia incluida
- [ ] .gitignore configurado

---

## 🎉 Post-Despliegue

1. Prueba la aplicación en producción
2. Verifica que todas las herramientas funcionan
3. Comparte el enlace o instalador
4. Monitorea feedback de usuarios
5. Actualiza según necesidades

---

## 📧 Soporte

Si tienes problemas con el despliegue:
- Email: javibarrientos0017@gmail.com
- Abre un issue en el repositorio

---

💜 ¡Buena suerte con tu despliegue!

# 🚀 Deployment Guide

## 📦 Cloudflare Pages (Web)

### Configuración en Cloudflare Pages:

1. **Build command**: `npm run build`
2. **Build output directory**: `dist`
3. **Root directory**: `/`
4. **Node version**: `22.16.0` (detectado automáticamente por `.nvmrc`)

### Environment Variables (opcional):
- No se requieren variables de entorno para el build

### Headers de Seguridad:
Se incluye automáticamente el archivo `_headers` con políticas de seguridad.

---

## 🪟 Windows Installer (Desktop App)

### Generar Instalador Manualmente:

```bash
# Instalar dependencias
npm install

# Compilar aplicación de Tauri
npm run tauri build
```

Los instaladores se generarán en:
- **MSI**: `src-tauri/target/release/bundle/msi/`
- **NSIS (EXE)**: `src-tauri/target/release/bundle/nsis/`

### Generar Instalador con GitHub Actions:

#### Opción 1: Release con Versión Tag
```bash
# Crear y pushear un tag de versión
git tag v1.0.1
git push origin v1.0.1
```
Esto automáticamente:
- ✅ Compila la aplicación
- ✅ Genera instaladores MSI y NSIS
- ✅ Crea una GitHub Release
- ✅ Sube los instaladores a la release

#### Opción 2: Build Manual desde GitHub
1. Ve a **Actions** en tu repositorio
2. Selecciona **"Release Windows Installer"**
3. Click en **"Run workflow"**
4. Selecciona la rama
5. Click **"Run workflow"**

---

## 📋 Versionado

### Estructura de Versiones:
- **Major**: Cambios incompatibles (`v2.0.0`)
- **Minor**: Nuevas características (`v1.1.0`)
- **Patch**: Correcciones de bugs (`v1.0.1`)

### Actualizar Versión:

1. Actualizar `package.json` y `src-tauri/tauri.conf.json`
2. Crear tag y push:

```bash
git add .
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

---

## 🛠️ Requisitos

- Node.js 22.16.0
- npm 10.9.2
- Rust (para builds de Tauri)

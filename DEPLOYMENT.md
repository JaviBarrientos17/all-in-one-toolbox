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

## 📋 Versionado

### Estructura de Versiones:
- **Major**: Cambios incompatibles (`v2.0.0`)
- **Minor**: Nuevas características (`v1.1.0`)
- **Patch**: Correcciones de bugs (`v1.0.1`)

### Actualizar Versión:

1. Actualizar `package.json`
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

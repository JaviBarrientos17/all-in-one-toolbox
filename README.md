# 🛠️ All-in-One Toolbox

**100% Local File Processing** - Herramientas de procesamiento de archivos completamente locales y seguras.

[![Build Status](https://github.com/JaviBarrientos17/all-in-one-toolbox/workflows/Build%20and%20Test/badge.svg)](https://github.com/JaviBarrientos17/all-in-one-toolbox/actions)
[![Release](https://github.com/JaviBarrientos17/all-in-one-toolbox/workflows/Release%20Windows%20Installer/badge.svg)](https://github.com/JaviBarrientos17/all-in-one-toolbox/releases)

---

## 🌟 Características

### 🖼️ Herramientas de Imagen
- ✅ Comprimir imágenes (JPG, PNG, WebP, HEIC)
- ✅ Redimensionar con bloqueo de proporción
- ✅ Convertir entre formatos
- ✅ Rotar imágenes
- ✅ Añadir marcas de agua
- 🔜 Recortar imágenes

### 📄 Herramientas PDF
- ✅ Fusionar múltiples PDFs
- ✅ Dividir PDF en páginas individuales
- ✅ Extraer páginas específicas
- ✅ Rotar páginas
- 🔜 Comprimir PDFs

### 📝 Herramientas de Documentos
- ✅ TXT a PDF
- ✅ CSV a JSON
- ✅ JSON a CSV
- 🔜 Word a PDF
- 🔜 Excel a PDF

### 🎬 Herramientas de Video
- 🔜 Próximamente

---

## 🚀 Instalación

### Opción 1: Aplicación de Escritorio (Windows)

Descarga el instalador desde [GitHub Releases](https://github.com/JaviBarrientos17/all-in-one-toolbox/releases/latest):

- **MSI Installer**: Para instalación corporativa
- **NSIS Installer (EXE)**: Para instalación rápida

### Opción 2: Aplicación Web

Visita: [all-in-one-toolbox.pages.dev](https://all-in-one-toolbox.pages.dev)

---

## 💻 Desarrollo

### Requisitos Previos
- Node.js 22.16.0
- npm 10.9.2
- Rust (solo para builds de escritorio)

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/JaviBarrientos17/all-in-one-toolbox.git
cd all-in-one-toolbox

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (Web)
npm run dev

# Ejecutar aplicación de escritorio (Tauri)
npm run tauri:dev
```

### Compilar para Producción

```bash
# Build para web
npm run build

# Build para escritorio (Windows)
npm run tauri:build
```

---

## 📦 Crear Nueva Versión

### Método Automático (Recomendado)

```bash
# Actualizar versión patch (1.0.0 → 1.0.1)
npm run version:patch

# Actualizar versión minor (1.0.0 → 1.1.0)
npm run version:minor

# Actualizar versión major (1.0.0 → 2.0.0)
npm run version:major

# Pushear cambios y tag para crear release automático
git push origin main
git push origin v1.0.1
```

### Método Manual

1. Actualizar versión en `package.json`
2. Actualizar versión en `src-tauri/tauri.conf.json`
3. Crear commit y tag:

```bash
git add .
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push origin main
git push origin v1.0.1
```

---

## 🔒 Seguridad y Privacidad

- ✅ **100% Procesamiento Local** - Tus archivos nunca salen de tu dispositivo
- ✅ **Sin Servidores** - Todo el procesamiento ocurre en tu navegador/PC
- ✅ **Sin Tracking** - No recopilamos ningún dato
- ✅ **Open Source** - Código completamente auditable

---

## 🌍 Idiomas Soportados

- 🇬🇧 English
- 🇪🇸 Español

---

## 🎨 Temas

- ☀️ Modo Claro
- 🌙 Modo Oscuro

---

## 📱 Responsive Design

Optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Portátiles (1024px+)
- 🖥️ Escritorio (1280px+)
- 🖥️ Pantallas grandes (1920px+)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 🔗 Enlaces

- 🌐 [Aplicación Web](https://all-in-one-toolbox.pages.dev)
- 📦 [Releases](https://github.com/JaviBarrientos17/all-in-one-toolbox/releases)
- 🐛 [Reportar Bug](https://github.com/JaviBarrientos17/all-in-one-toolbox/issues)
- 💡 [Solicitar Feature](https://github.com/JaviBarrientos17/all-in-one-toolbox/issues)

---

## 👨‍💻 Autor

**Javi Barrientos**

- GitHub: [@JaviBarrientos17](https://github.com/JaviBarrientos17)

---

## 🙏 Agradecimientos

- [Tauri](https://tauri.app/) - Framework para aplicaciones de escritorio
- [React](https://react.dev/) - Biblioteca de UI
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [pdf-lib](https://pdf-lib.js.org/) - Manipulación de PDFs
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - Compresión de imágenes

---

**Made with ❤️ by Javi Barrientos**

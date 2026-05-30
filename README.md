# 🛠️ All-in-One Toolbox

**Todas tus herramientas en un solo lugar • 100% Local • Sin Internet**

Una suite completa de herramientas para procesamiento de archivos que funciona completamente en local, sin necesidad de subir tus archivos a ningún servidor. Disponible como aplicación web y aplicación de escritorio para Windows 10/11.

## ✨ Características

### 🖼️ Herramientas de Imagen
- **Comprimir**: Reduce el tamaño de tus imágenes sin perder calidad
- **Redimensionar**: Cambia las dimensiones de tus imágenes
- **Convertir**: Convierte entre formatos (PNG, JPEG, WebP)
- **Rotar**: Rota imágenes 90°, 180° o 270°
- **Recortar**: Recorta áreas específicas de tus imágenes (en desarrollo)

### 📄 Herramientas de PDF
- **Fusionar**: Combina múltiples PDFs en uno solo
- **Dividir**: Separa un PDF en páginas individuales
- **Extraer**: Extrae páginas específicas de un PDF
- **Rotar**: Rota todas las páginas de un PDF
- **Comprimir**: Reduce el tamaño de archivos PDF (en desarrollo)

### 🎬 Herramientas de Video (Próximamente)
- Conversión de formatos
- Comprimir videos
- Extraer audio
- Crear GIFs desde video

### 📝 Herramientas de Documentos (Próximamente)
- Conversión Word/PDF
- Manipulación de Excel
- Conversión de formatos

## 🚀 Inicio Rápido

### Versión Web

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:1420
```

### Versión Escritorio (Windows 10/11)

**Requisitos previos:**
- Node.js 20+
- Rust (para compilar Tauri)
  - Instalar desde: https://rustup.rs/

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run tauri:dev

# Compilar aplicación
npm run tauri:build

# El instalador se generará en src-tauri/target/release/bundle/
```

## 🛡️ Privacidad y Seguridad

**100% Procesamiento Local**: Todos los archivos se procesan completamente en tu dispositivo. Nunca se suben a ningún servidor externo.

- ✅ Sin conexión a internet requerida (después de la carga inicial)
- ✅ Tus archivos nunca abandonan tu ordenador
- ✅ Sin bases de datos externas
- ✅ Sin seguimiento ni analytics
- ✅ Sin registro de usuarios

## 🔧 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Desktop**: Tauri 2
- **PDF Processing**: pdf-lib, pdfjs-dist
- **Image Processing**: browser-image-compression
- **File Handling**: JSZip, file-saver

## 📦 Estructura del Proyecto

```
all-in-one-toolbox/
├── src/
│   ├── components/
│   │   ├── ImageTools.tsx    # Herramientas de imagen
│   │   └── PDFTools.tsx       # Herramientas de PDF
│   ├── App.tsx                # Componente principal
│   ├── main.tsx               # Entry point
│   └── index.css              # Estilos globales
├── src-tauri/                 # Configuración Tauri
│   ├── src/
│   │   └── main.rs            # Backend Rust
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/                    # Assets estáticos
├── progress-reports/          # Reportes de progreso
└── package.json

```

## 📊 Reportes de Progreso

El proyecto incluye un sistema de generación automática de reportes:

```bash
npm run report
```

Los reportes se guardan en `progress-reports/` y contienen:
- Estadísticas del código
- Funcionalidades implementadas
- Estado de cada herramienta
- Próximos pasos

## 🤝 Contribuciones

Este proyecto está en desarrollo activo. Las siguientes funcionalidades están planeadas:

- [ ] Drag & drop de archivos
- [ ] Preview de imágenes antes de procesar
- [ ] Más formatos de imagen (HEIC, TIFF, BMP)
- [ ] Herramientas de video con FFmpeg.wasm
- [ ] Historial de operaciones
- [ ] Configuración avanzada de calidad
- [ ] Batch processing mejorado
- [ ] Modo oscuro
- [ ] Múltiples idiomas

## 📝 Licencia

MIT License - Libre para uso personal y comercial

## 👤 Autor

**Javi Barrientos**
- Email: javibarrientos0017@gmail.com

---

💜 **Hecho con amor para la comunidad** • Sin telemetría • Sin suscripciones • Gratis para siempre

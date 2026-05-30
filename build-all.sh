#!/bin/bash

echo "🛠️ All-in-One Toolbox - Script de Construcción Completa"
echo "========================================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo -e "${BLUE}[1/7]${NC} Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js instalado: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js no está instalado"
    exit 1
fi

# Verificar npm
echo -e "${BLUE}[2/7]${NC} Verificando npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm instalado: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm no está instalado"
    exit 1
fi

# Instalar dependencias
echo ""
echo -e "${BLUE}[3/7]${NC} Instalando dependencias..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencias instaladas correctamente"
else
    echo -e "${RED}✗${NC} Error instalando dependencias"
    exit 1
fi

# Construir versión web
echo ""
echo -e "${BLUE}[4/7]${NC} Construyendo versión web..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Versión web construida en dist/"
else
    echo -e "${RED}✗${NC} Error construyendo versión web"
    exit 1
fi

# Generar reporte
echo ""
echo -e "${BLUE}[5/7]${NC} Generando reporte de progreso..."
npm run report
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Reporte generado"
else
    echo -e "${RED}⚠${NC} Error generando reporte (no crítico)"
fi

# Verificar Rust para Tauri
echo ""
echo -e "${BLUE}[6/7]${NC} Verificando Rust (para versión escritorio)..."
if command_exists cargo; then
    RUST_VERSION=$(rustc --version)
    echo -e "${GREEN}✓${NC} Rust instalado: $RUST_VERSION"

    # Intentar construir versión escritorio
    echo ""
    echo -e "${BLUE}[7/7]${NC} Construyendo versión escritorio..."
    echo "Esto puede tomar varios minutos..."
    npm run tauri:build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Versión escritorio construida en src-tauri/target/release/bundle/"
    else
        echo -e "${RED}✗${NC} Error construyendo versión escritorio"
    fi
else
    echo -e "${RED}✗${NC} Rust no está instalado"
    echo "  Instala Rust desde: https://rustup.rs/"
    echo "  Saltando construcción de versión escritorio..."
fi

# Resumen final
echo ""
echo "========================================================"
echo -e "${GREEN}✅ Construcción completada${NC}"
echo ""
echo "📁 Archivos generados:"
echo "  - dist/                    (Versión web)"
echo "  - src-tauri/target/...     (Versión escritorio, si Rust está instalado)"
echo "  - progress-reports/        (Reportes de progreso)"
echo ""
echo "🚀 Siguiente paso:"
echo "  - Versión web: Despliega la carpeta 'dist/' en cualquier servidor web"
echo "  - Versión escritorio: Instalador en src-tauri/target/release/bundle/"
echo ""
echo "💜 All-in-One Toolbox - Ready to deploy!"

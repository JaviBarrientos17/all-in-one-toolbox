@echo off
echo.
echo ========================================================
echo   All-in-One Toolbox - Script de Construccion Completa
echo ========================================================
echo.

REM Verificar Node.js
echo [1/7] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js instalado: %NODE_VERSION%

REM Verificar npm
echo.
echo [2/7] Verificando npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no esta instalado
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm instalado: %NPM_VERSION%

REM Instalar dependencias
echo.
echo [3/7] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas correctamente

REM Construir version web
echo.
echo [4/7] Construyendo version web...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Error construyendo version web
    pause
    exit /b 1
)
echo [OK] Version web construida en dist/

REM Generar reporte
echo.
echo [5/7] Generando reporte de progreso...
call npm run report
if %errorlevel% neq 0 (
    echo [WARN] Error generando reporte (no critico^)
)
echo [OK] Reporte generado

REM Verificar Rust
echo.
echo [6/7] Verificando Rust (para version escritorio^)...
where cargo >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Rust no esta instalado
    echo   Instala Rust desde: https://rustup.rs/
    echo   Saltando construccion de version escritorio...
    goto :summary
)
for /f "tokens=*" %%i in ('rustc --version') do set RUST_VERSION=%%i
echo [OK] Rust instalado: %RUST_VERSION%

REM Build web version
echo.
echo [6/6] Building web version...
echo Running build...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Error building web version
) else (
    echo [OK] Web version built in dist/
)

:summary
echo.
echo ========================================================
echo [OK] Construccion completada
echo.
echo Archivos generados:
echo   - dist/                    (Version web^)
echo   - progress-reports/        (Progress reports^)
echo.
echo Next step:
echo   - Web version: Deploy the 'dist/' folder to any web server
echo.
echo All-in-One Toolbox - Ready to deploy!
echo ========================================================
echo.
pause

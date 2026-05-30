# Guía de Contribución

¡Gracias por tu interés en contribuir a All-in-One Toolbox! 🎉

## Cómo Contribuir

### Reportar Bugs

Si encuentras un bug, por favor abre un issue con:
- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs. actual
- Capturas de pantalla si es relevante
- Navegador y sistema operativo

### Sugerir Funcionalidades

Para sugerir nuevas funcionalidades:
1. Verifica que no exista ya en los issues
2. Describe claramente la funcionalidad
3. Explica por qué sería útil
4. Si es posible, sugiere una implementación

### Pull Requests

1. **Fork del repositorio**
2. **Crea una rama** para tu funcionalidad:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Realiza tus cambios** siguiendo las guías de estilo
4. **Prueba tus cambios** exhaustivamente
5. **Commit** con mensajes descriptivos:
   ```bash
   git commit -m "feat: añade herramienta de recorte de imágenes"
   ```
6. **Push a tu fork**:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
7. **Abre un Pull Request** con:
   - Descripción clara de los cambios
   - Screenshots si hay cambios visuales
   - Referencia a issues relacionados

## Guías de Estilo

### Código TypeScript/React

- Usa TypeScript estricto
- Componentes funcionales con hooks
- Props tipadas con interfaces
- Nombres descriptivos en inglés para código
- Comentarios en español para explicaciones complejas

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

### CSS

- Usar Tailwind CSS siempre que sea posible
- Clases descriptivas y reutilizables
- Evitar estilos inline excepto para valores dinámicos

## Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── hooks/          # Custom hooks
├── types/          # Definiciones TypeScript
└── utils/          # Utilidades y helpers
```

## Principios de Desarrollo

1. **Privacidad primero**: Todo debe procesarse localmente
2. **Sin dependencias innecesarias**: Evalúa cuidadosamente antes de añadir librerías
3. **Rendimiento**: Optimiza operaciones pesadas
4. **Accesibilidad**: Interfaces accesibles para todos
5. **UX intuitiva**: Interfaces claras y fáciles de usar

## Testing

Antes de hacer un PR:
- [ ] Prueba la funcionalidad en Chrome
- [ ] Prueba en Firefox
- [ ] Prueba en Edge
- [ ] Verifica responsive (móvil, tablet, desktop)
- [ ] Verifica que no rompe funcionalidades existentes
- [ ] Revisa que no hay errores en consola

## Herramientas de Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview

# Generar reporte de progreso
npm run report

# Sistema de reportes automáticos
npm run auto-report
```

## ¿Necesitas Ayuda?

Si tienes dudas:
- Abre un issue con la etiqueta "question"
- Contacta a javibarrientos0017@gmail.com

## Código de Conducta

- Sé respetuoso y considerado
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contribuidores

¡Gracias por contribuir! 💜

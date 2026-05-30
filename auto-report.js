import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ONE_HOUR = 60 * 60 * 1000; // 1 hora en milisegundos

console.log('🤖 Sistema de reportes automáticos iniciado');
console.log(`📊 Generando reportes cada hora...`);
console.log(`⏰ Próximo reporte: ${new Date(Date.now() + ONE_HOUR).toLocaleString('es-ES')}\n`);

// Generar reporte inmediatamente al iniciar
generateReport();

// Programar reportes cada hora
setInterval(() => {
  generateReport();
}, ONE_HOUR);

async function generateReport() {
  const timestamp = new Date().toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  console.log(`\n📝 [${timestamp}] Generando reporte de progreso...`);

  try {
    const { stdout, stderr } = await execAsync('node generate-report.js');
    console.log(stdout);

    if (stderr) {
      console.error('⚠️ Advertencias:', stderr);
    }

    console.log(`✅ Reporte generado exitosamente`);
    console.log(`⏰ Próximo reporte: ${new Date(Date.now() + ONE_HOUR).toLocaleString('es-ES')}`);
  } catch (error) {
    console.error('❌ Error generando reporte:', error.message);
  }
}

// Mantener el proceso vivo
process.on('SIGINT', () => {
  console.log('\n\n👋 Sistema de reportes detenido');
  process.exit(0);
});

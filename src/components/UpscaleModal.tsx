import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface UpscaleModalProps {
  onApply: (scaleFactor: number) => void;
  onCancel: () => void;
}

const UpscaleModal: React.FC<UpscaleModalProps> = ({ onApply, onCancel }) => {
  const { t } = useLanguage();
  const [scale, setScale] = useState<number>(2);
  // Guardamos el 'status' en lugar del texto fijo para poder traducirlo dinámicamente
  const [gpuInfo, setGpuInfo] = useState<{ size: number; status: string }>({ size: 0, status: 'loading' });

  // Opciones de escala que quieres ofrecer
  const scaleOptions = [2, 3, 4, 8];

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext);

      if (gl) {
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        let status = 'low'; // Básica
        
        if (maxTextureSize >= 16384) {
          status = 'high'; // Alto rendimiento
        } else if (maxTextureSize >= 8192) {
          status = 'med'; // Estándar
        }

        setGpuInfo({ size: maxTextureSize, status });
      } else {
        setGpuInfo({ size: 0, status: 'none' });
      }
    } catch (error) {
      setGpuInfo({ size: 0, status: 'error' });
    }
  }, []);

  // Función para obtener la traducción correcta del estado de la GPU
  const getGpuLabel = (status: string) => {
    switch (status) {
      case 'high': return t('upscale.gpu.high');
      case 'med': return t('upscale.gpu.med');
      case 'low': return t('upscale.gpu.low');
      case 'none': return t('upscale.gpu.none');
      case 'error': return t('upscale.gpu.error');
      default: return t('upscale.gpu.loading') || 'Calculando...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="toolbox-modal-card bg-slate-900 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✨</span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {t('upscale.title')}
          </h3>
        </div>
        
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          {t('upscale.desc')}
        </p>

        {/* Sección de información de hardware */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="text-sm font-semibold text-slate-200">{t('upscale.hardware')}:</span>
          </div>
          <p className="text-xs text-slate-400">
            {getGpuLabel(gpuInfo.status)} <br/>
            <span className="opacity-75">({t('upscale.limit')}: {gpuInfo.size}px)</span>
          </p>
        </div>

        {/* Selector de escala */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            {t('upscale.factor')}
          </label>
          {/* Usamos grid-cols-4 para que quepan las 4 opciones */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {scaleOptions.map((val) => (
              <button
                key={val}
                onClick={() => setScale(val)}
                className={`py-3 rounded-lg border-2 font-medium transition-all ${
                  scale === val
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
              >
                {val}x
              </button>
            ))}
          </div>
          {scale >= 4 && (
            <p className="text-xs text-amber-500 mt-3 flex items-start gap-1.5">
              <span>⚠️</span>
              <span>{scale}x {t('upscale.warning')}</span>
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {t('upscale.cancel')}
          </button>
          <button
            onClick={() => onApply(scale)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
          >
            {t('upscale.start')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpscaleModal;
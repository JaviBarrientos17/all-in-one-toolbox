import React from 'react';
import { useOutputs } from '../hooks/useOutputs';
import { useLanguage } from '../contexts/LanguageContext';
import { saveAs } from 'file-saver';

const OutputGallery: React.FC = () => {
  const { outputs, removeOutput, clearOutputs, loading } = useOutputs();
  const { t } = useLanguage();

  const handleDownload = (blob: Blob, name: string) => {
    saveAs(blob, name);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (outputs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          📥
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-2">{t('outputs.empty')}</h3>
        <p className="text-slate-500 dark:text-slate-400">{t('history.empty.desc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📥</span> {t('outputs.title')}
        </h2>
        <button
          onClick={clearOutputs}
          className="text-xs font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t('outputs.clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {outputs.map((file) => (
          <div
            key={file.id}
            className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Preview Area */}
            <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file.blob)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl">
                  {file.category === 'pdf' ? '📄' : file.category === 'document' ? '📝' : '📦'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleDownload(file.blob, file.name)}
                  className="p-3 bg-white text-indigo-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                  title={t('outputs.download')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={() => removeOutput(file.id)}
                  className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  title={t('outputs.delete')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info Area */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={file.name}>
                  {file.name}
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {file.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{new Date(file.timestamp).toLocaleString()}</span>
                <span>{(file.blob.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutputGallery;

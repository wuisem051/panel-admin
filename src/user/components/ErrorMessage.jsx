import React, { useEffect } from 'react';

const ErrorMessage = ({ message, onDismiss, type = 'error' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${
        isError 
          ? 'bg-red-500/10 border-red-500/20 text-red-200' 
          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
      }`}>
        <div className={`p-2 rounded-lg ${isError ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
          {isError ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider opacity-50">
            {isError ? 'Error del Sistema' : 'Operación Exitosa'}
          </span>
          <p className="text-sm font-medium">{message}</p>
        </div>

        <button 
          onClick={onDismiss}
          className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;

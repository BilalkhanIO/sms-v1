import React from 'react';
import { useUIStore } from '../../store/zustand/useUIStore';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error:   <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info:    <Info className="h-5 w-5 text-blue-500" />,
};

const BG = {
  success: 'border-green-200 bg-green-50',
  error:   'border-red-200 bg-red-50',
  warning: 'border-yellow-200 bg-yellow-50',
  info:    'border-blue-200 bg-blue-50',
};

const ToastContainer = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right-4 ${BG[t.type] || BG.info}`}
        >
          <span className="shrink-0 mt-0.5">{ICONS[t.type] || ICONS.info}</span>
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-sm font-medium text-gray-900">{t.title}</p>}
            {t.message && <p className="text-sm text-gray-600 mt-0.5">{t.message}</p>}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

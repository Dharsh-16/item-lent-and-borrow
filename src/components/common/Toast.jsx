import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, hideToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={18} color="#10b981" />;
            case 'warning':
              return <AlertCircle size={18} color="#f59e0b" />;
            case 'error':
              return <AlertCircle size={18} color="#ef4444" />;
            default:
              return <Info size={18} color="#6366f1" />;
          }
        };

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {getIcon()}
            </div>

            <div style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {toast.message}
            </div>

            {toast.actionLabel && toast.onAction && (
              <button 
                type="button" 
                className="toast-undo-btn"
                onClick={() => {
                  toast.onAction();
                  hideToast(toast.id);
                }}
              >
                {toast.actionLabel}
              </button>
            )}

            <button 
              type="button" 
              className="btn-icon" 
              style={{ padding: '4px', marginLeft: '4px' }} 
              onClick={() => hideToast(toast.id)}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

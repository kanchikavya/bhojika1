import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const bgClasses = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-dark',
    error: 'bg-danger text-white',
    info: 'bg-primary text-white',
  };

  const icons = {
    success: <CheckCircle2 size={18} className="me-2" />,
    warning: <AlertTriangle size={18} className="me-2" />,
    error: <XCircle size={18} className="me-2" />,
    info: <Info size={18} className="me-2" />,
  };

  const type = toast.type || 'info';

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1090 }}>
      <div className={`toast show align-items-center ${bgClasses[type]} border-0 shadow-lg`} role="alert">
        <div className="d-flex">
          <div className="toast-body d-flex align-items-center fw-medium py-2 px-3">
            {icons[type]}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`btn-close ${type !== 'warning' ? 'btn-close-white' : ''} me-2 m-auto`}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
}

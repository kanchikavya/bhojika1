import React from 'react';
import { Utensils, RefreshCw } from 'lucide-react';

export default function Navbar({ onRefresh, loading }) {
  return (
    <header className="navbar navbar-expand bg-fiesta shadow-sm sticky-top px-3 px-md-4 py-2">
      <div className="container-fluid px-0 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-white bg-opacity-25 text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Utensils size={22} />
          </div>
          <span className="navbar-brand text-white fw-bold fs-4 mb-0 py-0 tracking-tight">
            Food Fiesta
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={14} className={loading ? 'fa-spin' : ''} />
            <span>Refresh</span>
          </button>

          <span className="badge bg-white text-dark px-3 py-2 rounded-3 fw-bold shadow-sm">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}

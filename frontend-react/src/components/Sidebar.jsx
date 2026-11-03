import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  DollarSign,
  AlertCircle,
  Star,
  Activity,
  BarChart3,
  Workflow
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'refunds', label: 'Refunds', icon: DollarSign },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'status', label: 'Order Tracking', icon: Activity, badge: 'Live' },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'workflow', label: 'Workflow Guide', icon: Workflow },
  ];

  return (
    <aside
      className="bg-white border-end shadow-sm d-flex flex-column"
      style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}
    >
      <div className="p-3 border-bottom">
        <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
          Menu
        </span>
      </div>

      <nav className="p-2 flex-grow-1 overflow-auto">
        <div className="d-flex flex-column gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link border-0 text-start w-100 ${isActive ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-2 flex-grow-1">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${isActive ? 'bg-light text-dark' : 'bg-success'} rounded-pill`} style={{ fontSize: '0.65rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

import DashboardView from './views/DashboardView';
import UsersView from './views/UsersView';
import OrdersView from './views/OrdersView';
import PaymentsView from './views/PaymentsView';
import ReturnsView from './views/ReturnsView';
import RefundsView from './views/RefundsView';
import ComplaintsView from './views/ComplaintsView';
import FeedbackView from './views/FeedbackView';
import StatusTrackingView from './views/StatusTrackingView';
import AnalyticsView from './views/AnalyticsView';
import WorkflowView from './views/WorkflowView';

import api from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      showToast('Could not connect to Django API on port 8000', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            stats={dashboardStats}
            setActiveTab={setActiveTab}
            onRefresh={loadStats}
          />
        );
      case 'users':
        return <UsersView showToast={showToast} />;
      case 'orders':
        return <OrdersView showToast={showToast} />;
      case 'payments':
        return <PaymentsView showToast={showToast} />;
      case 'returns':
        return <ReturnsView showToast={showToast} />;
      case 'refunds':
        return <RefundsView showToast={showToast} />;
      case 'complaints':
        return <ComplaintsView showToast={showToast} />;
      case 'feedback':
        return <FeedbackView showToast={showToast} />;
      case 'status':
        return <StatusTrackingView showToast={showToast} />;
      case 'analytics':
        return <AnalyticsView showToast={showToast} />;
      case 'workflow':
        return <WorkflowView />;
      default:
        return <DashboardView stats={dashboardStats} setActiveTab={setActiveTab} onRefresh={loadStats} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar onRefresh={loadStats} loading={loading} />

      <div className="d-flex flex-grow-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-grow-1 p-3 p-md-4 overflow-auto" style={{ maxWidth: '100%' }}>
          <div className="container-fluid px-0">
            {renderActiveView()}
          </div>
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

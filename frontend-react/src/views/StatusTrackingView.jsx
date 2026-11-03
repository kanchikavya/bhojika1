import React, { useState, useEffect } from 'react';
import { Activity, RotateCcw, ShieldCheck } from 'lucide-react';
import api from '../api';

export default function StatusTrackingView({ showToast }) {
  const [statuses, setStatuses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusesData, logsData] = await Promise.all([
        api.getStatuses(),
        api.getOrderLogs(),
      ]);
      setStatuses(statusesData);
      setLogs(logsData);
      if (statusesData.length > 0 && !selectedOrder) {
        setSelectedOrder(statusesData[0]);
      }
    } catch (err) {
      showToast('Error loading order status history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'Received in kitchen queue' },
    { key: 'preparing', label: 'Kitchen Prep', desc: 'Chefs cooking meal' },
    { key: 'completed', label: 'Delivered', desc: 'Handed over to customer' },
  ];

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <Activity size={22} className="text-fiesta" /> Live Order Tracking & Logs
        </h2>
        <small className="text-muted">Kitchen lifecycle transitions, delivery statuses, and event logs.</small>
      </div>

      <div className="row g-3">
        {/* Order Status Cards List */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-2.5 border-bottom">
              <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>Orders in System</span>
            </div>
            <div className="card-body p-2" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center py-4 text-muted small">Loading orders...</div>
              ) : (
                <div className="d-flex flex-column gap-1.5">
                  {statuses.map((st) => {
                    const isSelected = selectedOrder?.status_id === st.status_id;
                    return (
                      <div
                        key={st.status_id}
                        onClick={() => setSelectedOrder(st)}
                        className={`p-2.5 rounded-3 border cursor-pointer transition ${
                          isSelected ? 'bg-fiesta text-white border-danger' : 'bg-light hover-bg'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold small text-capitalize">{st.order_item || 'Food Item'}</span>
                          <span className={`badge ${
                            isSelected ? 'bg-light text-dark' :
                            st.status === 'completed' ? 'bg-success' :
                            st.status === 'returned' ? 'bg-danger' : 'bg-warning text-dark'
                          } text-capitalize`} style={{ fontSize: '0.65rem' }}>
                            {st.status}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.7rem' }}>
                          <span className={isSelected ? 'text-white-50' : 'text-muted'}>
                            Order #{st.order} ({st.user_name})
                          </span>
                          <span className={isSelected ? 'text-white-50' : 'text-muted'}>
                            {st.updated_at ? new Date(st.updated_at).toLocaleDateString() : 'Active'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Order Detail */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
          {selectedOrder ? (
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                  <div>
                    <span className="text-uppercase text-danger fw-bold small">Live Pipeline</span>
                    <h3 className="h5 fw-bold text-dark text-capitalize mb-0 mt-1">
                      Order #{selectedOrder.order} — {selectedOrder.order_item}
                    </h3>
                    <small className="text-muted">Ordered by {selectedOrder.user_name}</small>
                  </div>
                  <span className={`badge ${
                    selectedOrder.status === 'completed' ? 'bg-success' :
                    selectedOrder.status === 'returned' ? 'bg-danger' : 'bg-warning text-dark'
                  } text-capitalize px-3 py-2 fs-6`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Timeline Steps */}
                <div className="row text-center py-3 g-2">
                  {steps.map((st, i) => {
                    const isPassed =
                      selectedOrder.status === 'completed' ||
                      (selectedOrder.status === 'pending' && i === 0);
                    return (
                      <div key={st.key} className="col-4">
                        <div className={`mx-auto rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm mb-2 ${
                          isPassed ? 'bg-fiesta text-white' : 'bg-light text-muted border'
                        }`} style={{ width: '40px', height: '40px' }}>
                          {i + 1}
                        </div>
                        <div className="fw-bold small text-dark">{st.label}</div>
                        <small className="text-muted d-none d-md-block" style={{ fontSize: '0.7rem' }}>{st.desc}</small>
                      </div>
                    );
                  })}
                </div>

                {selectedOrder.status === 'returned' && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0 small" role="alert">
                    <RotateCcw size={16} />
                    <span>This order has been returned by customer. Refund processing active.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-3 p-4 text-center text-muted small">
              Select an order to view its status timeline.
            </div>
          )}

          {/* Action Logs */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-2.5 border-bottom d-flex align-items-center gap-1.5">
              <ShieldCheck size={16} className="text-success" />
              <span className="fw-bold small text-dark">System Action & Event Logs</span>
            </div>
            <div className="card-body p-2" style={{ maxHeight: '220px', overflowY: 'auto' }}>
              {logs.length === 0 ? (
                <div className="p-3 text-center text-muted small">No logs generated.</div>
              ) : (
                <div className="d-flex flex-column gap-1.5">
                  {logs.map((log) => (
                    <div key={log.log_id} className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center border small">
                      <div>
                        <span className="fw-bold text-dark">Order #{log.order}:</span>{' '}
                        <span className="text-secondary">{log.action_type}</span>
                      </div>
                      <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>
                        {log.action_time ? new Date(log.action_time).toLocaleTimeString() : 'Just now'}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

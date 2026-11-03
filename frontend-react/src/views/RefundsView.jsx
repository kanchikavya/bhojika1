import React, { useState, useEffect } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import api from '../api';

export default function RefundsView({ showToast }) {
  const [refunds, setRefunds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    order: '',
    user: '',
    amount: '',
    status: 'completed',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [refundsData, ordersData] = await Promise.all([
        api.getRefunds(),
        api.getOrders(),
      ]);
      setRefunds(refundsData);
      setOrders(ordersData);
    } catch (err) {
      showToast('Error loading refunds', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOrderSelect = (orderId) => {
    const selected = orders.find(o => String(o.order_id) === String(orderId));
    if (selected) {
      setFormData({
        order: selected.order_id,
        user: selected.user,
        amount: selected.total_price,
        status: 'completed',
      });
    }
  };

  const handleCreateRefund = async (e) => {
    e.preventDefault();
    if (!formData.order || !formData.amount) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    try {
      await api.createRefund({
        order: Number(formData.order),
        user: Number(formData.user),
        amount: Number(formData.amount),
        status: formData.status,
      });
      showToast(`Refund processed for Order #${formData.order}`, 'success');
      setIsAddOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to create refund record', 'error');
    }
  };

  const totalRefundAmount = refunds.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <DollarSign size={22} className="text-fiesta" /> Customer Refunds Tracker
          </h2>
          <small className="text-muted">Issue and monitor customer refunds with automatic ledger balancing.</small>
        </div>
        <button
          onClick={() => {
            setFormData({ order: '', user: '', amount: '', status: 'completed' });
            setIsAddOpen(true);
          }}
          className="btn btn-fiesta btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Plus size={16} /> Issue Refund
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-3 d-flex justify-content-between align-items-center">
          <div>
            <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.7rem' }}>Total Refund Volume</span>
            <h3 className="h4 fw-bold text-dark mt-1 mb-0">₹{totalRefundAmount.toLocaleString('en-IN')}</h3>
          </div>
          <div className="text-end">
            <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.7rem' }}>Refund Records</span>
            <h3 className="h4 fw-bold text-danger mt-1 mb-0">{refunds.length}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-muted small">Loading refunds...</div>
        ) : refunds.length === 0 ? (
          <div className="p-4 text-center text-muted small">No refunds recorded yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted">Refund ID</th>
                  <th className="text-uppercase text-muted">Order ID</th>
                  <th className="text-uppercase text-muted">Customer</th>
                  <th className="text-uppercase text-muted">Dish</th>
                  <th className="text-uppercase text-muted text-end">Refund Amount</th>
                  <th className="text-uppercase text-muted text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((ref) => (
                  <tr key={ref.refund_id}>
                    <td className="font-monospace text-muted small">#{ref.refund_id}</td>
                    <td className="font-monospace fw-bold text-fiesta small">Order #{ref.order}</td>
                    <td className="fw-bold text-dark text-capitalize">{ref.user_name}</td>
                    <td className="text-secondary text-capitalize">{ref.order_item || 'Food Item'}</td>
                    <td className="text-end fw-bold text-dark">₹{ref.amount}</td>
                    <td className="text-center">
                      <span className={`badge ${ref.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'} text-capitalize`} style={{ fontSize: '0.72rem' }}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Issue Customer Refund</h5>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-close"></button>
              </div>

              <form onSubmit={handleCreateRefund}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Select Order *</label>
                    <select
                      required
                      value={formData.order}
                      onChange={(e) => handleOrderSelect(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select an order</option>
                      {orders.map(o => (
                        <option key={o.order_id} value={o.order_id}>
                          Order #{o.order_id} - {o.item} (₹{o.total_price} - {o.user_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Refund Amount (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="form-select"
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-fiesta btn-sm fw-semibold">
                    Submit Refund
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

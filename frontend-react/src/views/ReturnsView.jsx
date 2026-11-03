import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus } from 'lucide-react';
import api from '../api';

export default function ReturnsView({ showToast }) {
  const [returns, setReturns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    order: '',
    user: '',
    item: '',
    amount: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [returnsData, ordersData] = await Promise.all([
        api.getReturns(),
        api.getOrders(),
      ]);
      setReturns(returnsData);
      setOrders(ordersData);
    } catch (err) {
      showToast('Error loading returns data', 'error');
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
        item: selected.item,
        amount: selected.total_price,
      });
    }
  };

  const handleCreateReturn = async (e) => {
    e.preventDefault();
    if (!formData.order || !formData.amount) {
      showToast('Please select an order and amount', 'warning');
      return;
    }

    try {
      await api.createReturn({
        order: Number(formData.order),
        user: Number(formData.user),
        item: formData.item,
        amount: Number(formData.amount),
      });
      showToast(`Return processed for Order #${formData.order}`, 'success');
      setIsAddOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to create return record', 'error');
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <RotateCcw size={22} className="text-fiesta" /> Order Returns Management
          </h2>
          <small className="text-muted">Log and audit customer return requests and refundable amounts.</small>
        </div>
        <button
          onClick={() => {
            setFormData({ order: '', user: '', item: '', amount: '' });
            setIsAddOpen(true);
          }}
          className="btn btn-fiesta btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Plus size={16} /> Initiate Return
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-muted small">Loading returns...</div>
        ) : returns.length === 0 ? (
          <div className="p-4 text-center text-muted small">No returned items recorded.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted">Return ID</th>
                  <th className="text-uppercase text-muted">Order ID</th>
                  <th className="text-uppercase text-muted">Customer</th>
                  <th className="text-uppercase text-muted">Returned Item</th>
                  <th className="text-uppercase text-muted text-end">Refundable Amount</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((ret) => (
                  <tr key={ret.return_id}>
                    <td className="font-monospace text-muted small">#{ret.return_id}</td>
                    <td className="font-monospace fw-bold text-fiesta small">Order #{ret.order}</td>
                    <td className="fw-bold text-dark text-capitalize">{ret.user_name}</td>
                    <td className="text-secondary text-capitalize">{ret.item}</td>
                    <td className="text-end fw-bold text-danger">₹{ret.amount}</td>
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
                <h5 className="modal-title fw-bold">Initiate Order Return</h5>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-close"></button>
              </div>

              <form onSubmit={handleCreateReturn}>
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
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Item Description</label>
                    <input
                      type="text"
                      value={formData.item}
                      onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                      placeholder="e.g. Chicken Biryani"
                      className="form-control"
                    />
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
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-fiesta btn-sm fw-semibold">
                    Confirm Return
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

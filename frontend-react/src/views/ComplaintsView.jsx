import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Plus, Trash2 } from 'lucide-react';
import api from '../api';

export default function ComplaintsView({ showToast }) {
  const [complaints, setComplaints] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    user: '',
    order: '',
    item: '',
    complaint: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [complaintsData, ordersData] = await Promise.all([
        api.getComplaints(search),
        api.getOrders(),
      ]);
      setComplaints(complaintsData);
      setOrders(ordersData);
    } catch (err) {
      showToast('Error loading complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOrderSelect = (orderId) => {
    const selected = orders.find(o => String(o.order_id) === String(orderId));
    if (selected) {
      setFormData({
        ...formData,
        order: selected.order_id,
        user: selected.user,
        item: selected.item,
      });
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!formData.order || !formData.complaint) {
      showToast('Please provide an order and complaint details', 'warning');
      return;
    }

    try {
      await api.createComplaint({
        user: Number(formData.user),
        order: Number(formData.order),
        item: formData.item,
        complaint: formData.complaint,
      });
      showToast('Complaint registered successfully!', 'success');
      setIsAddOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to register complaint', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete complaint #${id}?`)) return;
    try {
      await api.deleteComplaint(id);
      showToast(`Complaint #${id} deleted`, 'info');
      loadData();
    } catch (err) {
      showToast('Failed to delete complaint', 'error');
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <AlertCircle size={22} className="text-fiesta" /> Complaints Desk
          </h2>
          <small className="text-muted">Track quality issues, taste concerns, packaging defects, and delivery delays.</small>
        </div>
        <button
          onClick={() => {
            setFormData({ user: '', order: '', item: '', complaint: '' });
            setIsAddOpen(true);
          }}
          className="btn btn-fiesta btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Plus size={16} /> Log Complaint
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <Search size={18} className="text-muted ms-2" />
          <input
            type="text"
            placeholder="Search complaints by dish, customer name, or issue description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control border-0 shadow-none small"
          />
          {search && (
            <button onClick={() => setSearch('')} className="btn btn-sm btn-link text-muted me-1">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-muted small">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="p-4 text-center text-muted small">No complaints reported.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted">Complaint ID</th>
                  <th className="text-uppercase text-muted">Order ID</th>
                  <th className="text-uppercase text-muted">Customer</th>
                  <th className="text-uppercase text-muted">Menu Item</th>
                  <th className="text-uppercase text-muted">Complaint Details</th>
                  <th className="text-uppercase text-muted text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaint_id}>
                    <td className="font-monospace text-muted small">#{c.complaint_id}</td>
                    <td className="font-monospace fw-bold text-fiesta small">Order #{c.order}</td>
                    <td className="fw-bold text-dark text-capitalize">{c.user_name}</td>
                    <td className="text-secondary text-capitalize">{c.item}</td>
                    <td className="text-danger small fst-italic">{c.complaint}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(c.complaint_id)}
                        className="btn btn-outline-danger btn-sm p-1"
                        title="Delete Complaint"
                      >
                        <Trash2 size={13} />
                      </button>
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
                <h5 className="modal-title fw-bold">Register Customer Complaint</h5>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-close"></button>
              </div>

              <form onSubmit={handleCreateComplaint}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Select Order *</label>
                    <select
                      required
                      value={formData.order}
                      onChange={(e) => handleOrderSelect(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select affected order</option>
                      {orders.map(o => (
                        <option key={o.order_id} value={o.order_id}>
                          Order #{o.order_id} - {o.item} ({o.user_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Dish Name</label>
                    <input
                      type="text"
                      value={formData.item}
                      onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                      placeholder="e.g. Biryani, Drink"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Complaint Details *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.complaint}
                      onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                      placeholder="Describe the complaint..."
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-fiesta btn-sm fw-semibold">
                    Save Complaint
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

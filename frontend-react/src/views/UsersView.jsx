import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Eye, X, Phone, Mail, MapPin } from 'lucide-react';
import api from '../api';

export default function UsersView({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    f_name: '',
    address: '',
    mobile_no: '',
    email: '',
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers(search);
      setUsers(data);
    } catch (err) {
      showToast('Failed to load users from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setFormData({ f_name: '', address: '', mobile_no: '', email: '' });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      f_name: user.f_name || '',
      address: user.address || '',
      mobile_no: user.mobile_no || '',
      email: user.email || '',
    });
  };

  const handleViewOrders = async (user) => {
    setSelectedUserOrders({ user, list: [] });
    setOrdersLoading(true);
    try {
      const orders = await api.getUserOrders(user.userid);
      setSelectedUserOrders({ user, list: orders });
    } catch (err) {
      showToast('Could not load user order history', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.f_name || !formData.mobile_no) {
      showToast('Name and mobile number are required', 'warning');
      return;
    }

    try {
      if (editingUser) {
        await api.updateUser(editingUser.userid, formData);
        showToast(`User '${formData.f_name}' updated successfully!`, 'success');
        setEditingUser(null);
      } else {
        await api.createUser(formData);
        showToast(`User '${formData.f_name}' added successfully!`, 'success');
        setIsAddOpen(false);
      }
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.email?.[0] || 'Error saving customer';
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete customer '${user.f_name}'?`)) return;
    try {
      await api.deleteUser(user.userid);
      showToast(`User '${user.f_name}' removed.`, 'info');
      loadUsers();
    } catch (err) {
      showToast('Cannot delete user with associated orders/records.', 'error');
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {/* Header & Controls */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Users size={22} className="text-fiesta" /> Customer Management
          </h2>
          <small className="text-muted">Register, edit, search, and inspect customer order history.</small>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-fiesta btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Plus size={16} /> Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-2 d-flex align-items-center gap-2">
          <Search size={18} className="text-muted ms-2" />
          <input
            type="text"
            placeholder="Search customers by name, phone, address, or email..."
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

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-muted small">Loading customers...</div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-muted small">No customers found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted">ID</th>
                  <th className="text-uppercase text-muted">Customer Name</th>
                  <th className="text-uppercase text-muted">Mobile</th>
                  <th className="text-uppercase text-muted">Email</th>
                  <th className="text-uppercase text-muted">City / Address</th>
                  <th className="text-uppercase text-muted text-center">Orders</th>
                  <th className="text-uppercase text-muted text-end">Total Spent</th>
                  <th className="text-uppercase text-muted text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userid}>
                    <td className="font-monospace text-muted small">#{user.userid}</td>
                    <td className="fw-bold text-dark text-capitalize">{user.f_name}</td>
                    <td>
                      <small className="font-monospace text-secondary d-flex align-items-center gap-1">
                        <Phone size={12} className="text-muted" /> {user.mobile_no}
                      </small>
                    </td>
                    <td>
                      <small className="text-secondary d-flex align-items-center gap-1">
                        <Mail size={12} className="text-muted" /> {user.email || '—'}
                      </small>
                    </td>
                    <td className="text-capitalize small">
                      <span className="d-flex align-items-center gap-1 text-secondary">
                        <MapPin size={12} className="text-muted" /> {user.address || '—'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-warning bg-opacity-25 text-dark fw-bold rounded-pill px-2.5 py-1">
                        {user.orders_count || 0}
                      </span>
                    </td>
                    <td className="text-end fw-bold text-dark">
                      ₹{Number(user.total_spent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          onClick={() => handleViewOrders(user)}
                          className="btn btn-outline-primary"
                          title="View Orders"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="btn btn-outline-warning"
                          title="Edit Customer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="btn btn-outline-danger"
                          title="Delete Customer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {(isAddOpen || editingUser) && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingUser ? `Edit Customer #${editingUser.userid}` : 'Register New Customer'}
                </h5>
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingUser(null); }}
                  className="btn-close"
                ></button>
              </div>

              <form onSubmit={handleSaveUser}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.f_name}
                      onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                      placeholder="e.g. Kavya Kanchi"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Mobile Number *</label>
                    <input
                      type="number"
                      required
                      value={formData.mobile_no}
                      onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. kavya@example.com"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">City / Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Hyderabad"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => { setIsAddOpen(false); setEditingUser(null); }}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-fiesta btn-sm fw-semibold">
                    {editingUser ? 'Save Changes' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Customer Orders History Modal */}
      {selectedUserOrders && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title fw-bold text-capitalize mb-0">
                    {selectedUserOrders.user.f_name}'s Order History
                  </h5>
                  <small className="text-muted">
                    {selectedUserOrders.user.email || selectedUserOrders.user.mobile_no}
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUserOrders(null)}
                  className="btn-close"
                ></button>
              </div>

              <div className="modal-body p-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {ordersLoading ? (
                  <div className="p-4 text-center text-muted small">Loading customer orders...</div>
                ) : selectedUserOrders.list.length === 0 ? (
                  <div className="p-4 text-center text-muted small">This customer has not placed any orders yet.</div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {selectedUserOrders.list.map((ord) => (
                      <div
                        key={ord.order_id}
                        className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-bold text-dark text-capitalize">
                            {ord.item} × {ord.quantity}
                          </div>
                          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                            Unit: ₹{ord.price} | Disc: ₹{ord.discount} | Status: <span className="fw-semibold text-dark text-capitalize">{ord.current_status}</span>
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-dark">₹{ord.total_price}</div>
                          <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>Order #{ord.order_id}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

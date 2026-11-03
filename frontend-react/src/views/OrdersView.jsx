import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Plus, Filter, Trash2 } from 'lucide-react';
import api from '../api';

const MENU_ITEMS = [
  { name: 'chicken biryani', price: 200, discount: 25 },
  { name: 'egg biryani', price: 180, discount: 15 },
  { name: 'paneer biryani', price: 220, discount: 20 },
  { name: 'veg biryani', price: 150, discount: 15 },
  { name: 'mushroom biryani', price: 190, discount: 20 },
  { name: 'pani puri', price: 60, discount: 5 },
  { name: 'badam milk', price: 350, discount: 50 },
  { name: 'dry fruits', price: 570, discount: 70 },
  { name: 'veg meals', price: 450, discount: 50 },
  { name: 'fruit salad', price: 530, discount: 80 },
];

export default function OrdersView({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // New Order Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    item: 'chicken biryani',
    quantity: 1,
    price: 200,
    discount: 25,
    total_price: 175,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, usersData] = await Promise.all([
        api.getOrders({ search }),
        api.getUsers(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
      if (usersData.length > 0 && !formData.user) {
        setFormData(prev => ({ ...prev, user: usersData[0].userid }));
      }
    } catch (err) {
      showToast('Error loading orders from database', 'error');
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

  const handleItemSelect = (itemName) => {
    const preset = MENU_ITEMS.find(m => m.name.toLowerCase() === itemName.toLowerCase());
    const qty = formData.quantity || 1;
    const price = preset ? preset.price : formData.price;
    const discount = preset ? preset.discount : formData.discount;
    const total = Math.max(0, (qty * price) - discount);

    setFormData({
      ...formData,
      item: itemName,
      price: price,
      discount: discount,
      total_price: total,
    });
  };

  const handleQtyPriceChange = (field, val) => {
    const updated = { ...formData, [field]: Number(val) };
    const q = field === 'quantity' ? Number(val) : formData.quantity;
    const p = field === 'price' ? Number(val) : formData.price;
    const d = field === 'discount' ? Number(val) : formData.discount;
    updated.total_price = Math.max(0, (q * p) - d);
    setFormData(updated);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.user || !formData.item || !formData.quantity || !formData.price) {
      showToast('Please fill all required order details', 'warning');
      return;
    }

    try {
      await api.createOrder({
        user: Number(formData.user),
        item: formData.item,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        discount: Number(formData.discount),
        total_price: Number(formData.total_price),
      });
      showToast(`Order for ${formData.item} placed successfully!`, 'success');
      setIsAddOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to place order in database', 'error');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm(`Delete Order #${orderId}?`)) return;
    try {
      await api.deleteOrder(orderId);
      showToast(`Order #${orderId} deleted.`, 'info');
      loadData();
    } catch (err) {
      showToast('Cannot delete order linked to payments or returns.', 'error');
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(o => o.current_status?.toLowerCase() === statusFilter.toLowerCase())
    : orders;

  return (
    <div className="d-flex flex-column gap-3">
      {/* Header & Controls */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <ShoppingBag size={22} className="text-fiesta" /> Orders Management
          </h2>
          <small className="text-muted">Kitchen queue, price/discount adjustments, and order delivery status.</small>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn btn-fiesta btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Plus size={16} /> Place New Order
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="row g-2">
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-2 d-flex align-items-center gap-2">
              <Search size={18} className="text-muted ms-2" />
              <input
                type="text"
                placeholder="Search orders by dish name or customer..."
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
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-2 d-flex align-items-center gap-2">
              <Filter size={16} className="text-muted ms-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select border-0 shadow-none small fw-semibold"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-muted small">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-4 text-center text-muted small">No orders found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted">Order ID</th>
                  <th className="text-uppercase text-muted">Customer</th>
                  <th className="text-uppercase text-muted">Menu Item</th>
                  <th className="text-uppercase text-muted text-center">Qty</th>
                  <th className="text-uppercase text-muted text-end">Price</th>
                  <th className="text-uppercase text-muted text-end">Discount</th>
                  <th className="text-uppercase text-muted text-end">Total Price</th>
                  <th className="text-uppercase text-muted text-center">Status</th>
                  <th className="text-uppercase text-muted text-center">Payment</th>
                  <th className="text-uppercase text-muted text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <tr key={ord.order_id}>
                    <td className="font-monospace text-muted small">#{ord.order_id}</td>
                    <td>
                      <div className="fw-bold text-dark text-capitalize">{ord.user_name}</div>
                      <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>ID: #{ord.user}</small>
                    </td>
                    <td className="fw-semibold text-dark text-capitalize">{ord.item}</td>
                    <td className="text-center fw-bold text-secondary">{ord.quantity}</td>
                    <td className="text-end text-muted">₹{ord.price}</td>
                    <td className="text-end text-success fw-medium">-₹{ord.discount}</td>
                    <td className="text-end fw-bold text-dark">₹{ord.total_price}</td>
                    <td className="text-center">
                      <select
                        value={ord.current_status || 'pending'}
                        onChange={(e) => handleStatusChange(ord.order_id, e.target.value)}
                        className={`form-select form-select-sm text-capitalize fw-bold d-inline-block w-auto ${
                          ord.current_status === 'completed' ? 'border-success text-success' :
                          ord.current_status === 'returned' ? 'border-danger text-danger' : 'border-warning text-dark'
                        }`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        ord.payment_status === 'completed' ? 'bg-success' :
                        ord.payment_status === 'refunded' ? 'bg-purple text-white' :
                        ord.payment_status === 'returned' ? 'bg-danger' : 'bg-secondary'
                      } text-capitalize`} style={{ fontSize: '0.7rem' }}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(ord.order_id)}
                        className="btn btn-outline-danger btn-sm p-1"
                        title="Delete Order"
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

      {/* Create Order Modal */}
      {isAddOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Place New Restaurant Order</h5>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-close"></button>
              </div>

              <form onSubmit={handleCreateOrder}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Select Customer *</label>
                    <select
                      required
                      value={formData.user}
                      onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select a customer</option>
                      {users.map(u => (
                        <option key={u.userid} value={u.userid}>
                          {u.f_name} (ID: #{u.userid} - {u.mobile_no})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Select Food Item *</label>
                    <select
                      value={formData.item}
                      onChange={(e) => handleItemSelect(e.target.value)}
                      className="form-select text-capitalize"
                    >
                      {MENU_ITEMS.map((item, i) => (
                        <option key={i} value={item.name}>
                          {item.name} — Base ₹{item.price} (Disc: ₹{item.discount})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-4">
                      <label className="form-label small fw-bold text-muted text-uppercase mb-1">Qty *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) => handleQtyPriceChange('quantity', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-bold text-muted text-uppercase mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => handleQtyPriceChange('price', e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-bold text-muted text-uppercase mb-1">Discount (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discount}
                        onChange={(e) => handleQtyPriceChange('discount', e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-light p-3 rounded-3 border">
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Subtotal ({formData.quantity} × ₹{formData.price}):</span>
                      <span>₹{formData.quantity * formData.price}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-success mt-1">
                      <span>Discount Applied:</span>
                      <span>-₹{formData.discount}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                      <span>Grand Total:</span>
                      <span className="text-fiesta">₹{formData.total_price}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-fiesta btn-sm fw-semibold">
                    Place Order
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

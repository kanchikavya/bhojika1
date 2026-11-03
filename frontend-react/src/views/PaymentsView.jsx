import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import api from '../api';

export default function PaymentsView({ showToast }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await api.getPayments(filterStatus);
      setPayments(data);
    } catch (err) {
      showToast('Error loading payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [filterStatus]);

  const handleUpdateStatus = async (paymentId, newStatus) => {
    try {
      await api.markPaymentStatus(paymentId, newStatus);
      showToast(`Payment #${paymentId} updated to ${newStatus}`, 'success');
      loadPayments();
    } catch (err) {
      showToast('Failed to update payment status', 'error');
    }
  };

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const completedTotal = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingTotal = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <CreditCard size={22} className="text-fiesta" /> Payment & Billing
        </h2>
        <small className="text-muted">Reconcile transaction collections, pending balances, and returns/refunds.</small>
      </div>

      {/* Summary Cards */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card card-stat border-0 shadow-sm rounded-3">
            <div className="card-body p-3">
              <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.7rem' }}>Total Settled</span>
              <h3 className="h4 fw-bold text-success mt-1 mb-0">₹{completedTotal.toLocaleString('en-IN')}</h3>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Successfully collected payments</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card card-stat border-0 shadow-sm rounded-3">
            <div className="card-body p-3">
              <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.7rem' }}>Pending Payments</span>
              <h3 className="h4 fw-bold text-warning mt-1 mb-0">₹{pendingTotal.toLocaleString('en-IN')}</h3>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Awaiting clearance</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card card-stat border-0 shadow-sm rounded-3">
            <div className="card-body p-3">
              <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.7rem' }}>Total Transactions</span>
              <h3 className="h4 fw-bold text-dark mt-1 mb-0">{payments.length}</h3>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Total volume ₹{totalAmount.toLocaleString('en-IN')}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex flex-wrap gap-2">
        {['', 'completed', 'pending', 'returned', 'refunded'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm text-uppercase fw-bold rounded-3 ${
              filterStatus === st ? 'btn-fiesta' : 'btn-outline-secondary'
            }`}
            style={{ fontSize: '0.75rem' }}
          >
            {st ? st : 'All Transactions'}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {loading ? (
          <div className="p-4 text-center text-muted small">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="p-4 text-center text-muted small">No payment records found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase text-muted">Payment ID</th>
                  <th className="text-uppercase text-muted">Order Details</th>
                  <th className="text-uppercase text-muted">Customer</th>
                  <th className="text-uppercase text-muted text-end">Amount</th>
                  <th className="text-uppercase text-muted text-center">Status</th>
                  <th className="text-uppercase text-muted text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pmt) => (
                  <tr key={pmt.payment_id}>
                    <td className="font-monospace text-muted small">#{pmt.payment_id}</td>
                    <td>
                      <div className="fw-bold text-dark text-capitalize">{pmt.order_item || 'Restaurant Order'}</div>
                      <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>Order #{pmt.order}</small>
                    </td>
                    <td className="fw-semibold text-secondary text-capitalize">{pmt.user_name}</td>
                    <td className="text-end fw-bold text-dark">₹{pmt.amount}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        pmt.status === 'completed' ? 'bg-success' :
                        pmt.status === 'pending' ? 'bg-warning text-dark' :
                        pmt.status === 'returned' ? 'bg-danger' : 'bg-info text-dark'
                      } text-capitalize`} style={{ fontSize: '0.72rem' }}>
                        {pmt.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {pmt.status === 'pending' ? (
                        <button
                          onClick={() => handleUpdateStatus(pmt.payment_id, 'completed')}
                          className="btn btn-success btn-sm py-1 px-2 fw-semibold"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Mark Paid
                        </button>
                      ) : pmt.status === 'completed' ? (
                        <button
                          onClick={() => handleUpdateStatus(pmt.payment_id, 'refunded')}
                          className="btn btn-outline-danger btn-sm py-1 px-2 fw-semibold"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Mark Refunded
                        </button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { BarChart3, Award, TrendingUp, Download } from 'lucide-react';
import api from '../api';

export default function AnalyticsView({ showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics();
      setData(res);
    } catch (err) {
      showToast('Error loading analytics reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!data || !data.ranked_customers) return;
    const headers = ['Rank,User ID,Name,Email,Mobile,Orders Count,Total Spent\n'];
    const rows = data.ranked_customers.map(c =>
      `${c.rank},${c.user_id},"${c.name}","${c.email || ''}",${c.mobile},${c.orders_count},${c.total_spent}`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food_fiesta_customer_rankings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Customer analytics CSV downloaded!', 'success');
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <BarChart3 size={22} className="text-fiesta" /> Advanced Business Analytics
          </h2>
          <small className="text-muted">Window Functions, customer spend rankings, and purchase insights.</small>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn btn-dark btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Download size={15} /> Export Report CSV
        </button>
      </div>

      {loading ? (
        <div className="p-5 text-center text-muted small">Computing customer rankings...</div>
      ) : data ? (
        <div className="d-flex flex-column gap-3">
          {/* Customer Spending Rankings Table */}
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Award size={18} className="text-warning" />
                <span className="fw-bold text-dark fs-6">Customer Rankings (DENSE_RANK() by Spend)</span>
              </div>
              <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>
                SQL: DENSE_RANK() OVER(ORDER BY total_spent DESC)
              </small>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-uppercase text-muted text-center" style={{ width: '70px' }}>Rank</th>
                    <th className="text-uppercase text-muted">Customer Name</th>
                    <th className="text-uppercase text-muted">Contact Info</th>
                    <th className="text-uppercase text-muted text-center">Orders</th>
                    <th className="text-uppercase text-muted text-end">Total Spent</th>
                    <th className="text-uppercase text-muted text-center">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ranked_customers.map((c) => {
                    return (
                      <tr key={c.user_id}>
                        <td className="text-center">
                          <span className={`badge rounded-circle p-2 fw-bold ${
                            c.rank === 1 ? 'bg-warning text-dark' :
                            c.rank === 2 ? 'bg-secondary text-white' :
                            c.rank === 3 ? 'bg-danger text-white' : 'bg-light text-dark border'
                          }`}>
                            #{c.rank}
                          </span>
                        </td>
                        <td className="fw-bold text-dark text-capitalize">{c.name}</td>
                        <td>
                          <small className="text-muted font-monospace">{c.email || c.mobile}</small>
                        </td>
                        <td className="text-center fw-semibold text-secondary">{c.orders_count}</td>
                        <td className="text-end fw-bold text-dark">
                          ₹{Number(c.total_spent).toLocaleString('en-IN')}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${
                            c.total_spent >= 400 ? 'bg-primary' :
                            c.total_spent >= 200 ? 'bg-info text-dark' : 'bg-light text-dark border'
                          } text-uppercase`} style={{ fontSize: '0.65rem' }}>
                            {c.total_spent >= 400 ? 'Platinum' : c.total_spent >= 200 ? 'Gold' : 'Silver'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* High Value Purchases */}
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <TrendingUp size={18} className="text-success" />
              <span className="fw-bold text-dark fs-6">High-Value Order Analysis</span>
            </div>
            <div className="card-body p-3">
              <div className="row g-3">
                {data.high_value_orders.map((ord, idx) => (
                  <div key={idx} className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-uppercase text-fiesta fw-bold small">Order #{ord.order_id}</span>
                        <span className="fw-bold text-dark">₹{ord.total_price}</span>
                      </div>
                      <div className="fw-bold text-dark text-capitalize small">{ord.item} × {ord.quantity}</div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Customer: <span className="text-capitalize">{ord.user_name}</span></small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

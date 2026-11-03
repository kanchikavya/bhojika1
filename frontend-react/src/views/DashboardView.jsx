import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  RotateCcw,
  Star,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function DashboardView({ stats, setActiveTab }) {
  if (!stats || !stats.overview) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <div className="spinner-border text-danger mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small">Loading dashboard metrics from database...</p>
        </div>
      </div>
    );
  }

  const { overview, payment_status_breakdown, order_status_breakdown, top_items, recent_orders, recent_complaints } = stats;

  const kpis = [
    {
      label: 'Total Revenue',
      value: `₹${Number(overview.total_revenue || 0).toLocaleString('en-IN')}`,
      subtext: `Avg ₹${overview.average_order_value} / order`,
      icon: DollarSign,
      bg: 'bg-success',
    },
    {
      label: 'Total Orders',
      value: overview.total_orders,
      subtext: `High ₹${overview.highest_order_value} | Low ₹${overview.lowest_order_value}`,
      icon: ShoppingBag,
      bg: 'bg-fiesta',
    },
    {
      label: 'Registered Customers',
      value: overview.total_users,
      subtext: 'Active dining profiles',
      icon: Users,
      bg: 'bg-primary',
    },
    {
      label: 'Returns & Refunds',
      value: `${overview.total_returns} / ${overview.total_refunds}`,
      subtext: 'Returns vs Refunds',
      icon: RotateCcw,
      bg: 'bg-danger',
    },
    {
      label: 'Customer Rating',
      value: `${overview.average_rating} / 5.0`,
      subtext: `From ${overview.total_feedback} customer reviews`,
      icon: Star,
      bg: 'bg-warning',
    },
    {
      label: 'Total Payments',
      value: overview.total_payments,
      subtext: 'Transactions audited',
      icon: CreditCard,
      bg: 'bg-info',
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Banner */}
      <div className="card border-0 bg-fiesta text-white shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="h4 fw-bold mb-1">Food Fiesta Operations Dashboard</h2>
            <p className="mb-0 text-white-50 small">
              Live restaurant operations and kitchen management dashboard.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className="btn btn-light text-danger fw-bold btn-sm px-3 py-2 rounded-3 shadow-sm d-flex align-items-center gap-1"
            >
              <ShoppingBag size={15} /> Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="btn btn-dark btn-sm px-3 py-2 rounded-3 fw-bold d-flex align-items-center gap-1"
            >
              <Users size={15} /> Customers
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="col-12 col-sm-6 col-lg-4">
              <div className="card card-stat border-0 shadow-sm h-100 rounded-3">
                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-uppercase text-muted fw-bold d-block" style={{ fontSize: '0.7rem' }}>
                      {kpi.label}
                    </span>
                    <h3 className="h4 fw-bold text-dark mt-1 mb-0">{kpi.value}</h3>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{kpi.subtext}</small>
                  </div>
                  <div className={`${kpi.bg} text-white p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status & Best Selling Menu Items */}
      <div className="row g-3">
        {/* Order Status Distribution */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold text-dark fs-6 mb-0 d-flex align-items-center gap-2">
                  <TrendingUp size={16} className="text-fiesta" /> Order Status Distribution
                </h5>
                <button onClick={() => setActiveTab('status')} className="btn btn-link p-0 text-fiesta fw-semibold small text-decoration-none">
                  View All
                </button>
              </div>

              <div className="d-flex flex-column gap-3">
                {order_status_breakdown && order_status_breakdown.map((item, i) => {
                  const count = item.count;
                  const total = overview.total_orders || 1;
                  const pct = Math.round((count / total) * 100);
                  const colorMap = {
                    completed: 'bg-success',
                    pending: 'bg-warning',
                    returned: 'bg-danger',
                  };
                  const color = colorMap[item.status?.toLowerCase()] || 'bg-primary';

                  return (
                    <div key={i}>
                      <div className="d-flex justify-content-between small fw-semibold text-secondary mb-1 text-capitalize">
                        <span>{item.status || 'Unknown'}</span>
                        <span>{count} orders ({pct}%)</span>
                      </div>
                      <div className="progress" style={{ height: '7px' }}>
                        <div
                          className={`progress-bar ${color}`}
                          role="progressbar"
                          style={{ width: `${pct}%` }}
                          aria-valuenow={pct}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="my-4 text-muted" />

              <h6 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: '0.7rem' }}>
                Payment Status Summary
              </h6>
              <div className="row g-2">
                {payment_status_breakdown && payment_status_breakdown.map((pmt, idx) => (
                  <div key={idx} className="col-6">
                    <div className="bg-light p-2 rounded-3 border">
                      <div className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.65rem' }}>{pmt.status}</div>
                      <div className="fw-bold text-dark fs-6">{pmt.count} txns</div>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>₹{Number(pmt.total || 0).toLocaleString('en-IN')}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Best Selling Dishes */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold text-dark fs-6 mb-0 d-flex align-items-center gap-2">
                  <ShoppingBag size={16} className="text-fiesta" /> Best-Selling Menu Items
                </h5>
                <button onClick={() => setActiveTab('orders')} className="btn btn-link p-0 text-fiesta fw-semibold small text-decoration-none">
                  All Orders
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-uppercase text-muted">Item Name</th>
                      <th className="text-uppercase text-muted">Orders</th>
                      <th className="text-uppercase text-muted">Qty Sold</th>
                      <th className="text-uppercase text-muted text-end">Sales Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top_items && top_items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold text-capitalize text-dark">
                          <span className="badge bg-danger rounded-circle p-1 me-2"> </span>
                          {item.item}
                        </td>
                        <td className="text-secondary">{item.orders_count}</td>
                        <td className="text-secondary">{item.total_quantity}</td>
                        <td className="text-end fw-bold text-dark">
                          ₹{Number(item.total_sales || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Complaints */}
      <div className="row g-3">
        {/* Recent Orders */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold text-dark fs-6 mb-0 d-flex align-items-center gap-2">
                  <Clock size={16} className="text-primary" /> Latest Orders
                </h5>
                <button onClick={() => setActiveTab('orders')} className="btn btn-link p-0 text-fiesta fw-semibold small text-decoration-none">
                  View Orders
                </button>
              </div>

              <div className="d-flex flex-column gap-2">
                {recent_orders && recent_orders.map((ord) => (
                  <div key={ord.order_id} className="p-2.5 bg-light rounded-3 d-flex justify-content-between align-items-center border">
                    <div>
                      <div className="fw-bold text-dark small text-capitalize">
                        {ord.item} <span className="text-muted fw-normal">× {ord.quantity}</span>
                      </div>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        Customer: <span className="text-capitalize fw-medium">{ord.user_name}</span> • Order #{ord.order_id}
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-dark small">₹{ord.total_price}</div>
                      <span className={`badge ${
                        ord.current_status === 'completed' ? 'bg-success' :
                        ord.current_status === 'returned' ? 'bg-danger' : 'bg-warning text-dark'
                      } text-capitalize`} style={{ fontSize: '0.65rem' }}>
                        {ord.current_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold text-dark fs-6 mb-0 d-flex align-items-center gap-2">
                  <AlertCircle size={16} className="text-danger" /> Complaints & Issues
                </h5>
                <button onClick={() => setActiveTab('complaints')} className="btn btn-link p-0 text-fiesta fw-semibold small text-decoration-none">
                  View Complaints
                </button>
              </div>

              <div className="d-flex flex-column gap-2">
                {recent_complaints && recent_complaints.map((c) => (
                  <div key={c.complaint_id} className="p-2.5 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-danger text-capitalize small">
                        {c.item} (Order #{c.order})
                      </span>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>By {c.user_name}</small>
                    </div>
                    <p className="mb-0 text-secondary fst-italic small mt-1" style={{ fontSize: '0.75rem' }}>
                      "{c.complaint}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

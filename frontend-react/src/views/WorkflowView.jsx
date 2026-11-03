import React, { useState } from 'react';
import { Workflow, UserCheck, ShoppingBag, CreditCard, ChefHat, RotateCcw, MessageSquare, Database } from 'lucide-react';

export default function WorkflowView() {
  const [activeStage, setActiveStage] = useState('order');

  const stages = [
    {
      id: 'user',
      title: '1. Customer Onboarding',
      icon: UserCheck,
      color: 'bg-primary',
      table: 'user1',
      proc: 'insert_user(...)',
      desc: 'Diners are registered with unique contact info and addresses.',
      fields: ['userid', 'f_name', 'address', 'mobile_no', 'email'],
    },
    {
      id: 'order',
      title: '2. Order & Kitchen Queue',
      icon: ShoppingBag,
      color: 'bg-fiesta',
      table: 'orders1',
      proc: 'insert_order(...)',
      desc: 'Items are ordered with calculated discounts, triggering pending status & audit logs.',
      fields: ['order_id', 'user_id', 'item', 'quantity', 'price', 'discount', 'total_price'],
      trigger: 'trg_order_log & trg_order_status automatically fire',
    },
    {
      id: 'payment',
      title: '3. Payment Settlement',
      icon: CreditCard,
      color: 'bg-success',
      table: 'payments1',
      proc: 'insert_payment(...)',
      desc: 'Transactions recorded and linked directly to customer order ledger.',
      fields: ['payment_id', 'user_id', 'order_id', 'amount', 'status'],
    },
    {
      id: 'status',
      title: '4. Preparation & Delivery',
      icon: ChefHat,
      color: 'bg-warning',
      table: 'status1',
      proc: 'insert_status(...)',
      desc: 'Live tracking transitions through Pending -> Preparing -> Completed / Delivered.',
      fields: ['status_id', 'order_id', 'status', 'updated_at'],
    },
    {
      id: 'return_refund',
      title: '5. Return & Refund Pipeline',
      icon: RotateCcw,
      color: 'bg-danger',
      table: 'returns1 & refund1',
      proc: 'insert_return1(...) & insert_refund(...)',
      desc: 'Returned items update order status, and refund triggers payment status to "refunded".',
      fields: ['return_id', 'refund_id', 'order_id', 'amount', 'status'],
      trigger: 'trg_return_status & trg_refund_payment automatically fire',
    },
    {
      id: 'feedback',
      title: '6. Feedback Loop',
      icon: MessageSquare,
      color: 'bg-info',
      table: 'feedback1 & complaint1',
      proc: 'insert_feedback(...) & insert_complaint(...)',
      desc: 'Customers rate dining experience (1-5 stars) and report quality complaints.',
      fields: ['feedback_id', 'complaint_id', 'rating', 'feedback', 'complaint'],
    },
  ];

  const current = stages.find(s => s.id === activeStage) || stages[1];

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <Workflow size={22} className="text-fiesta" /> Restaurant Workflow
        </h2>
        <small className="text-muted">Interactive schema diagram showing stored procedures, triggers, and state transitions.</small>
      </div>

      {/* Pipeline Navigation */}
      <div className="row g-2">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = activeStage === stage.id;
          return (
            <div key={stage.id} className="col-6 col-md-4 col-lg-2">
              <button
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`card text-start w-100 p-2.5 rounded-3 border transition ${
                  isSelected ? 'border-danger shadow-sm bg-white' : 'bg-light border-0'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className={`${stage.color} text-white p-2 rounded-2 d-inline-flex align-items-center justify-content-center mb-1.5 shadow-sm`} style={{ width: '32px', height: '32px' }}>
                  <Icon size={16} />
                </div>
                <div className="fw-bold small text-dark text-truncate">{stage.title}</div>
                <small className="font-monospace text-muted" style={{ fontSize: '0.65rem' }}>{stage.table}</small>
              </button>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className={`${current.color} text-white p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center`}>
              {React.createElement(current.icon, { size: 24 })}
            </div>
            <div>
              <h3 className="h5 fw-bold text-dark mb-0">{current.title}</h3>
              <small className="text-muted">{current.desc}</small>
            </div>
          </div>

          <hr className="my-3 text-muted" />

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <span className="text-uppercase text-muted fw-bold d-flex align-items-center gap-1.5 mb-2" style={{ fontSize: '0.7rem' }}>
                <Database size={14} className="text-fiesta" /> Database Table Schema
              </span>
              <div className="bg-light p-3 rounded-3 border font-monospace small">
                <div className="fw-bold text-danger mb-2">TABLE: {current.table}</div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {current.fields.map(f => (
                    <li key={f} className="text-secondary d-flex align-items-center gap-2">
                      <span className="badge bg-secondary rounded-circle p-1"> </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <span className="text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: '0.7rem' }}>
                Stored Procedure & Triggers
              </span>
              <div className="bg-light p-3 rounded-3 border d-flex flex-column gap-2">
                <div>
                  <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.65rem' }}>Procedure:</small>
                  <span className="font-monospace fw-bold text-dark small">{current.proc}</span>
                </div>
                {current.trigger && (
                  <div>
                    <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '0.65rem' }}>MySQL Triggers:</small>
                    <span className="small text-danger fw-semibold">{current.trigger}</span>
                  </div>
                )}
                <small className="text-muted border-top pt-2 mt-1">
                  Managed and synchronized through the backend REST API.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

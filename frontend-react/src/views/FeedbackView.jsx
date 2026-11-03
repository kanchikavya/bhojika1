import React, { useState, useEffect } from 'react';
import { Star, Plus } from 'lucide-react';
import api from '../api';

export default function FeedbackView({ showToast }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    user: '',
    feedback: '',
    rating: 5,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [fbList, summaryData, usersData] = await Promise.all([
        api.getFeedbacks(),
        api.getFeedbackSummary(),
        api.getUsers(),
      ]);
      setFeedbacks(fbList);
      setSummary(summaryData);
      setUsers(usersData);
      if (usersData.length > 0 && !formData.user) {
        setFormData(prev => ({ ...prev, user: usersData[0].userid }));
      }
    } catch (err) {
      showToast('Error loading customer feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateFeedback = async (e) => {
    e.preventDefault();
    if (!formData.user || !formData.feedback) {
      showToast('Please select customer and write a review', 'warning');
      return;
    }

    try {
      await api.createFeedback({
        user: Number(formData.user),
        feedback: formData.feedback,
        rating: Number(formData.rating),
      });
      showToast('Thank you! Feedback saved successfully.', 'success');
      setIsAddOpen(false);
      setFormData({ user: users[0]?.userid || '', feedback: '', rating: 5 });
      loadData();
    } catch (err) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <h2 className="h4 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <Star size={22} className="text-warning" fill="#ffc107" /> Customer Feedback & Reviews
          </h2>
          <small className="text-muted">Review diner satisfaction scores, feedback comments, and star ratings.</small>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn btn-fiesta btn-sm d-flex align-items-center gap-1.5 fw-semibold px-3 py-2 rounded-3 shadow-sm"
        >
          <Plus size={16} /> Add Feedback
        </button>
      </div>

      {/* Ratings Overview Card */}
      {summary && (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-body p-4">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-md-4 text-center text-md-start border-md-end">
                <div className="display-5 fw-bold text-dark">{summary.average_rating}</div>
                <div className="d-flex justify-content-center justify-content-md-start gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      className={s <= Math.round(summary.average_rating) ? 'text-warning' : 'text-muted'}
                      fill={s <= Math.round(summary.average_rating) ? '#ffc107' : 'none'}
                    />
                  ))}
                </div>
                <small className="text-muted">Based on {summary.total_feedbacks} verified diner reviews</small>
              </div>

              <div className="col-12 col-md-8">
                <div className="d-flex flex-column gap-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = summary.rating_distribution?.[star] || 0;
                    const pct = summary.total_feedbacks ? Math.round((count / summary.total_feedbacks) * 100) : 0;
                    return (
                      <div key={star} className="d-flex align-items-center gap-2 small">
                        <span className="fw-bold text-muted d-flex align-items-center gap-1" style={{ width: '45px' }}>
                          {star} <Star size={12} className="text-warning" fill="#ffc107" />
                        </span>
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="font-monospace text-muted" style={{ width: '30px', textAlign: 'right' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Cards */}
      <div className="row g-3">
        {loading ? (
          <div className="col-12 p-4 text-center text-muted small">Loading reviews...</div>
        ) : feedbacks.length === 0 ? (
          <div className="col-12 p-4 text-center text-muted small">No feedback submitted yet.</div>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb.feedback_id} className="col-12 col-md-6">
              <div className="card card-stat border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-3 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark text-capitalize">{fb.user_name}</span>
                      <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= (fb.rating || 0) ? 'text-warning' : 'text-muted'}
                            fill={s <= (fb.rating || 0) ? '#ffc107' : 'none'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-secondary small fst-italic mb-0">"{fb.feedback}"</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top text-muted" style={{ fontSize: '0.7rem' }}>
                    <span>Review ID #{fb.feedback_id}</span>
                    <span className="badge bg-success bg-opacity-25 text-success">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Feedback Modal */}
      {isAddOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Submit Customer Review</h5>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-close"></button>
              </div>

              <form onSubmit={handleCreateFeedback}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Select Customer *</label>
                    <select
                      required
                      value={formData.user}
                      onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                      className="form-select"
                    >
                      {users.map(u => (
                        <option key={u.userid} value={u.userid}>
                          {u.f_name} (ID: #{u.userid})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Rating</label>
                    <div className="d-flex align-items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="btn btn-link p-0 text-decoration-none"
                        >
                          <Star
                            size={28}
                            className={star <= formData.rating ? 'text-warning' : 'text-muted'}
                            fill={star <= formData.rating ? '#ffc107' : 'none'}
                          />
                        </button>
                      ))}
                      <span className="fw-bold text-dark small ms-2">{formData.rating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-1">Feedback Comments *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      placeholder="Write review..."
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline-secondary btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-fiesta btn-sm fw-semibold">
                    Post Review
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

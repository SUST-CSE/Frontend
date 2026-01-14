import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import feedbackService from '../../api/services/feedbackService';
import '../admin/AdminModals.css';

const ViewFeedbackModal = ({ isOpen, onClose }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchFeedbackStats();
        }
    }, [isOpen]);

    const fetchFeedbackStats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await feedbackService.getFeedbackStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            setError('Failed to load feedback statistics');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (
            <span className="rating-stars">
                {''.repeat(fullStars)}
                {hasHalfStar && '½'}
                {''.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
            </span>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Feedback Statistics"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="data-table-loading">Loading feedback statistics...</div>
            ) : stats ? (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{stats.totalFeedback || 0}</div>
                            <div className="stat-label">Total Feedback</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.averageRating?.toFixed(2) || '0.00'}</div>
                            <div className="stat-label">Average Rating</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.courseFeedbackCount || 0}</div>
                            <div className="stat-label">Course Feedback</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.teacherFeedbackCount || 0}</div>
                            <div className="stat-label">Teacher Feedback</div>
                        </div>
                    </div>

                    {stats.ratingDistribution && (
                        <div className="stats-section">
                            <h3>Rating Distribution</h3>
                            <div className="rating-distribution">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className="rating-bar">
                                        <span className="rating-label">{rating} {renderStars(rating)}</span>
                                        <div className="bar-container">
                                            <div
                                                className="bar-fill"
                                                style={{
                                                    width: `${((stats.ratingDistribution[rating] || 0) / stats.totalFeedback * 100)}%`,
                                                    background: '#dc2626'
                                                }}
                                            />
                                        </div>
                                        <span className="rating-count">{stats.ratingDistribution[rating] || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {stats.recentComments && stats.recentComments.length > 0 && (
                        <div className="stats-section">
                            <h3>Recent Comments</h3>
                            <div className="comments-list">
                                {stats.recentComments.map((comment, index) => (
                                    <div key={index} className="comment-card">
                                        <div style={{ marginBottom: '8px' }}>
                                            {renderStars(comment.rating)}
                                        </div>
                                        <p style={{ margin: 0, color: '#333' }}>{comment.comment || 'No comment provided'}</p>
                                        <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="data-table-empty">No feedback statistics available</div>
            )}

            <div className="modal-footer-actions">
                <button onClick={fetchFeedbackStats} className="btn-secondary">
                    Refresh
                </button>
            </div>
        </Modal>
    );
};

export default ViewFeedbackModal;

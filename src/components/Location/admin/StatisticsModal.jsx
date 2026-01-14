import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import statsService from '../../api/services/statsService';
import './AdminModals.css';

const StatisticsModal = ({ isOpen, onClose }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchStats();
        }
    }, [isOpen]);

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await statsService.getSystemStats();
            console.log("Stats", response)
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="System Statistics"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="data-table-loading">Loading statistics...</div>
            ) : stats ? (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{stats.users?.students?.total || 0}</div>
                            <div className="stat-label">Total Students</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.users?.teachers?.total || 0}</div>
                            <div className="stat-label">Total Teachers</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.academic?.courses || 0}</div>
                            <div className="stat-label">Total Courses</div>
                        </div>
                        {}
                        <div className="stat-card">
                            <div className="stat-value">{stats.academic?.notices || 0}</div>
                            <div className="stat-label">Active Notices</div>
                        </div>
                        {}
                        <div className="stat-card">
                            <div className="stat-value">{stats.users?.teachers?.approved || 0}</div>
                            <div className="stat-label">Pending Approvals</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{stats.academic?.feedbacks || 0}</div>
                            <div className="stat-label">Total Feedback</div>
                        </div>
                    </div>

                    {stats.studentsBySession && Object.keys(stats.studentsBySession).length > 0 && (
                        <div className="stats-section">
                            <h3>Students by Session</h3>
                            <div className="stats-grid">
                                {Object.entries(stats.studentsBySession).map(([session, count]) => (
                                    <div key={session} className="stat-card">
                                        <div className="stat-value">{count}</div>
                                        <div className="stat-label">{session}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {stats.coursesByLevel && Object.keys(stats.coursesByLevel).length > 0 && (
                        <div className="stats-section">
                            <h3>Courses by Level</h3>
                            <div className="stats-grid">
                                {Object.entries(stats.coursesByLevel).map(([level, count]) => (
                                    <div key={level} className="stat-card">
                                        <div className="stat-value">{count}</div>
                                        <div className="stat-label">Level {level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="data-table-empty">No statistics available</div>
            )}

            <div className="modal-footer-actions">
                <button onClick={fetchStats} className="btn-secondary">
                    Refresh
                </button>
            </div>
        </Modal>
    );
};

export default StatisticsModal;

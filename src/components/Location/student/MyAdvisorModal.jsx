import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import advisorService from '../../api/services/advisorService';
import '../admin/AdminModals.css';

const MyAdvisorModal = ({ isOpen, onClose }) => {
    const [advisor, setAdvisor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchAdvisor();
        }
    }, [isOpen]);

    const fetchAdvisor = async () => {
        setLoading(true);
        console.log("testing");
        setError('');
        try {
            const response = await advisorService.getMyAdvisor();
            console.log(response);
            if (response.success) {
                setAdvisor(response.data);
            }
        } catch (err) {
            setError('No advisor assigned yet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="My Advisor"
            size="medium"
        >
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="data-table-loading">Loading advisor information...</div>
            ) : advisor ? (
                <div className="advisor-info">
                    <div className="advisor-card">
                        <div className="advisor-avatar">
                            {advisor.name?.[0] || '‍'}
                        </div>
                        <h2>{advisor.name || 'Not Available'}</h2>
                        <p className="designation">{advisor.teacher?.designation || ''}</p>

                        <div className="advisor-details">
                            <div className="detail-item">
                                <strong>Email:</strong>
                                <p>{advisor.email || 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Phone:</strong>
                                <p>{advisor.phone || 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Designation:</strong>
                                <p>{advisor.designation || 'N/A'}</p>
                            </div>
                            <div className="detail-item">
                                <strong>Department:</strong>
                                <p>{advisor.department || 'CSE'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="data-table-empty">No advisor assigned</div>
            )}
        </Modal>
    );
};

export default MyAdvisorModal;

import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import advisorService from '../../api/services/advisorService';
import teacherAuthService from '../../api/services/teacherAuthService';
import './AdminModals.css';

const AssignAdvisorsModal = ({ isOpen, onClose }) => {
    const [session, setSession] = useState('');
    const [batch, setBatch] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [currentAssignments, setCurrentAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
            fetchCurrentAssignments();
        }
    }, [isOpen]);

    const fetchTeachers = async () => {
        try {
            const response = await teacherAuthService.getApprovedTeachers();
            if (response.success) {
                setTeachers(response.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        }
    };

    const fetchCurrentAssignments = async () => {
        try {
            const response = await advisorService.getAdvisors();
            if (response.success) {
                setCurrentAssignments(response.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch assignments:', err);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!session || !batch || !teacherId) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await advisorService.assignAdvisor({
                session,
                batch: parseInt(batch),
                teacherId,
            });

            if (response.success) {
                setMessage(`Successfully assigned advisor to session ${session}, batch ${batch}`);
                fetchCurrentAssignments();
                setSession('');
                setBatch('');
                setTeacherId('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign advisor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assign Advisors by Session" size="medium">
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleAssign} className="modal-form">
                <div className="form-group">
                    <label>Select Session</label>
                    <select
                        value={session}
                        onChange={(e) => setSession(e.target.value)}
                        required
                    >
                        <option value="">Choose session...</option>
                        <option value="2019-20">2019-20</option>
                        <option value="2020-21">2020-21</option>
                        <option value="2021-22">2021-22</option>
                        <option value="2022-23">2022-23</option>
                        <option value="2023-24">2023-24</option>
                        <option value="2024-25">2024-25</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Batch Number</label>
                    <input
                        type="number"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        placeholder="e.g. 40, 41, 42..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Select Advisor (Teacher)</label>
                    <select
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        required
                    >
                        <option value="">Choose teacher...</option>
                        {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                                {teacher.name} ({teacher.designation})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Assigning...' : 'Assign to Session'}
                </button>
            </form>

            {session && currentAssignments.length > 0 && (
                <div className="current-assignments" style={{ marginTop: '24px' }}>
                    <h3>Current Assignments for Session {session}</h3>
                    <div className="assignments-list">
                        {currentAssignments.map((assignment, index) => (
                            <div key={index} className="assignment-item">
                                <strong>{assignment.studentName}</strong>
                                <span> → </span>
                                <span>{assignment.advisorName || 'Not assigned'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AssignAdvisorsModal;

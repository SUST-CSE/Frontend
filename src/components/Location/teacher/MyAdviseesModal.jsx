import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import advisorService from '../../api/services/advisorService';
import '../admin/AdminModals.css';

const MyAdviseesModal = ({ isOpen, onClose }) => {
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchMyAdvisees();
        }
    }, [isOpen]);

    const fetchMyAdvisees = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await advisorService.getMyAdvisees();
            if (response.success) {
                const data = response.data;
                if (data?.students) {
                    setStudents(data.students);
                    setAssignments(data.assignments || []);
                } else if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    setStudents([]);
                }
            }
        } catch (err) {
            setError('Failed to fetch advisees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Reg No', accessor: 'registrationId' },
        { header: 'Email', accessor: 'email' },
        { header: 'Session', accessor: 'session' },
        { header: 'Batch', accessor: 'batch' }
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Advisees">
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}

                {assignments.length > 0 && (
                    <div className="assignments-info" style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                        <strong>Your Assignments:</strong>
                        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                            {assignments.map((a, i) => (
                                <li key={i}>Session {a.session}, Batch {a.batch}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {students.length === 0 && !loading && !error && (
                    <div className="empty-message">No advisees assigned to you yet.</div>
                )}

                <DataTable
                    columns={columns}
                    data={students}
                    loading={loading}
                    emptyMessage="No advisees found"
                />
            </div>
        </Modal>
    );
};

export default MyAdviseesModal;
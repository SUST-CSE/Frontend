import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import advisorService from '../../api/services/advisorService';
import '../admin/AdminModals.css';

const StudentsModal = ({ isOpen, onClose }) => {
    const [advisees, setAdvisees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchAdvisees();
        }
    }, [isOpen]);

    const fetchAdvisees = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await advisorService.getMyAdvisees();
            if (response.success) {
                const students = response.data?.students || response.data || [];
                setAdvisees(students);
            }
        } catch (err) {
            setError('Failed to fetch students');
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
        <Modal isOpen={isOpen} onClose={onClose} title="My Students">
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}
                {advisees.length === 0 && !loading && !error && (
                    <div className="empty-message">No students assigned to you yet.</div>
                )}
                <DataTable
                    columns={columns}
                    data={advisees}
                    loading={loading}
                    emptyMessage="No students found"
                />
            </div>
        </Modal>
    );
};

export default StudentsModal;
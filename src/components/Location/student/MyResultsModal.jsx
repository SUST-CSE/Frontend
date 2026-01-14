import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import { getMyResults } from '../../api/services/resultService';
import '../admin/AdminModals.css';

const MyResultsModal = ({ isOpen, onClose }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cgpa, setCgpa] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchResults();
        }
    }, [isOpen]);

    const fetchResults = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getMyResults();
            console.log(response)
            setResults(response.data);
            // Calculate CGPA logic if available
            if (response.cgpa) {
                setCgpa(response.cgpa);
            }
        } catch (err) {
            setError('Failed to fetch results');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Course Code', accessor: 'course.code' },
        { header: 'Course Title', accessor: 'course.title' },
        { header: 'Credit', accessor: 'course.credit' },
        { header: 'Grade', accessor: 'grade' },
        { header: 'Point', accessor: 'point' },
        { header: 'Semester', accessor: 'semester' }
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Results">
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}
                <div className="cgpa-display">
                    <h3>CGPA: {cgpa}</h3>
                </div>
                <DataTable columns={columns} data={results} loading={loading} />
            </div>
        </Modal>
    );
};

export default MyResultsModal;
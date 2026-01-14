import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseResultService from '../../api/services/courseResultService';
import { API_URL } from '../../utils/constants';
import '../admin/AdminModals.css';

const MyResultsModal = ({ isOpen, onClose }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchResults();
        }
    }, [isOpen]);

    const fetchResults = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await courseResultService.getMyResults();
            setResults(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch results');
            console.error('Error fetching results:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (result) => {
        const downloadUrl = `${API_URL}${result.filePath}`;
        window.open(downloadUrl, '_blank');
    };

    const columns = [
        {
            header: 'Course Code',
            accessor: 'courseId.code',
            render: (value, row) => row.courseId?.code || 'N/A'
        },
        {
            header: 'Course Title',
            accessor: 'courseId.title',
            render: (value, row) => row.courseId?.title || 'N/A'
        },
        {
            header: 'Session',
            accessor: 'session',
            sortable: true
        },
        {
            header: 'Semester',
            accessor: 'semester',
            sortable: true,
            render: (value) => `Semester ${value}`
        },
        {
            header: 'File Type',
            accessor: 'fileType',
            render: (value) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: value === 'pdf' ? '#dc3545' : '#28a745',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    {value === 'pdf' ? '📄 PDF' : '📊 Excel'}
                </span>
            )
        },
        {
            header: 'Uploaded By',
            accessor: 'teacherId.name',
            render: (value, row) => row.teacherId?.name || 'N/A'
        },
        {
            header: 'Uploaded Date',
            accessor: 'uploadedAt',
            render: (value) => new Date(value).toLocaleDateString()
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="My Results"
            size="large"
        >
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}

                {!loading && results.length === 0 && !error && (
                    <div className="empty-message" style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        <p>📄 No results available yet</p>
                        <p style={{ fontSize: '14px', marginTop: '10px' }}>
                            Your teachers haven't uploaded any results for your enrolled courses.
                        </p>
                    </div>
                )}

                <DataTable
                    columns={columns}
                    data={results}
                    loading={loading}
                    emptyMessage="No results uploaded yet"
                    onView={handleDownload}
                    searchPlaceholder="Search results..."
                />

                {results.length > 0 && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>ℹ️ Note:</strong> Click the view icon (👁️) to download the result file.
                        Results are only shown for courses you are enrolled in.
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MyResultsModal;
import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import enrollmentService from '../../api/services/enrollmentService';
import '../admin/AdminModals.css';

const EnrollmentRequestsModal = ({ isOpen, onClose }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        if (isOpen) {
            fetchRequests();
        }
    }, [isOpen, activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await enrollmentService.getEnrollmentRequests(activeTab);
            setRequests(response.data || []);
        } catch (err) {
            console.error('Error fetching enrollment requests:', err);
            const errorMsg = err.response?.data?.message || 'Failed to load enrollment requests';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (enrollment) => {
        if (window.confirm(`Approve enrollment request for ${enrollment.studentId?.name}?`)) {
            try {
                await enrollmentService.approveEnrollment(enrollment._id);
                setSuccess(`Approved enrollment for ${enrollment.studentId?.name}`);
                setTimeout(() => setSuccess(''), 3000);
                fetchRequests(); // Refresh list
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Failed to approve enrollment';
                setError(errorMsg);
                alert(errorMsg);
            }
        }
    };

    const handleReject = async (enrollment) => {
        if (window.confirm(`Reject enrollment request for ${enrollment.studentId?.name}? They can request again later.`)) {
            try {
                await enrollmentService.rejectEnrollment(enrollment._id);
                setSuccess(`Rejected enrollment for ${enrollment.studentId?.name}`);
                setTimeout(() => setSuccess(''), 3000);
                fetchRequests(); // Refresh list
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Failed to reject enrollment';
                setError(errorMsg);
                alert(errorMsg);
            }
        }
    };

    const handleViewDetails = (enrollment) => {
        const student = enrollment.studentId;
        const course = enrollment.courseId;
        const details = `
Student Information:
━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${student?.name || 'N/A'}
Registration: ${student?.registrationNumber || 'N/A'}
Email: ${student?.email || 'N/A'}
Session: ${student?.session || 'N/A'}
Batch: ${student?.batch || 'N/A'}

Course Information:
━━━━━━━━━━━━━━━━━━━━━━━━
Code: ${course?.code || 'N/A'}
Title: ${course?.title || 'N/A'}
Semester: ${enrollment.semester}
Session: ${enrollment.session}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━
Requested: ${new Date(enrollment.requestedAt).toLocaleString()}
Status: ${enrollment.status.toUpperCase()}
${enrollment.approvedAt ? `Approved: ${new Date(enrollment.approvedAt).toLocaleString()}` : ''}
${enrollment.rejectedAt ? `Rejected: ${new Date(enrollment.rejectedAt).toLocaleString()}` : ''}
        `.trim();

        alert(details);
    };

    const columns = [
        {
            header: 'Student Name',
            accessor: 'studentId.name',
            render: (value, row) => row.studentId?.name || 'N/A',
            sortable: true
        },
        {
            header: 'Registration No.',
            accessor: 'studentId.registrationNumber',
            render: (value, row) => row.studentId?.registrationId || 'N/A',
        },
        {
            header: 'Course Code',
            accessor: 'courseId.code',
            render: (value, row) => row.courseId?.code || 'N/A',
            sortable: true
        },
        {
            header: 'Course Title',
            accessor: 'courseId.title',
            render: (value, row) => row.courseId?.title || 'N/A',
        },
        {
            header: 'Semester',
            accessor: 'semester',
            sortable: true
        },
        {
            header: 'Session',
            accessor: 'session',
            sortable: true
        },
        {
            header: 'Requested',
            accessor: 'requestedAt',
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => {
                const colors = {
                    pending: '#ff9800',
                    approved: '#4caf50',
                    rejected: '#f44336'
                };
                return (
                    <span style={{
                        color: colors[value] || '#000',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                    }}>
                        {value}
                    </span>
                );
            }
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Course Enrollment Requests"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Requests ({activeTab === 'pending' ? requests.length : '...'})
                </button>
                <button
                    className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('approved')}
                >
                    Approved ({activeTab === 'approved' ? requests.length : '...'})
                </button>
                <button
                    className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rejected')}
                >
                    Rejected ({activeTab === 'rejected' ? requests.length : '...'})
                </button>
            </div>

            <div style={{ marginBottom: '20px', marginTop: '20px' }}>
                {activeTab === 'pending' && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#fff3cd',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>Pending Requests:</strong> Review and approve/reject student enrollment requests.
                        Click the view icon (👁️) to see full details, edit icon (✏️) to approve, or delete icon (🗑️) to reject.
                    </div>
                )}
                {activeTab === 'approved' && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#d4edda',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>Approved Enrollments:</strong> Students you've approved can now access course materials and see results.
                    </div>
                )}
                {activeTab === 'rejected' && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f8d7da',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>Rejected Requests:</strong> These students were not approved. They can request again if needed.
                    </div>
                )}
            </div>

            {!loading && requests.length === 0 && (
                <div className="empty-message" style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#666'
                }}>
                    <p style={{ fontSize: '48px', marginBottom: '10px' }}>
                        {activeTab === 'pending' ? '📋' : activeTab === 'approved' ? '✅' : '❌'}
                    </p>
                    <p>No {activeTab} enrollment requests</p>
                </div>
            )}

            <DataTable
                data={requests}
                columns={columns}
                loading={loading}
                emptyMessage={`No ${activeTab} requests`}
                onView={handleViewDetails}
                onEdit={activeTab === 'pending' ? handleApprove : null}
                onDelete={activeTab === 'pending' ? handleReject : null}
                editButtonText="Approve"
                deleteButtonText="Reject"
                searchPlaceholder="Search requests..."
            />
        </Modal>
    );
};

export default EnrollmentRequestsModal;

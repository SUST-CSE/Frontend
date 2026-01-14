import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import enrollmentService from '../../api/services/enrollmentService';
import '../admin/AdminModals.css';

const StudentsModal = ({ isOpen, onClose }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
        }
    }, [isOpen]);

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch all approved enrollments (which means enrolled students)
            const response = await enrollmentService.getEnrollmentRequests('approved');
            if (response.success) {
                // Map the enrollment data to a flat structure for the table
                const enrolledStudents = response.data.map(enrollment => ({
                    id: enrollment._id,
                    name: enrollment.studentId?.name || 'N/A',
                    registrationId: enrollment.studentId?.registrationId || 'N/A',
                    email: enrollment.studentId?.email || 'N/A',
                    courseCode: enrollment.courseId?.code || 'N/A',
                    courseTitle: enrollment.courseId?.title || 'N/A',
                    session: enrollment.session || 'N/A'
                }));
                setStudents(enrolledStudents);
            }
        } catch (err) {
            setError('Failed to fetch enrolled students');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Reg No', accessor: 'registrationId' },
        { header: 'Course', accessor: 'courseCode' },
        { header: 'Email', accessor: 'email' },
        { header: 'Session', accessor: 'session' }
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Enrolled Students">
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}
                {students.length === 0 && !loading && !error && (
                    <div className="empty-message">No students enrolled in your courses yet.</div>
                )}
                <DataTable
                    columns={columns}
                    data={students}
                    loading={loading}
                    emptyMessage="No students found"
                />
            </div>
        </Modal>
    );
};

export default StudentsModal;
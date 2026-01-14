import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseService from '../../api/services/courseService';
import '../admin/AdminModals.css';

const MyCoursesModal = ({ isOpen, onClose }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await courseService.getCourses();
            setCourses(response.data);
        } catch (err) {
            setError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Course Code', accessor: 'code' },
        { header: 'Course Title', accessor: 'title' },
        { header: 'Credit', accessor: 'credit' },
        { header: 'Type', accessor: 'type' },
        { header: 'Semester', accessor: 'semester' }
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Courses">
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}
                <DataTable columns={columns} data={courses} loading={loading} />
            </div>
        </Modal>
    );
};

export default MyCoursesModal;
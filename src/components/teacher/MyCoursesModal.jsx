import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseService from '../../api/services/courseService';
import useStore from '../../zustand/store';
import '../admin/AdminModals.css';

const MyCoursesModal = ({ isOpen, onClose }) => {
    const { user } = useStore();
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
            // Filter courses assigned to this teacher
            const teacherId = user?.id || user?._id;
            const myCourses = response.data.filter(course =>
                course.teacherId && (course.teacherId === teacherId || course.teacherId._id === teacherId)
            );
            setCourses(myCourses);
        } catch (err) {
            setError('Failed to fetch courses');
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCourse = (course) => {
        const details = `
Course Information:
━━━━━━━━━━━━━━━━━━━━
Code: ${course.code}
Title: ${course.title}
Credits: ${course.credits || 'N/A'}
Level: ${course.level}
Semester: ${course.semester || 'N/A'}
Session: ${course.session || 'N/A'}
Department: ${course.department || 'N/A'}

Description:
━━━━━━━━━━━━━━━━━━━━
${course.description || 'No description available'}

Status:
━━━━━━━━━━━━━━━━━━━━
Enrollment: ${course.isEnrollmentOpen !== false ? 'Open ✅' : 'Closed ❌'}
        `.trim();

        alert(details);
    };

    const columns = [
        { header: 'Course Code', accessor: 'code', sortable: true },
        { header: 'Course Title', accessor: 'title', sortable: true },
        {
            header: 'Credits',
            accessor: 'credits',
            render: (value) => value || 'N/A'
        },
        {
            header: 'Semester',
            accessor: 'semester',
            sortable: true,
            render: (value) => value || 'N/A'
        },
        {
            header: 'Session',
            accessor: 'session',
            sortable: true,
            render: (value) => value || 'N/A'
        },
        {
            header: 'Level',
            accessor: 'level'
        },
        {
            header: 'Enrollment',
            accessor: 'isEnrollmentOpen',
            render: (value) => value !== false ? '✅ Open' : '❌ Closed'
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="My Courses"
            size="large"
        >
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}

                {!loading && courses.length === 0 && !error && (
                    <div className="empty-message" style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        <p style={{ fontSize: '48px', marginBottom: '10px' }}>📚</p>
                        <p>No courses assigned to you yet</p>
                        <p style={{ fontSize: '14px', marginTop: '10px' }}>
                            Contact the admin to get courses assigned.
                        </p>
                    </div>
                )}

                <DataTable
                    columns={columns}
                    data={courses}
                    loading={loading}
                    emptyMessage="No courses assigned"
                    onView={handleViewCourse}
                    searchPlaceholder="Search my courses..."
                />
            </div>
        </Modal>
    );
};

export default MyCoursesModal;
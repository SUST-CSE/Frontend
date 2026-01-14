import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseService from '../../api/services/courseService';
import enrollmentService from '../../api/services/enrollmentService';
import useStore from '../../zustand/store';
import '../admin/AdminModals.css';

const CoursesModal = ({ isOpen, onClose }) => {
    const { user } = useStore();
    const [activeTab, setActiveTab] = useState('my-courses');
    const [myCourses, setMyCourses] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMyCourses();
            if (activeTab === 'available') {
                fetchAvailableCourses();
            }
        }
    }, [isOpen, activeTab]);

    const fetchMyCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await enrollmentService.getMyEnrollments('approved');
            setMyCourses(response.data || []);
        } catch (err) {
            setError('Failed to load your courses');
            console.error('Error fetching my courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await courseService.getCourses();
            if (response.success) {
                // Filter courses that have enrollment open and assigned teachers
                const openCourses = response.data.filter(course =>
                    course.isEnrollmentOpen !== false && course.teacherId
                );
                setAvailableCourses(openCourses);
            }
        } catch (err) {
            setError('Failed to load available courses');
            console.error('Error fetching available courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestEnrollment = async (course) => {
        if (!course.semester || !course.session) {
            alert('This course does not have semester/session information. Please contact admin.');
            return;
        }

        if (window.confirm(`Request enrollment in ${course.code} - ${course.title}?`)) {
            setSubmitting(true);
            setError('');
            setSuccess('');
            try {
                await enrollmentService.requestEnrollment({
                    courseId: course._id,
                    semester: course.semester,
                    session: course.session,
                });
                setSuccess(`Enrollment request submitted for ${course.code}! Waiting for teacher approval.`);
                setTimeout(() => setSuccess(''), 5000);
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Failed to submit enrollment request';
                setError(errorMsg);
                alert(errorMsg);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const myCoursesColumns = [
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
            header: 'Credits',
            accessor: 'courseId.credits',
            render: (value, row) => row.courseId?.credits || 'N/A',
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
            header: 'Teacher',
            accessor: 'teacherId.name',
            render: (value, row) => row.teacherId?.name || 'N/A',
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (value) => (
                <span style={{
                    color: value === 'approved' ? 'green' : 'orange',
                    fontWeight: 600
                }}>
                    {value?.toUpperCase()}
                </span>
            )
        }
    ];

    const availableCoursesColumns = [
        { accessor: 'code', header: 'Course Code', sortable: true },
        { accessor: 'title', header: 'Course Title', sortable: true },
        { accessor: 'credits', header: 'Credits', sortable: true },
        {
            accessor: 'semester',
            header: 'Semester',
            sortable: true,
            render: (value) => value || 'N/A'
        },
        {
            accessor: 'session',
            header: 'Session',
            sortable: true,
            render: (value) => value || 'N/A'
        },
        { accessor: 'level', header: 'Level', sortable: true },
    ];

    const handleViewCourse = (course) => {
        const description = course.description || 'No description available';
        alert(`${course.code} - ${course.title}\n\nCredits: ${course.credits || 'N/A'}\nLevel: ${course.level}\n\n${description}`);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="My Courses"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'my-courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-courses')}
                >
                    My Enrolled Courses ({myCourses.length})
                </button>
                <button
                    className={`tab ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Request New Course
                </button>
            </div>

            {activeTab === 'my-courses' && (
                <>
                    {!loading && myCourses.length === 0 && (
                        <div className="empty-message" style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666'
                        }}>
                            <p>📚 You haven't enrolled in any courses yet</p>
                            <p style={{ fontSize: '14px', marginTop: '10px' }}>
                                Click on "Request New Course" tab to browse and request enrollment.
                            </p>
                        </div>
                    )}

                    <DataTable
                        data={myCourses}
                        columns={myCoursesColumns}
                        loading={loading}
                        emptyMessage="No enrolled courses"
                        onView={handleViewCourse}
                        searchPlaceholder="Search my courses..."
                    />
                </>
            )}

            {activeTab === 'available' && (
                <>
                    <div style={{
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '8px',
                        fontSize: '14px'
                    }}>
                        <strong>ℹ️ How to enroll:</strong>
                        <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            <li>Browse available courses below</li>
                            <li>Click the view icon (👁️) to see course details</li>
                            <li>Click "Request" button to send enrollment request to teacher</li>
                            <li>Wait for teacher approval</li>
                            <li>Once approved, the course will appear in "My Enrolled Courses" tab</li>
                        </ol>
                    </div>

                    <DataTable
                        data={availableCourses}
                        columns={availableCoursesColumns}
                        loading={loading}
                        emptyMessage="No courses available for enrollment"
                        onView={handleViewCourse}
                        customActions={(course) => (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestEnrollment(course);
                                }}
                                className="btn-primary"
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                                disabled={submitting}
                            >
                                📝 Request
                            </button>
                        )}
                        searchPlaceholder="Search available courses..."
                    />
                </>
            )}
        </Modal>
    );
};

export default CoursesModal;

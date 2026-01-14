import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseOfferingService from '../../api/services/courseOfferingService';
import courseService from '../../api/services/courseService';
import teacherAuthService from '../../api/services/teacherAuthService';
import './AdminModals.css';

const AssignCourseModal = ({ isOpen, onClose }) => {
    const [offerings, setOfferings] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        teacherId: '',
        semester: '1',
        session: '',
        year: new Date().getFullYear().toString(),
        maxStudents: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchOfferings();
            fetchCourses();
            fetchTeachers();
        }
    }, [isOpen]);

    const fetchOfferings = async () => {
        setLoading(true);
        try {
            const response = await courseOfferingService.getCourseOfferings();
            setOfferings(response.data || []);
        } catch (err) {
            console.error('Error fetching course offerings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await courseService.getCourses();
            setCourses(response.data || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await teacherAuthService.getApprovedTeachers();
            setTeachers(response.data || []);
        } catch (err) {
            console.error('Error fetching teachers:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const dataToSubmit = {
                ...formData,
                maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
            };

            await courseOfferingService.createOffering(dataToSubmit);
            setSuccess('Course assigned to teacher successfully!');
            resetForm();
            fetchOfferings();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to assign course';
            setError(errorMsg);
            alert(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            courseId: '',
            teacherId: '',
            semester: '1',
            session: '',
            year: new Date().getFullYear().toString(),
            maxStudents: '',
            startDate: '',
            endDate: '',
        });
        setShowForm(false);
    };

    const handleDelete = async (offering) => {
        if (window.confirm(`Delete this course assignment? Students enrolled in this offering will lose access.`)) {
            try {
                await courseOfferingService.deleteOffering(offering._id);
                setSuccess('Course assignment deleted successfully');
                fetchOfferings();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                const errorMsg = err.response?.data?.message || 'Failed to delete offering';
                setError(errorMsg);
                alert(errorMsg);
            }
        }
    };

    const handleView = (offering) => {
        const course = offering.courseId;
        const teacher = offering.teacherId;
        const details = `
Course Offering Details:
━━━━━━━━━━━━━━━━━━━━━━━━

Course:
${course?.code} - ${course?.title}
Credits: ${course?.credits || 'N/A'}
Level: ${course?.level}

Teacher:
${teacher?.name}
Email: ${teacher?.email}
Designation: ${teacher?.designation}

Offering Details:
Semester: ${offering.semester}
Session: ${offering.session}
Year: ${offering.year}
Enrollment: ${offering.isEnrollmentOpen ? 'Open ✅' : 'Closed ❌'}
Enrolled Students: ${offering.enrolledCount}${offering.maxStudents ? ` / ${offering.maxStudents}` : ''}
${offering.startDate ? `Start Date: ${new Date(offering.startDate).toLocaleDateString()}` : ''}
${offering.endDate ? `End Date: ${new Date(offering.endDate).toLocaleDateString()}` : ''}
        `.trim();

        alert(details);
    };

    const columns = [
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
            header: 'Teacher',
            accessor: 'teacherId.name',
            render: (value, row) => row.teacherId?.name || 'N/A',
            sortable: true
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
            header: 'Year',
            accessor: 'year',
            sortable: true
        },
        {
            header: 'Enrolled',
            accessor: 'enrolledCount',
            render: (value, row) => `${value}${row.maxStudents ? `/${row.maxStudents}` : ''}`
        },
        {
            header: 'Status',
            accessor: 'isEnrollmentOpen',
            render: (value) => value ? '✅ Open' : '❌ Closed'
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Courses to Teachers"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="modal-actions">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ marginBottom: '20px' }}
                >
                    {showForm ? '❌ Cancel' : '➕ Assign New Course'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Course *</label>
                            <select
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.code} - {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Teacher *</label>
                            <select
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.name} - {teacher.designation}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Semester *</label>
                            <select
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                required
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Session *</label>
                            <input
                                type="text"
                                value={formData.session}
                                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                                placeholder="e.g., 2024-2025"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Year *</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                placeholder="e.g., 2024"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Max Students</label>
                            <input
                                type="number"
                                value={formData.maxStudents}
                                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                                placeholder="Leave empty for unlimited"
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className="btn-primary">
                            {submitting ? 'Assigning...' : 'Assign Course'}
                        </button>
                    </div>
                </form>
            )}

            <div style={{ marginTop: '30px' }}>
                <h3>Course Assignments</h3>
                <DataTable
                    data={offerings}
                    columns={columns}
                    loading={loading}
                    emptyMessage="No course assignments yet"
                    onView={handleView}
                    onDelete={handleDelete}
                    searchPlaceholder="Search course assignments..."
                />
            </div>
        </Modal>
    );
};

export default AssignCourseModal;

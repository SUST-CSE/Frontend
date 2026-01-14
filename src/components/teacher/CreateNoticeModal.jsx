import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import noticeService from '../../api/services/noticeService';
import courseService from '../../api/services/courseService';
import '../admin/AdminModals.css';

const CreateNoticeModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'announcement',
        targetType: 'all',
        targetCourseId: '',
        targetStudentRegistration: ''
    });
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTeacherCourses();
        }
    }, [isOpen]);

    const fetchTeacherCourses = async () => {
        setLoadingCourses(true);
        try {
            const response = await courseService.getCourses();
            if (response.success) {
                // Filter only courses that have a teacher assigned (the logged in teacher)
                const teacherCourses = response.data.filter(course => course.teacherId);
                setCourses(teacherCourses);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // Prepare data
            const dataToSubmit = {
                title: formData.title,
                content: formData.content,
                type: formData.type,
                targetType: formData.targetType
            };

            // Add course ID if course-specific
            if (formData.targetType === 'course') {
                if (!formData.targetCourseId) {
                    setError('Please select a course');
                    setSubmitting(false);
                    return;
                }
                dataToSubmit.targetCourseId = formData.targetCourseId;
            }

            // Add student registration if individual student
            if (formData.targetType === 'student') {
                if (!formData.targetStudentRegistration) {
                    setError('Please enter student registration number');
                    setSubmitting(false);
                    return;
                }
                dataToSubmit.targetStudentRegistration = formData.targetStudentRegistration;
            }

            const response = await noticeService.createNotice(dataToSubmit);

            if (response.success) {
                setSuccess(true);
                setFormData({
                    title: '',
                    content: '',
                    type: 'announcement',
                    targetType: 'all',
                    targetCourseId: '',
                    targetStudentRegistration: ''
                });
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 1500);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to create notice';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Notice"
            size="medium"
        >
            {error && <div className="error-message">{error}</div>}
            {success && <div style={{ padding: '12px 16px', background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '4px', color: '#16a34a', marginBottom: '16px', fontWeight: 500 }}>Notice created successfully!</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Notice title..."
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Type *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        >
                            <option value="announcement">Announcement</option>
                            <option value="assignment">Assignment</option>
                            <option value="event">Event</option>
                            <option value="routine">Routine</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Send To *</label>
                        <select
                            value={formData.targetType}
                            onChange={(e) => setFormData({
                                ...formData,
                                targetType: e.target.value,
                                targetCourseId: '',
                                targetStudentRegistration: ''
                            })}
                            required
                        >
                            <option value="all">All Students</option>
                            <option value="course">Course Students</option>
                            <option value="student">Individual Student</option>
                        </select>
                    </div>
                </div>

                {/* Course Selection (when targetType is 'course') */}
                {formData.targetType === 'course' && (
                    <div className="form-group">
                        <label>Select Course *</label>
                        {loadingCourses ? (
                            <div style={{ padding: '10px', color: '#666' }}>Loading courses...</div>
                        ) : (
                            <select
                                value={formData.targetCourseId}
                                onChange={(e) => setFormData({ ...formData, targetCourseId: e.target.value })}
                                required
                            >
                                <option value="">-- Select a course --</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.code} - {course.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {/* Registration Number Input (when targetType is 'student') */}
                {formData.targetType === 'student' && (
                    <div className="form-group">
                        <label>Student Registration Number *</label>
                        <input
                            type="text"
                            value={formData.targetStudentRegistration}
                            onChange={(e) => setFormData({ ...formData, targetStudentRegistration: e.target.value })}
                            placeholder="e.g., 2021331006"
                            required
                        />
                    </div>
                )}

                {/* Info Box */}
                {formData.targetType !== 'all' && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#1976d2'
                    }}>
                        <strong>ℹ️ Targeting:</strong> This notice will only be visible to {
                            formData.targetType === 'course'
                                ? 'students enrolled in the selected course'
                                : 'the specified student'
                        }.
                    </div>
                )}

                <div className="form-group">
                    <label>Content *</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={8}
                        placeholder="Notice content..."
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Publishing...' : 'Publish Notice'}
                    </button>
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateNoticeModal;

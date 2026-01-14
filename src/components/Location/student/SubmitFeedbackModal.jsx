import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import feedbackService from '../../api/services/feedbackService';
import courseService from '../../api/services/courseService';
import facultyService from '../../api/services/facultyService';
import useStore from '../../zustand/store';
import '../admin/AdminModals.css';

const SubmitFeedbackModal = ({ isOpen, onClose }) => {
    const { user } = useStore();
    const [courses, setCourses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [formData, setFormData] = useState({
        targetType: 'course',
        targetId: '',
        rating: 5,
        comment: '',
        session: user?.session || ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            fetchFaculty();
            setSuccess(false);
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        try {
            const response = await courseService.getCourses();
            if (response.success) {
                setCourses(response.data);
            }
        } catch (err) {
            console.error('Failed to load courses:', err);
        }
    };

    const fetchFaculty = async () => {
        try {
            const response = await facultyService.getFaculty();
            if (response.success) {
                setFaculty(response.data);
            }
        } catch (err) {
            console.error('Failed to load faculty:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await feedbackService.submitFeedback(formData);
            if (response.success) {
                setSuccess(true);
                setFormData({
                    targetType: 'course',
                    targetId: '',
                    rating: 5,
                    comment: '',
                    session: user?.session || ''
                });
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (err) {
            setError(err.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Submit Feedback"
            size="medium"
        >
            {error && <div className="error-message">{error}</div>}
            {success && <div style={{ padding: '12px 16px', background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '4px', color: '#16a34a', marginBottom: '16px', fontWeight: 500 }}>Feedback submitted successfully!</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Feedback Type *</label>
                    <select
                        value={formData.targetType}
                        onChange={(e) => setFormData({ ...formData, targetType: e.target.value, targetId: '' })}
                        required
                    >
                        <option value="course">Course</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>{formData.targetType === 'course' ? 'Select Course' : 'Select Teacher'} *</label>
                    <select
                        value={formData.targetId}
                        onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                        required
                    >
                        <option value="">-- Select --</option>
                        {formData.targetType === 'course'
                            ? courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.code} - {course.title}
                                </option>
                            ))
                            : faculty.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name} ({teacher.designation})
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label>Rating *</label>
                    <div className="rating-input" style={{ display: 'flex', gap: '8px', fontSize: '32px', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRatingChange(star)}
                                style={{ color: star <= formData.rating ? '#fbbf24' : '#d1d5db' }}
                            >
                                
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Comment (Optional)</label>
                    <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        rows={5}
                        placeholder="Share your feedback..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                    <button type="button" onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SubmitFeedbackModal;

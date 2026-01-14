import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseService from '../../api/services/courseService';
import './AdminModals.css';

const ManageCoursesModal = ({ isOpen, onClose }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        credits: 3,
        level: '1',
        term: '1',
        type: 'Theory',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

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
            if (response.success) {
                setCourses(response.data);
            }
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingId) {
                await courseService.updateCourse(editingId, formData);
                alert('Course updated successfully!');
            } else {
                await courseService.createCourse(formData);
                alert('Course created successfully!');
            }

            resetForm();
            fetchCourses();
        } catch (err) {
            setError(err.message || 'Failed to save course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (course) => {
        setFormData({
            code: course.code || '',
            title: course.title || '',
            credits: course.credits || 3,
            level: course.level || '1',
            term: course.term || '1',
            type: course.type || 'Theory',
            description: course.description || ''
        });
        setEditingId(course._id);
        setShowForm(true);
    };

    const handleDelete = async (course) => {
        if (!confirm(`Delete course ${course.code}?`)) return;

        try {
            await courseService.deleteCourse(course._id);
            fetchCourses();
        } catch (err) {
            setError(err.message || 'Failed to delete course');
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            title: '',
            credits: 3,
            level: '1',
            term: '1',
            type: 'Theory',
            description: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { key: 'code', label: 'Course Code', sortable: true },
        { key: 'title', label: 'Course Title', sortable: true },
        { key: 'credits', label: 'Credits', sortable: true },
        { key: 'level', label: 'Level', sortable: true },
        { key: 'term', label: 'Term', sortable: true },
        { key: 'type', label: 'Type', sortable: true }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Courses"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            <div className="section-actions">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : 'Add Course'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Course Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="CSE 101"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Course Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Programming Fundamentals"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Credits *</label>
                            <input
                                type="number"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseFloat(e.target.value) })}
                                min="0"
                                step="0.5"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Level *</label>
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                required
                            >
                                <option value="1">Level 1</option>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                                <option value="4">Level 4</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Term *</label>
                            <select
                                value={formData.term}
                                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                required
                            >
                                <option value="1">Term 1</option>
                                <option value="2">Term 2</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Type *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            >
                                <option value="Theory">Theory</option>
                                <option value="Lab">Lab</option>
                                <option value="Project">Project</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            placeholder="Course description..."
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <DataTable
                data={courses}
                columns={columns}
                loading={loading}
                emptyMessage="No courses found"
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </Modal>
    );
};

export default ManageCoursesModal;

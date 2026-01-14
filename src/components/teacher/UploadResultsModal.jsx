import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import courseResultService from '../../api/services/courseResultService';
import courseService from '../../api/services/courseService';
import useStore from '../../zustand/store';
import '../admin/AdminModals.css';

const UploadResultsModal = ({ isOpen, onClose }) => {
    const { user } = useStore();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [courses, setCourses] = useState([]);
    const [uploadHistory, setUploadHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        session: '',
        semester: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchMyCourses();
            fetchUploadHistory();
        }
    }, [isOpen]);

    const fetchMyCourses = async () => {
        try {
            const response = await courseService.getCourses();
            // Filter courses assigned to this teacher
            const teacherId = user?.id || user?._id;
            const myCourses = response.data.filter(course =>
                course.teacherId && (course.teacherId === teacherId || course.teacherId._id === teacherId)
            );
            setCourses(myCourses);
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    };

    const fetchUploadHistory = async () => {
        try {
            const response = await courseResultService.getMyUploadedResults();
            setUploadHistory(response.data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            const validTypes = [
                'application/pdf',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];

            if (!validTypes.includes(fileType)) {
                setError('Please upload a PDF or Excel file');
                setFile(null);
                e.target.value = '';
                return;
            }

            setFile(selectedFile);
            setError('');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!file) {
                setError('Please select a file');
                setLoading(false);
                return;
            }

            if (!formData.courseId || !formData.session || !formData.semester) {
                setError('Please fill all required fields');
                setLoading(false);
                return;
            }

            const uploadFormData = new FormData();
            uploadFormData.append('resultFile', file);
            uploadFormData.append('courseId', formData.courseId);
            uploadFormData.append('session', formData.session);
            uploadFormData.append('semester', formData.semester);
            if (formData.description) {
                uploadFormData.append('description', formData.description);
            }

            const response = await courseResultService.uploadCourseResult(uploadFormData);

            if (response.success) {
                setSuccess('Result file uploaded successfully!');
                await fetchUploadHistory();
                setTimeout(() => {
                    onClose();
                    resetForm();
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload result file');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this result file?')) {
            try {
                await courseResultService.deleteResult(id);
                setSuccess('Result deleted successfully');
                await fetchUploadHistory();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete result');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            courseId: '',
            session: '',
            semester: '',
            description: ''
        });
        setFile(null);
        setError('');
        setSuccess('');
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Course Results" size="large">
            <div className="admin-modal-content">
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${!showHistory ? 'active' : ''}`}
                        onClick={() => setShowHistory(false)}
                    >
                        📤 Upload New
                    </button>
                    <button
                        className={`tab-btn ${showHistory ? 'active' : ''}`}
                        onClick={() => setShowHistory(true)}
                    >
                        📋 Upload History ({uploadHistory.length})
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {!showHistory ? (
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Course *</label>
                            <select
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.code} - {course.title}
                                    </option>
                                ))}
                            </select>
                            {courses.length === 0 && (
                                <p className="help-text" style={{ color: '#666' }}>
                                    No courses found. Please create a course first.
                                </p>
                            )}
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label>Session *</label>
                                <input
                                    type="text"
                                    name="session"
                                    value={formData.session}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2023-2024"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Semester *</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select semester</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Result File (PDF or Excel) *</label>
                            <input
                                type="file"
                                accept=".pdf,.xlsx,.xls"
                                onChange={handleFileChange}
                                required
                            />
                            {file && (
                                <p className="help-text" style={{ color: '#28a745', marginTop: '8px' }}>
                                    ✓ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                            <p className="help-text">
                                Upload PDF or Excel file containing full course results for all enrolled students
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Add any notes about this result file..."
                                rows="3"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="cancel-btn">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading || courses.length === 0} className="submit-btn">
                                {loading ? '⏳ Uploading...' : '📤 Upload Result'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="upload-history">
                        {uploadHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                <p>📄 No results uploaded yet</p>
                                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                                    Upload your first result file using the "Upload New" tab
                                </p>
                            </div>
                        ) : (
                            <div className="history-list">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Session</th>
                                            <th>Semester</th>
                                            <th>File</th>
                                            <th>Uploaded</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadHistory.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <strong>{item.courseId?.code}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>{item.courseId?.title}</small>
                                                </td>
                                                <td>{item.session}</td>
                                                <td>Semester {item.semester}</td>
                                                <td>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: item.fileType === 'pdf' ? '#dc3545' : '#28a745',
                                                        color: 'white',
                                                        fontSize: '12px',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {item.fileType}
                                                    </span>
                                                    <br />
                                                    <small style={{ color: '#666' }}>
                                                        {(item.fileSize / 1024).toFixed(2)} KB
                                                    </small>
                                                </td>
                                                <td>{new Date(item.uploadedAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="delete-btn"
                                                        style={{
                                                            padding: '6px 12px',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default UploadResultsModal;
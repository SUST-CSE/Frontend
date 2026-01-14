import { useState } from 'react';
import Modal from '../Modal/Modal';
import resultService from '../../api/services/resultService';
import '../admin/AdminModals.css';

const UploadResultsModal = ({ isOpen, onClose }) => {
    const [uploadMethod, setUploadMethod] = useState('manual');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [manualData, setManualData] = useState({
        studentId: '',
        courseId: '',
        marks: '',
        grade: '',
        semester: ''
    });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleManualChange = (e) => {
        setManualData({ ...manualData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            if (uploadMethod === 'excel') {
                if (!file) {
                    setError('Please select a file');
                    setLoading(false);
                    return;
                }
                formData.append('file', file);
                formData.append('type', 'excel');
            } else {
                formData.append('type', 'manual');
                Object.keys(manualData).forEach(key => {
                    formData.append(key, manualData[key]);
                });
            }

            const response = await resultService.uploadResults(formData);
            if (response.success) {
                setSuccess('Results uploaded successfully');
                setTimeout(() => {
                    onClose();
                    setSuccess('');
                    setFile(null);
                    setManualData({
                        studentId: '',
                        courseId: '',
                        marks: '',
                        grade: '',
                        semester: ''
                    });
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload results');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload Results">
            <div className="admin-modal-content">
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${uploadMethod === 'manual' ? 'active' : ''}`}
                        onClick={() => setUploadMethod('manual')}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`tab-btn ${uploadMethod === 'excel' ? 'active' : ''}`}
                        onClick={() => setUploadMethod('excel')}
                    >
                        Excel Upload
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    {uploadMethod === 'manual' ? (
                        <>
                            <div className="form-group">
                                <label>Student Registration No</label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={manualData.studentId}
                                    onChange={handleManualChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Course Code</label>
                                <input
                                    type="text"
                                    name="courseId"
                                    value={manualData.courseId}
                                    onChange={handleManualChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Marks</label>
                                <input
                                    type="number"
                                    name="marks"
                                    value={manualData.marks}
                                    onChange={handleManualChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Grade</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={manualData.grade}
                                    onChange={handleManualChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Semester</label>
                                <input
                                    type="text"
                                    name="semester"
                                    value={manualData.semester}
                                    onChange={handleManualChange}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label>Excel File</label>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                required
                            />
                            <p className="help-text">Upload .xlsx or .xls file with results data</p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default UploadResultsModal; 
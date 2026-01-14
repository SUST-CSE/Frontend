import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import adminService from '../../api/services/adminService';
import './AdminModals.css';

const ManageStudentsModal = ({ isOpen, onClose }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [bulkData, setBulkData] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStudents();
        }
    }, [isOpen]);

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminService.getRegistrations();
            if (response.success) {
                setStudents(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');

        try {
            const registrations = JSON.parse(bulkData);
            const response = await adminService.uploadRegistrations(registrations);

            if (response.success) {
                alert('Registrations uploaded successfully!');
                setBulkData('');
                setShowBulkUpload(false);
                fetchStudents();
            }
        } catch (err) {
            setError(err.message || 'Failed to upload registrations. Please check format.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (student) => {
        if (!confirm(`Delete registration for ${student.registrationId}?`)) return;

        try {
            const response = await adminService.deleteRegistration(student._id);
            if (response.success) {
                fetchStudents();
            }
        } catch (err) {
            setError(err.message || 'Failed to delete registration');
        }
    };

    const columns = [
        { header: 'Registration ID', accessor: 'registrationId' },
        { header: 'Session', accessor: 'session' },
        { header: 'Batch', accessor: 'batch' },
        {
            header: 'Status',
            accessor: 'isUsed',
            render: (value) => (
                <span className={`status-badge ${value ? 'used' : 'available'}`}>
                    {value ? 'Used' : 'Available'}
                </span>
            )
        },
        {
            header: 'Created',
            accessor: (item) => new Date(item.createdAt).toLocaleDateString()
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Student Registrations"
            size="large"
            footer={
                <div className="modal-footer-actions">
                    <button
                        onClick={() => setShowBulkUpload(!showBulkUpload)}
                        className="btn-primary"
                    >
                        {showBulkUpload ? 'Hide Bulk Upload' : 'Bulk Upload'}
                    </button>
                    <button onClick={fetchStudents} className="btn-secondary">
                        Refresh
                    </button>
                </div>
            }
        >
            {error && <div className="error-message">{error}</div>}

            {showBulkUpload && (
                <div className="bulk-upload-section">
                    <h3>Bulk Upload Registrations</h3>
                    <p className="help-text">
                        Submit an array of registration objects in JSON format. Each object should have: registrationId, session, and batch.
                    </p>
                    <form onSubmit={handleBulkUpload}>
                        <textarea
                            value={bulkData}
                            onChange={(e) => setBulkData(e.target.value)}
                            placeholder={`[\n  {"registrationId": "2021331001", "session": "2020-21", "batch": 1}\n]`}
                            rows={10}
                            className="bulk-textarea"
                            required
                        />
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowBulkUpload(false);
                                    setBulkData('');
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <DataTable
                data={students}
                columns={columns}
                loading={loading}
                emptyMessage="No student registrations found"
                searchPlaceholder="Search by registration ID or session..."
                onDelete={handleDelete}
            />
        </Modal>
    );
};

export default ManageStudentsModal;

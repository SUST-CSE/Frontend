import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import admissionService from '../../api/services/admissionService';
import './AdminModals.css';

const ManageAdmissionsModal = ({ isOpen, onClose }) => {
    const [admissions, setAdmissions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('admissions');
    const [formData, setFormData] = useState({
        title: '',
        session: '',
        description: '',
        startDate: '',
        endDate: '',
        requirements: '',
        eligibility: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedAdmissionId, setSelectedAdmissionId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchAdmissions();
        }
    }, [isOpen]);

    const fetchAdmissions = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await admissionService.getAdmissions();
            if (response.success) {
                setAdmissions(response.data);
            }
        } catch (err) {
            setError('Failed to load admissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (admissionId) => {
        setLoading(true);
        try {
            const response = await admissionService.getApplications(admissionId);
            if (response.success) {
                setApplications(response.data);
                setSelectedAdmissionId(admissionId);
                setActiveTab('applications');
            }
        } catch (err) {
            setError('Failed to load applications');
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
                await admissionService.updateAdmission(editingId, formData);
                alert('Admission updated successfully!');
            } else {
                await admissionService.createAdmission(formData);
                alert('Admission created successfully!');
            }

            resetForm();
            fetchAdmissions();
        } catch (err) {
            setError(err.message || 'Failed to save admission');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            session: item.session || '',
            description: item.description || '',
            startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
            endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
            requirements: item.requirements || '',
            eligibility: item.eligibility || ''
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!confirm(`Delete admission "${item.title}"?`)) return;

        try {
            await admissionService.deleteAdmission(item._id);
            fetchAdmissions();
        } catch (err) {
            setError(err.message || 'Failed to delete admission');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            session: '',
            description: '',
            startDate: '',
            endDate: '',
            requirements: '',
            eligibility: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const admissionColumns = [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'session', label: 'Session', sortable: true },
        {
            key: 'startDate',
            label: 'Start Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        },
        {
            key: 'endDate',
            label: 'End Date',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    const applicationColumns = [
        { key: 'applicantName', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: false },
        { key: 'phone', label: 'Phone', sortable: false },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (value) => (
                <span className={`status-badge ${value}`}>
                    {value}
                </span>
            )
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Admissions"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'admissions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admissions')}
                >
                    Admissions ({admissions.length})
                </button>
                {selectedAdmissionId && (
                    <button
                        className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications ({applications.length})
                    </button>
                )}
            </div>

            {activeTab === 'admissions' && (
                <>
                    <div className="section-actions">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary"
                        >
                            {showForm ? 'Cancel' : 'Create Admission'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., B.Sc. in CSE Admission 2024"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Session *</label>
                                    <input
                                        type="text"
                                        value={formData.session}
                                        onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                                        placeholder="2023-24"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    required
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
                        data={admissions}
                        columns={admissionColumns}
                        loading={loading}
                        emptyMessage="No admissions found"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={(item) => fetchApplications(item._id)}
                    />
                </>
            )}

            {activeTab === 'applications' && (
                <DataTable
                    data={applications}
                    columns={applicationColumns}
                    loading={loading}
                    emptyMessage="No applications found"
                    searchPlaceholder="Search applications..."
                />
            )}
        </Modal>
    );
};

export default ManageAdmissionsModal;

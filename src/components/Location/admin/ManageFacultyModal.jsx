import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import adminService from '../../api/services/adminService';
import facultyService from '../../api/services/facultyService';
import './AdminModals.css';
import teacherAuthService from '../../api/services/teacherAuthService';

const ManageFacultyModal = ({ isOpen, onClose }) => {
    const [faculty, setFaculty] = useState([]);
    const [pendingTeachers, setPendingTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('faculty');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        email: '',
        phone: '',
        department: 'CSE',
        officeRoom: '',
        specialization: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchFaculty();
            fetchPendingTeachers();
        }
    }, [isOpen]);

    const fetchFaculty = async () => {
        setLoading(true);
        try {
            const response = await teacherAuthService.getApprovedTeachers();
            if (response.success) {
                setFaculty(response.data);
            }
        } catch (err) {
            setError('Failed to load faculty');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingTeachers = async () => {
        try {
            const response = await teacherAuthService.getPendingTeachers();
            if (response.success) {
                setPendingTeachers(response.data);
            }
        } catch (err) {
            console.error('Failed to load pending teachers:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingId) {
                await facultyService.updateFaculty(editingId, formData);
                alert('Faculty updated successfully!');
            } else {
                await facultyService.createFaculty(formData);
                alert('Faculty created successfully!');
            }

            resetForm();
            fetchFaculty();
        } catch (err) {
            setError(err.message || 'Failed to save faculty');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name || '',
            designation: item.designation || '',
            email: item.email || '',
            phone: item.phone || '',
            department: item.department || 'CSE',
            officeRoom: item.officeRoom || '',
            specialization: item.specialization || ''
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!confirm(`Delete ${item.name}?`)) return;

        try {
            await facultyService.deleteFaculty(item._id);
            fetchFaculty();
        } catch (err) {
            setError(err.message || 'Failed to delete faculty');
        }
    };

    const handleApproveTeacher = async (teacher) => {
        try {
            await adminService.approveTeacher(teacher._id);
            alert(`${teacher.name} approved successfully!`);
            fetchPendingTeachers();
        } catch (err) {
            setError(err.message || 'Failed to approve teacher');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            designation: '',
            email: '',
            phone: '',
            department: 'CSE',
            officeRoom: '',
            specialization: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const facultyColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'designation', label: 'Designation', sortable: true },
        { key: 'email', label: 'Email', sortable: false },
        { key: 'phone', label: 'Phone', sortable: false },
        { key: 'officeRoom', label: 'Office', sortable: false }
    ];

    const teacherColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: false },
        { key: 'designation', label: 'Designation', sortable: true },
        { key: 'department', label: 'Department', sortable: true },
        {
            key: 'createdAt',
            label: 'Requested',
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Faculty"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'faculty' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faculty')}
                >
                    Faculty ({faculty.length})
                </button>
                <button
                    className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending Approvals ({pendingTeachers.length})
                </button>
            </div>

            {activeTab === 'faculty' && (
                <>
                    <div className="section-actions">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary"
                        >
                            {showForm ? 'Cancel' : 'Add Faculty'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Designation *</label>
                                    <input
                                        type="text"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Office Room</label>
                                    <input
                                        type="text"
                                        value={formData.officeRoom}
                                        onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <input
                                        type="text"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    />
                                </div>
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
                        data={faculty}
                        columns={facultyColumns}
                        loading={loading}
                        emptyMessage="No faculty members found"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </>
            )}

            {activeTab === 'pending' && (
                <DataTable
                    data={pendingTeachers}
                    columns={teacherColumns}
                    loading={loading}
                    emptyMessage="No pending teacher approvals"
                    onView={(teacher) => handleApproveTeacher(teacher)}
                    searchPlaceholder="Search pending teachers..."
                />
            )}
        </Modal>
    );
};

export default ManageFacultyModal;

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
    const [addAsTeacher, setAddAsTeacher] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        designation: '',
        email: '',
        password: '',
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
            const response = await facultyService.getFaculty();
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
                if (addAsTeacher) {
                    await teacherAuthService.createTeacher(formData);
                    alert('Teacher created successfully!');
                } else {
                    await facultyService.createFaculty(formData);
                    alert('Faculty created successfully!');
                }
            }

            resetForm();
            fetchFaculty();
        } catch (err) {
            let errorMessage = 'Failed to save faculty';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.status === 400) {
                if (err.response?.data?.error?.includes('E11000') || err.response?.data?.error?.includes('duplicate')) {
                    errorMessage = 'A faculty member with this email already exists. Please use a different email.';
                } else if (err.response?.data?.error?.includes('email')) {
                    errorMessage = 'Invalid email address or email already exists.';
                } else {
                    errorMessage = err.response.data.error || 'Validation failed. Please check your input.';
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            alert(errorMessage);
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
            employeeId: '',
            name: '',
            designation: '',
            email: '',
            password: '',
            phone: '',
            department: 'CSE',
            officeRoom: '',
            specialization: ''
        });
        setEditingId(null);
        setShowForm(false);
        setAddAsTeacher(false);
    };

    const facultyColumns = [
        { accessor: 'name', header: 'Name', sortable: true },
        { accessor: 'designation', header: 'Designation', sortable: true },
        { accessor: 'email', header: 'Email', sortable: false },
        { accessor: 'phone', header: 'Phone', sortable: false },
        { accessor: 'officeRoom', header: 'Office', sortable: false }
    ];

    const teacherColumns = [
        { accessor: 'name', header: 'Name', sortable: true },
        { accessor: 'email', header: 'Email', sortable: false },
        { accessor: 'designation', header: 'Designation', sortable: true },
        { accessor: 'department', header: 'Department', sortable: true },
        {
            accessor: 'createdAt',
            header: 'Requested',
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
                            {!editingId && (
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input
                                            type="checkbox"
                                            checked={addAsTeacher}
                                            onChange={(e) => setAddAsTeacher(e.target.checked)}
                                        />
                                        Add as Teacher (with login credentials)
                                    </label>
                                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                        {addAsTeacher
                                            ? 'This will create a teacher account with login access and require approval.'
                                            : 'This will create a faculty profile for display only (no login).'}
                                    </small>
                                </div>
                            )}

                            {addAsTeacher && !editingId && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Employee ID *</label>
                                        <input
                                            type="text"
                                            value={formData.employeeId}
                                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                            required={addAsTeacher}
                                            placeholder="EMP001"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password *</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required={addAsTeacher}
                                            placeholder="Minimum 6 characters"
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            )}

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

import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import noticeService from '../../api/services/noticeService';
import './AdminModals.css';

const ManageNoticesModal = ({ isOpen, onClose }) => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'announcement',
        targetAudience: 'all'
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNotices();
        }
    }, [isOpen]);

    const fetchNotices = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await noticeService.getNotices();
            if (response.success) {
                setNotices(response.data);
            }
        } catch (err) {
            setError('Failed to load notices');
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
                await noticeService.updateNotice(editingId, formData);
                alert('Notice updated successfully!');
            } else {
                await noticeService.createNotice(formData);
                alert('Notice created successfully!');
            }

            resetForm();
            fetchNotices();
        } catch (err) {
            setError(err.message || 'Failed to save notice');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            content: item.content || '',
            type: item.type || 'announcement',
            targetAudience: item.targetAudience || 'all'
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!confirm(`Delete notice "${item.title}"?`)) return;

        try {
            await noticeService.deleteNotice(item._id);
            fetchNotices();
        } catch (err) {
            setError(err.message || 'Failed to delete notice');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            type: 'announcement',
            targetAudience: 'all'
        });
        setEditingId(null);
        setShowForm(false);
    };

    const columns = [
        { key: 'title', label: 'Title', sortable: true },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
        },
        {
            key: 'targetAudience',
            label: 'Audience',
            sortable: true,
            render: (value) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
        },
        {
            key: 'createdAt',
            label: 'Posted',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Notices"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            <div className="section-actions">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : 'Create Notice'}
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
                            <label>Target Audience *</label>
                            <select
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                required
                            >
                                <option value="all">All</option>
                                <option value="session">Session Specific</option>
                                <option value="batch">Batch Specific</option>
                            </select>
                        </div>
                    </div>
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
                            {submitting ? 'Publishing...' : (editingId ? 'Update' : 'Publish')}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <DataTable
                data={notices}
                columns={columns}
                loading={loading}
                emptyMessage="No notices found"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(item) => alert(`${item.title}\n\n${item.content}`)}
            />
        </Modal>
    );
};

export default ManageNoticesModal;

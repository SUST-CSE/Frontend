import { useState } from 'react';
import Modal from '../Modal/Modal';
import noticeService from '../../api/services/noticeService';
import '../admin/AdminModals.css';

const CreateNoticeModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'announcement',
        targetAudience: 'all'
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        console.log("Testing notice modal")
        try {
            const response = await noticeService.createNotice(formData);
            console.log(response)
            if (response.success) {
                setSuccess(true);
                setFormData({
                    title: '',
                    content: '',
                    type: 'announcement',
                    targetAudience: 'all'
                });
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                }, 1500);
            }
        } catch (err) {
            setError(err.message || 'Failed to create notice');
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

import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import newsService from '../../api/services/newsService';
import apiClient from '../../api/client';
import './AdminModals.css';

const ManageNewsModal = ({ isOpen, onClose }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        image: '',
        url: '',
        isActive: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchNews();
        }
    }, [isOpen]);

    const fetchNews = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await newsService.getAllNews();
            if (response.success) {
                setNews(response.data);
            }
        } catch (err) {
            setError('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            let imagePath = formData.image;

            if (!imagePath && !imageFile) {
                setError('Please upload an image');
                setSubmitting(false);
                return;
            }

            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);
                const uploadResponse = await apiClient.post('/upload', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (uploadResponse.data.success) {
                    imagePath = uploadResponse.data.data.path;
                }
            }

            const newsData = { ...formData, image: imagePath };

            if (editingId) {
                await newsService.updateNews(editingId, newsData);
            } else {
                await newsService.createNews(newsData);
            }

            onClose();
            fetchNews();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save news');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                await newsService.deleteNews(id);
                fetchNews();
            } catch (err) {
                setError('Failed to delete news');
            }
        }
    };

    const handleEdit = (newsItem) => {
        setFormData({
            title: newsItem.title,
            excerpt: newsItem.excerpt,
            image: newsItem.image,
            url: newsItem.url || '',
            isActive: newsItem.isActive !== false
        });
        setEditingId(newsItem._id);
        setImagePreview(newsItem.image);
        setShowForm(true);
    };

    const columns = [
        { header: 'Title', accessor: 'title' },
        { header: 'Excerpt', accessor: 'excerpt' },
        { header: 'Date', accessor: (item) => new Date(item.createdAt).toLocaleDateString() },
        {
            header: 'Actions',
            accessor: (item) => (
                <div className="action-buttons">
                    <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                </div>
            )
        }
    ];

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage News">
            <div className="admin-modal-content">
                {error && <div className="error-message">{error}</div>}

                {!showForm ? (
                    <div className="list-view">
                        <div className="modal-header-actions">
                            <button
                                className="add-btn"
                                onClick={() => {
                                    setFormData({ title: '', excerpt: '', image: '', url: '', isActive: true });
                                    setEditingId(null);
                                    setImagePreview('');
                                    setShowForm(true);
                                }}
                            >
                                Add New News
                            </button>
                        </div>
                        <DataTable
                            columns={columns}
                            data={news}
                            loading={loading}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                required
                                rows={3}
                                placeholder="Short description of the news"
                            />
                        </div>

                        <div className="form-group">
                            <label>URL (optional)</label>
                            <input
                                type="text"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="Link to full article"
                            />
                        </div>

                        <div className="form-group">
                            <label>Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImageFile(file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting} className="submit-btn">
                                {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default ManageNewsModal;


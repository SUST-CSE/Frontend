import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import teacherAuthService from '../../api/services/teacherAuthService';
import apiClient from '../../api/client';
import '../student/ProfilePage.css';

const TeacherProfile = () => {
    const { user, updateUser } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
        department: '',
        phone: '',
        officeRoom: '',
        photo: '',
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await teacherAuthService.getProfile();
                if (response.success) {
                    const teacher = response.data;
                    setFormData({
                        name: teacher.name || '',
                        email: teacher.email || '',
                        designation: teacher.designation || '',
                        department: teacher.department || '',
                        phone: teacher.phone || '',
                        officeRoom: teacher.officeRoom || '',
                        photo: teacher.photo || teacher.profileImage || '',
                    });
                    if (teacher.photo || teacher.profileImage) {
                        setPhotoPreview(teacher.photo || teacher.profileImage);
                    }
                }
            } catch (err) {
                setMessage('Error loading profile: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage('Error: Photo size must be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setMessage('Error: Please upload an image file');
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        try {
            let photoUrl = formData.photo;

            if (photoFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', photoFile);
                const uploadResponse = await apiClient.post('/upload/image', uploadFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (uploadResponse.data.success) {
                    photoUrl = uploadResponse.data.data.url;
                }
            }

            const updatedData = { ...formData, photo: photoUrl };
            const response = await teacherAuthService.updateProfile(updatedData);

            if (response.success) {
                setMessage('Profile updated successfully');
                updateUser(response.data);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="back-btn"
                    style={{
                        marginBottom: '20px',
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid #000',
                        borderRadius: '0',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = '#000';
                        e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#000';
                    }}
                >
                    ← Back to Dashboard
                </button>
                <h2>My Profile</h2>
                {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-photo-section">
                        <div className="photo-preview">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile" />
                            ) : (
                                <div className="photo-placeholder">
                                    {formData.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            id="photo-upload"
                            hidden
                        />
                        <label htmlFor="photo-upload" className="upload-btn">
                            Change Photo
                        </label>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="disabled"
                            />
                        </div>

                        <div className="form-group">
                            <label>Designation</label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                disabled
                                className="disabled"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Office Room</label>
                            <input
                                type="text"
                                name="officeRoom"
                                value={formData.officeRoom}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="save-btn" disabled={updating}>
                        {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherProfile;
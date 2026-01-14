import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import authService from '../../api/services/authService';
import '../student/ProfilePage.css';

const AdminProfile = () => {
    const { user, updateUser } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                if (response.success) {
                    const admin = response.data;
                    setFormData({
                        username: admin.username || '',
                        email: admin.email || '',
                        role: admin.role || '',
                    });
                }
            } catch (err) {
                setMessage('Error loading profile: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="profile-page"><div className="loading">Loading profile...</div></div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {formData.username?.[0] || formData.email[0]}
                    </div>
                    <h1>Admin Profile</h1>
                    <p className="profile-subtitle">View your account information</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <div className="profile-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            disabled
                            className="readonly"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="readonly"
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <input
                            type="text"
                            value={formData.role}
                            disabled
                            className="readonly"
                            style={{ textTransform: 'capitalize' }}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

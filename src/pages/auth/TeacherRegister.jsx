import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import teacherAuthService from '../../api/services/teacherAuthService';
import './LoginPage.css';

const TeacherRegister = () => {
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        password: '',
        designation: '',
        department: 'CSE',
        phone: '',
        officeRoom: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await teacherAuthService.register(formData);
            if (response.success) {
                setSuccess('Registration submitted successfully! Your application is pending admin approval. You will be notified once approved.');
                setTimeout(() => navigate('/teacher/login'), 4000);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box" style={{ maxWidth: '600px' }}>
                <h2>Teacher Registration</h2>
                <p className="login-subtitle">Apply for Teaching Position</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label htmlFor="employeeId">Employee ID *</label>
                            <input
                                type="text"
                                id="employeeId"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                                placeholder="EMP001"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Dr. John Doe"
                            />
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="teacher@sust.edu"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+880 1712-345678"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Minimum 6 characters"
                            minLength={6}
                        />
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label htmlFor="designation">Designation *</label>
                            <select
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Designation</option>
                                <option value="Professor">Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Assistant Professor">Assistant Professor</option>
                                <option value="Lecturer">Lecturer</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department *</label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="CSE">Computer Science & Engineering</option>
                                <option value="EEE">Electrical & Electronic Engineering</option>
                                <option value="CE">Civil Engineering</option>
                                <option value="ME">Mechanical Engineering</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="officeRoom">Office Room</label>
                        <input
                            type="text"
                            id="officeRoom"
                            name="officeRoom"
                            value={formData.officeRoom}
                            onChange={handleChange}
                            placeholder="Room 301, Building A"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>

                <div className="login-links">
                    <Link to="/teacher/login">Already have an account? Login</Link>
                    <br />
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default TeacherRegister;

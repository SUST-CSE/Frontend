import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import studentAuthService from '../../api/services/studentAuthService';
import './LoginPage.css';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        registrationId: '',
        name: '',
        email: '',
        password: '',
        session: '',
        batch: '',
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
            const response = await studentAuthService.register({
                ...formData,
                batch: parseInt(formData.batch),
            });
            if (response.success) {
                setSuccess('Registration successful! Please check your email to verify your account.');
                setTimeout(() => navigate('/student/login'), 3000);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Student Registration</h2>
                <p className="login-subtitle">SUST CSE Academic Management System</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="registrationId">Registration ID</label>
                        <input
                            type="text"
                            id="registrationId"
                            name="registrationId"
                            value={formData.registrationId}
                            onChange={handleChange}
                            required
                            placeholder="2019331001"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="student@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="session">Session</label>
                        <input
                            type="text"
                            id="session"
                            name="session"
                            value={formData.session}
                            onChange={handleChange}
                            required
                            placeholder="2019-2020"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="batch">Batch</label>
                        <input
                            type="number"
                            id="batch"
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            required
                            placeholder="49"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <div className="login-links">
                    <Link to="/student/login">Already have an account? Login</Link>
                    <br />
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;

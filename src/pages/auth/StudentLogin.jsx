import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../../zustand/store';
import studentAuthService from '../../api/services/studentAuthService';
import './LoginPage.css';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login: storeLogin } = useStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await studentAuthService.login(email, password);
            if (response.success) {
                const userData = { ...response.data, role: 'student' };
                storeLogin(userData, response.data.token);
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Student Login</h2>
                <p className="login-subtitle">SUST CSE Academic Management System</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="student@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-links">
                    <Link to="/student/register">Don't have an account? Register</Link>
                    <br />
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;

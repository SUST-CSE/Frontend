import { useState } from 'react';
import { Link } from 'react-router-dom';
import './UniversalAuth.css';

const Login = () => {
    const [userType, setUserType] = useState('student');

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>
                <p className="auth-subtitle">SUST CSE Academic Management System</p>

                <div className="user-type-selector">
                    <button
                        className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                        onClick={() => setUserType('admin')}
                    >
                        Admin
                    </button>
                    <button
                        className={`type-btn ${userType === 'student' ? 'active' : ''}`}
                        onClick={() => setUserType('student')}
                    >
                        Student
                    </button>
                    <button
                        className={`type-btn ${userType === 'teacher' ? 'active' : ''}`}
                        onClick={() => setUserType('teacher')}
                    >
                        Teacher
                    </button>
                </div>

                <div className="auth-redirect">
                    {userType === 'admin' && (
                        <p>Redirecting to <Link to="/admin/login">Admin Login</Link></p>
                    )}
                    {userType === 'student' && (
                        <p>Redirecting to <Link to="/student/login">Student Login</Link></p>
                    )}
                    {userType === 'teacher' && (
                        <p>Redirecting to <Link to="/teacher/login">Teacher Login</Link></p>
                    )}
                </div>

                <div className="auth-links">
                    <Link to="/register">Don't have an account? Register</Link>
                    <br />
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default Login;

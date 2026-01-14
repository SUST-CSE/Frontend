import { useState } from 'react';
import { Link } from 'react-router-dom';
import './UniversalAuth.css';

const Register = () => {
    const [userType, setUserType] = useState('student');

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Register</h2>
                <p className="auth-subtitle">SUST CSE Academic Management System</p>

                <div className="user-type-selector">
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
                    {userType === 'student' && (
                        <p>Redirecting to <Link to="/student/register">Student Registration</Link></p>
                    )}
                    {userType === 'teacher' && (
                        <p>Note: Teacher registration requires admin approval. <Link to="/teacher/login">Login here</Link> if already registered.</p>
                    )}
                </div>

                <div className="auth-links">
                    <Link to="/login">Already have an account? Login</Link>
                    <br />
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default Register;

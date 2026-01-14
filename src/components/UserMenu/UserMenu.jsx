import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';
import { ROLES } from '../../utils/constants';
import './UserMenu.css';

const UserMenu = () => {
    const { isAuthenticated, user, logout } = useStore();
    const navigate = useNavigate();
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const loginRef = useRef(null);
    const registerRef = useRef(null);
    const profileRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getProfileLink = () => {
        if (!user) return '/';
        const role = (user.role || user.userType)?.toLowerCase();
        if (role === 'admin' || role === 'superadmin') {
            return '/admin/profile';
        } else if (role === 'student') {
            return '/student/profile';
        } else if (role === 'teacher') {
            return '/teacher/profile';
        }
        return '/';
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        const role = (user.role || user.userType)?.toLowerCase();
        if (role === 'admin' || role === 'superadmin') {
            return '/admin/dashboard';
        } else if (role === 'student') {
            return '/student/dashboard';
        } else if (role === 'teacher') {
            return '/teacher/dashboard';
        }
        return '/';
    };

    const getRoleLabel = () => {
        if (!user) return '';
        const role = user.role || user.userType;
        if (!role) return '';
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (loginRef.current && !loginRef.current.contains(event.target)) {
                setLoginOpen(false);
            }
            if (registerRef.current && !registerRef.current.contains(event.target)) {
                setRegisterOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isAuthenticated || !user) {
        return (
            <div className="user-menu">
                <div className="auth-dropdown" ref={loginRef}>
                    <button className="auth-btn" onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false); }}>
                        Login
                    </button>
                    {loginOpen && (
                        <div className="auth-dropdown-content">
                            <Link to="/admin/login" onClick={() => setLoginOpen(false)}>Admin Login</Link>
                            <Link to="/student/login" onClick={() => setLoginOpen(false)}>Student Login</Link>
                            <Link to="/teacher/login" onClick={() => setLoginOpen(false)}>Teacher Login</Link>
                        </div>
                    )}
                </div>

                <div className="auth-dropdown" ref={registerRef}>
                    <button className="auth-btn register" onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false); }}>
                        Register
                    </button>
                    {registerOpen && (
                        <div className="auth-dropdown-content">
                            <Link to="/student/register" onClick={() => setRegisterOpen(false)}>Student Register</Link>
                            <Link to="/teacher/register" onClick={() => setRegisterOpen(false)}>Teacher Register</Link>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`user-dropdown ${profileOpen ? 'active' : ''}`} ref={profileRef}>
            <div className="profile-icon" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="user-initial">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-name">
                    {user.name || user.username}
                    <span className="user-role-badge">{getRoleLabel()}</span>
                </div>
            </div>

            {profileOpen && (
                <div className="dropdown-content">
                    <div className="user-info">
                        <div className="user-role">{getRoleLabel()}</div>
                        <div className="user-email">{user.email}</div>
                    </div>
                    <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                        Dashboard
                    </Link>
                    <Link to={getProfileLink()} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                        My Profile
                    </Link>
                    <div className="logout-btn dropdown-item" onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;

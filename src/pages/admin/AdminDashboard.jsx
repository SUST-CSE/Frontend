import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import useStore from '../../zustand/store';
import ManageStudentsModal from '../../components/admin/ManageStudentsModal';
import ManageFacultyModal from '../../components/admin/ManageFacultyModal';
import ManageCoursesModal from '../../components/admin/ManageCoursesModal';
import ManageNewsModal from '../../components/admin/ManageNewsModal';
import ManageNoticesModal from '../../components/admin/ManageNoticesModal';
import AssignCourseModal from '../../components/admin/AssignCourseModal';
import './Dashboard.css';

const AdminDashboard = () => {
    const { user } = useStore();
    const [activeModal, setActiveModal] = useState(null);

    const closeModal = () => setActiveModal(null);

    return (
        <>
            <Navbar darkText={true} />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, {user?.username || 'Admin'}!</p>
                </div>

                <div className="dashboard-grid">
                    <Link to="/admin/profile" className="dashboard-card">
                        <div className="card-icon"></div>
                        <h3>My Profile</h3>
                        <p>View and manage your profile</p>
                    </Link>

                    <div className="dashboard-card" onClick={() => setActiveModal('students')}>
                        <div className="card-icon"></div>
                        <h3>Manage Students</h3>
                        <p>View and manage student records</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('faculty')}>
                        <div className="card-icon"></div>
                        <h3>Manage Faculty</h3>
                        <p>Add and manage faculty members</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('courses')}>
                        <div className="card-icon"></div>
                        <h3>Manage Courses</h3>
                        <p>Create and edit course information</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('assign-courses')}>
                        <div className="card-icon"></div>
                        <h3>Assign Courses</h3>
                        <p>Assign courses to teachers</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('news')}>
                        <div className="card-icon"></div>
                        <h3>Manage News</h3>
                        <p>Post news and announcements</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('notices')}>
                        <div className="card-icon"></div>
                        <h3>Manage Notices</h3>
                        <p>Create and publish notices</p>
                    </div>
                </div>
            </div>
            <Footer />

            { }
            <ManageStudentsModal isOpen={activeModal === 'students'} onClose={closeModal} />
            <ManageFacultyModal isOpen={activeModal === 'faculty'} onClose={closeModal} />
            <ManageCoursesModal isOpen={activeModal === 'courses'} onClose={closeModal} />
            <AssignCourseModal isOpen={activeModal === 'assign-courses'} onClose={closeModal} />
            <ManageNewsModal isOpen={activeModal === 'news'} onClose={closeModal} />
            <ManageNoticesModal isOpen={activeModal === 'notices'} onClose={closeModal} />
        </>
    );
};

export default AdminDashboard;

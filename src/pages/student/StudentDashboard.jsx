import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import useStore from '../../zustand/store';
import MyResultsModal from '../../components/student/MyResultsModal';
import NoticesModal from '../../components/student/NoticesModal';
import CoursesModal from '../../components/student/CoursesModal';
import './Dashboard.css';

const StudentDashboard = () => {
    const { user } = useStore();
    const [activeModal, setActiveModal] = useState(null);

    const closeModal = () => setActiveModal(null);

    return (
        <>
            <Navbar darkText={true} />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Student Dashboard</h1>
                    <p>Welcome, {user?.name || 'Student'}!</p>
                </div>

                <div className="dashboard-grid">


                    <div className="dashboard-card" onClick={() => setActiveModal('results')}>
                        <div className="card-icon"></div>
                        <h3>My Results</h3>
                        <p>Download result files from teachers</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('notices')}>
                        <div className="card-icon"></div>
                        <h3>Notices</h3>
                        <p>View important notices</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('courses')}>
                        <div className="card-icon"></div>
                        <h3>My Courses</h3>
                        <p>View enrolled courses & request new courses</p>
                    </div>
                </div>
            </div>
            <Footer />

            { }
            <MyResultsModal isOpen={activeModal === 'results'} onClose={closeModal} />
            <NoticesModal isOpen={activeModal === 'notices'} onClose={closeModal} />
            <CoursesModal isOpen={activeModal === 'courses'} onClose={closeModal} />
        </>
    );
};

export default StudentDashboard;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import useStore from '../../zustand/store';
import CreateNoticeModal from '../../components/teacher/CreateNoticeModal';
import UploadResultsModal from '../../components/teacher/UploadResultsModal';
import MyCoursesModal from '../../components/teacher/MyCoursesModal';
import StudentsModal from '../../components/teacher/StudentsModal';
import EnrollmentRequestsModal from '../../components/teacher/EnrollmentRequestsModal';
import './Dashboard.css';

const TeacherDashboard = () => {
    const { user } = useStore();
    const [activeModal, setActiveModal] = useState(null);

    const closeModal = () => setActiveModal(null);

    return (
        <>
            <Navbar darkText={true} />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Teacher Dashboard</h1>
                    <p>Welcome, {user?.name || 'Teacher'}!</p>
                </div>

                <div className="dashboard-grid">


                    <div className="dashboard-card" onClick={() => setActiveModal('enrollment-requests')}>
                        <div className="card-icon"></div>
                        <h3>Enrollment Requests</h3>
                        <p>Approve/reject student course requests</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('notice')}>
                        <div className="card-icon"></div>
                        <h3>Create Notice</h3>
                        <p>Post notices for students</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('results')}>
                        <div className="card-icon"></div>
                        <h3>Upload Results</h3>
                        <p>Upload student results</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('courses')}>
                        <div className="card-icon"></div>
                        <h3>My Courses</h3>
                        <p>View teaching courses</p>
                    </div>

                    <div className="dashboard-card" onClick={() => setActiveModal('students')}>
                        <div className="card-icon"></div>
                        <h3>My Students</h3>
                        <p>View students enrolled in your courses</p>
                    </div>

                </div>
            </div>
            <Footer />

            { }
            <EnrollmentRequestsModal isOpen={activeModal === 'enrollment-requests'} onClose={closeModal} />
            <CreateNoticeModal isOpen={activeModal === 'notice'} onClose={closeModal} />
            <UploadResultsModal isOpen={activeModal === 'results'} onClose={closeModal} />
            <MyCoursesModal isOpen={activeModal === 'courses'} onClose={closeModal} />
            <StudentsModal isOpen={activeModal === 'students'} onClose={closeModal} />
        </>
    );
};

export default TeacherDashboard;

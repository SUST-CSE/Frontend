import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import courseService from '../../api/services/courseService';
import '../admin/AdminModals.css';

const CoursesModal = ({ isOpen, onClose }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
    }, [isOpen]);

    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await courseService.getCourses();
            if (response.success) {
                setCourses(response.data);
            }
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = filterLevel === 'all'
        ? courses
        : courses.filter(c => c.level === filterLevel);

    const handleView = (course) => {
        alert(`${course.code} - ${course.title}\n\nCredits: ${course.credits}\nLevel: ${course.level}\nTerm: ${course.term}\nType: ${course.type}\n\n${course.description || 'No description available'}`);
    };

    const columns = [
        { key: 'code', label: 'Course Code', sortable: true },
        { key: 'title', label: 'Course Title', sortable: true },
        { key: 'credits', label: 'Credits', sortable: true },
        { key: 'level', label: 'Level', sortable: true },
        { key: 'term', label: 'Term', sortable: true },
        { key: 'type', label: 'Type', sortable: true }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Courses"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            <div className="filter-section" style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, marginRight: '12px' }}>Filter by Level:</label>
                <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    style={{ padding: '8px 12px', border: '2px solid #000', borderRadius: '4px' }}
                >
                    <option value="all">All Levels</option>
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                </select>
            </div>

            <DataTable
                data={filteredCourses}
                columns={columns}
                loading={loading}
                emptyMessage="No courses found"
                onView={handleView}
                searchPlaceholder="Search courses..."
            />
        </Modal>
    );
};

export default CoursesModal;

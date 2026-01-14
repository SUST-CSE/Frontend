import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import noticeService from '../../api/services/noticeService';
import '../admin/AdminModals.css';

const NoticesModal = ({ isOpen, onClose }) => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        if (isOpen) {
            fetchNotices();
        }
    }, [isOpen, filterType]);

    const fetchNotices = async () => {
        setLoading(true);
        setError('');
        try {
            // Build filters - backend handles student filtering automatically
            const filters = {};

            // Add type filter if not 'all'
            if (filterType !== 'all') {
                filters.type = filterType;
            }

            const response = await noticeService.getNotices(filters);

            if (response.success) {
                setNotices(response.data);
            }
        } catch (err) {
            setError('Failed to load notices');
            console.error('Error fetching notices:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (notice) => {
        let targetInfo = 'All Students';
        if (notice.targetType === 'course' && notice.targetCourseId) {
            targetInfo = `Course: ${notice.targetCourseId.code} - ${notice.targetCourseId.title}`;
        } else if (notice.targetType === 'student' && notice.targetStudentId) {
            targetInfo = `Individual: ${notice.targetStudentId.name} (${notice.targetStudentId.registrationId})`;
        }

        alert(`${notice.title}\n\n${notice.content}\n\nTarget: ${targetInfo}\nPosted: ${new Date(notice.createdAt).toLocaleString()}`);
    };

    const columns = [
        { accessor: 'title', header: 'Title', sortable: true },
        {
            accessor: 'type',
            header: 'Type',
            sortable: true,
            render: (value) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
        },
        {
            accessor: 'targetType',
            header: 'For',
            render: (value, row) => {
                if (value === 'all') return '🌐 All';
                if (value === 'course' && row.targetCourseId) {
                    return `📚 ${row.targetCourseId.code}`;
                }
                if (value === 'student') return '👤 You';
                return '-';
            }
        },
        {
            accessor: 'createdAt',
            header: 'Posted',
            sortable: true,
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Notices"
            size="large"
        >
            {error && <div className="error-message">{error}</div>}

            <div className="filter-section" style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, marginRight: '12px' }}>Filter by Type:</label>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ padding: '8px 12px', border: '2px solid #000', borderRadius: '4px' }}
                >
                    <option value="all">All</option>
                    <option value="announcement">Announcement</option>
                    <option value="assignment">Assignment</option>
                    <option value="event">Event</option>
                    <option value="routine">Routine</option>
                </select>
            </div>
            <DataTable
                data={notices}
                columns={columns}
                loading={loading}
                emptyMessage="No notices found"
                onView={handleView}
                searchPlaceholder="Search notices..."
            />
        </Modal>
    );
};

export default NoticesModal;

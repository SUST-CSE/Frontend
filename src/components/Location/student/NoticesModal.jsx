import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import DataTable from '../DataTable/DataTable';
import noticeService from '../../api/services/noticeService';
import useStore from '../../zustand/store';
import '../admin/AdminModals.css';

const NoticesModal = ({ isOpen, onClose }) => {
    const { user } = useStore();
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
        console.log("Notice modal check")
        try {
            const filters = filterType !== 'all' ? { type: filterType } : {};
            const response = await noticeService.getNotices(filters);
            console.log(response);
            if (response.success) {
                setNotices(response.data);
            }
        } catch (err) {
            setError('Failed to load notices');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (notice) => {
        alert(`${notice.title}\n\n${notice.content}\n\nPosted: ${new Date(notice.createdAt).toLocaleString()}`);
    };

    const columns = [
        { key: 'title', label: 'Title', sortable: true },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            render: (value) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
        },
        {
            key: 'createdAt',
            label: 'Posted',
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

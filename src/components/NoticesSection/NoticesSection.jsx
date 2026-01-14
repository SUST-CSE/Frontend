import { useState, useEffect } from 'react';
import noticeService from '../../api/services/noticeService';
import './NoticesSection.css';

const NoticesSection = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await noticeService.getNotices();
            if (response.success) {
                setNotices(response.data || []);
            }
        } catch (err) {
            console.error('Failed to load notices');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="notices-loading">Loading notices...</div>;
    }

    if (notices.length === 0) {
        return null;
    }

    return (
        <section className="notices-section">
            <div className="section-header">
                <h2>Important Notices</h2>
                <p>Stay informed with the latest announcements</p>
            </div>

            <div className="notices-grid">
                {notices.slice(0, 6).map((notice) => (
                    <div key={notice._id} className="notice-card">
                        <div className="notice-date">
                            {new Date(notice.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="notice-title">{notice.title}</h3>
                        <p className="notice-content">{notice.content?.substring(0, 150)}...</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NoticesSection;
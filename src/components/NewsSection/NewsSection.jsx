import { useState, useEffect } from 'react';
import newsService from '../../api/services/newsService';
import './NewsSection.css';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await newsService.getNews();
            if (response.success) {
                setNews(response.data || []);
            }
        } catch (err) {
            console.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="news-loading">Loading news...</div>;
    }

    if (news.length === 0) {
        return null;
    }

    const duplicatedNews = [...news, ...news];

    return (
        <section className="news-section">
            <div className="section-header">
                <h2>Latest News</h2>
                <p>Stay updated with the latest happenings</p>
            </div>

            <div className="slider-container">
                <div className="news-track">
                    {duplicatedNews.map((item, index) => (
                        <div key={`${item._id}-${index}`} className="news-card">
                            {item.image && (
                                <div className="news-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                            )}
                            <div className="news-content">
                                <div className="news-top-bar">
                                    <span className="news-category">{item.category || 'News'}</span>
                                    <span className="news-date">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-excerpt">{item.content?.substring(0, 100)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
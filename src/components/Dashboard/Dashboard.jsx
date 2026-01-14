import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

const sampleNews = [
  {
    id: "1",
    title: "Champions of MU CSE Fest 2024",
    excerpt:
      "Champions of MU CSE Fest 2024 - Inter University Programming Contest - Sylhet Division. Members : Abdullah Al Mahmud, Jawad Aziz Chowdhury, Rafid Bin Nasim Soccho.",
    image: "/public/images/news1.png",
    url: "/news/1",
  },
  {
    id: "2",
    title: "Versity is full of fun.",
    excerpt: "সেই চিল আর চিল",
    image: "/public/images/news2.png",
    url: "/news/2",
  },
  {
    id: "3",
    title: "ICPC World Finals Participation",
    excerpt: "Wishing our brilliant minds from Team SUST_Fanatics the very best as they represent SUST on the global stage at the 49th ICPC World Finals!",
    image: "/public/images/news3.png",
    url: "/news/3",
  },
];

export default function Dashboard({ items = sampleNews, interval = 5000, onReadMore }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const startTimer = () => {
    stopTimer();
    if (progressRef.current) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.width = '0%';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = `width ${interval}ms linear`;
          progressRef.current.style.width = '100%';
        }
      }, 50);
    }
    timerRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!paused) {
      startTimer();
    }
    return () => stopTimer();
  }, [index, paused, items.length, interval]);

  const goTo = (i) => {
    setIndex(i);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setIndex((prev) => (prev + 1) % items.length);
      } else {
        setIndex((prev) => (prev - 1 + items.length) % items.length);
      }
    }
  };

  return (
    <div
      className="dashboard"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slides">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`slide ${i === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="overlay" />
            <div className="content">
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
              {onReadMore && (
                <button
                  className="read-more-btn"
                  onClick={() => onReadMore(item)}
                >
                  Read More
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="indicators">
        {items.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className="progress-bar">
        <div className="progress" ref={progressRef} />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      image: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  interval: PropTypes.number,
  onReadMore: PropTypes.func,
};
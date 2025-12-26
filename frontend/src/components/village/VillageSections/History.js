import React, { useEffect, useRef } from 'react';

const History = ({ data }) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    if (timelineRef.current) {
      const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
      timelineItems.forEach(item => observer.observe(item));
    }

    return () => observer.disconnect();
  }, []);

  // Add loading state
  if (!data) {
    return (
      <section className="history-section">
        <div className="section-inner">
          <div className="section-title">
            <h2>Historical Timeline</h2>
          </div>
          <div className="timeline-loading">Loading history...</div>
        </div>
      </section>
    );
  }

  // Ensure data is an array
  const timelineData = Array.isArray(data) ? data : [];

  return (
    <section className="history-section">
      <div className="section-inner">
        <div className="section-title">
          <h2>Historical Timeline</h2>
        </div>
        {timelineData.length === 0 ? (
          <div className="timeline-empty">No historical data available</div>
        ) : (
          <div className="timeline" ref={timelineRef}>
            {timelineData.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-content">
                  <div className="timeline-period">{item.era}</div>
                  <div className="timeline-description">{item.description}</div>
                  {item.events && Array.isArray(item.events) && (
                    <ul className="timeline-events">
                      {item.events.map((event, eventIndex) => (
                        <li key={eventIndex}>{event}</li>
                      ))}
                    </ul>
                  )}
                  {item.image && (
                    <div className="timeline-image">
                      <img src={item.image} alt={item.era} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default History;
import React from 'react';

const Temples = ({ data }) => {
  const temples = Array.isArray(data) ? data : [];

  return (
    <section className="temples">
      <div className="section-inner">
        <div className="section-title">
          <h2>Sacred Sites</h2>
        </div>
        
        {temples.length === 0 ? (
          <div className="empty-state">No temple information available.</div>
        ) : (
          <div className="temple-grid">
            {temples.map((temple, index) => (
              <div key={index} className="card">
                <img src={temple.image} alt={temple.name} loading="lazy" />
                <div className="card-content">
                  <h3>{temple.name}</h3>
                  <p>{temple.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Temples;
import React from 'react';

const Geography = ({ data }) => {
  const features = data?.features || [];

  return (
    <section className="geography">
      <div className="container">
        <div className="section-title">
          <h2>Natural Treasures</h2>
        </div>
        
        {features.length === 0 ? (
          <div className="empty-state">Geographical features are not available.</div>
        ) : (
          <div className="geo-features">
            {features.map((feature, index) => (
              <div key={index} className="card">
                <img src={feature.image} alt={feature.title} loading="lazy" />
                <div className="card-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Geography;
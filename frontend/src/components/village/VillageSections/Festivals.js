import React from 'react';

const Festivals = ({ data }) => {
  const festivals = Array.isArray(data) ? data : [];

  return (
    <section className="festivals">
      <div className="container">
        <div className="section-title">
          <h2>Major Festivals</h2>
        </div>
        
        {festivals.length === 0 ? (
          <div className="empty-state">No festival information available.</div>
        ) : (
          <div className="name-breakdown">
            {festivals.map((festival, index) => (
              <div key={index} className="card">
                <img src={festival.image} alt={festival.name} loading="lazy" />
                <div className="card-content">
                  <h3>{festival.name}</h3>
                  <p>{festival.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Festivals;
import React from 'react';

const Facts = ({ data }) => {
  const facts = Array.isArray(data) ? data : [];

  return (
    <section className="facts">
      <div className="section-inner">
        <div className="section-title">
          <h2>Divine Miracles & Facts</h2>
        </div>
        
        {facts.length === 0 ? (
          <div className="empty-state">No facts available.</div>
        ) : (
          <div className="facts-grid">
            {facts.map((fact, index) => (
              <div key={index} className="fact-card">
                <h3>{fact.title}</h3>
                <p>{fact.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Facts;
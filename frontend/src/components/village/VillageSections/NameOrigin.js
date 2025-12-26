import React from 'react';

const NameOrigin = ({ data }) => {
  // Handle case when data is undefined or null
  if (!data) {
    return (
      <section className="name-origin">
        <div className="container">
          <div className="section-title">
            <h2>Name Origin</h2>
          </div>
          <div className="name-breakdown">
            <div className="card">
              <div className="card-content">
                <p>Name origin information is not available for this village.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="name-origin">
      <div className="section-inner">
        <div className="section-title">
          <h2>Why "{data.title || 'This Village'}"?</h2>
        </div>
        
        <div className="name-breakdown">
          <div className="card">
            <div className="card-content">
              <h3>{data.part1?.title || "Name Breakdown"}</h3>
              <p>{data.part1?.description || ""}</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <h3>{data.part2?.title || "Meaning"}</h3>
              <p>{data.part2?.description || ""}</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <h3>{data.part3?.title || "Divine Interpretation"}</h3>
              <p>{data.content || ""}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NameOrigin;
import React from 'react';
import PropTypes from 'prop-types';

const Economy = ({ data }) => {
  // Add null check for data
  if (!data) {
    return (
      <section className="economy">
        <div className="container">
          <div className="section-title">
            <h2>Local Economy</h2>
          </div>
          <p>Loading economic data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="economy">
      <div className="section-inner">
        <div className="section-title">
          <h2>Local Economy</h2>
        </div>
        
        <div className="name-breakdown">
          <div className="card">
            <img 
              src={data?.image || '/default-agriculture.jpg'} 
              alt="Agriculture" 
              loading="lazy" 
            />
            <div className="card-content">
              <h3>Agriculture</h3>
              <p>{data?.agriculture || 'Agricultural information not available'}</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <h3>Livelihoods</h3>
              <p>{data?.livelihoods || 'Livelihood information not available'}</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-content">
              <h3>Traditional Crafts</h3>
              <p>{data?.traditionalCrafts || 'Local artisans preserve ancient crafts passed down through generations.'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add PropTypes for type checking
Economy.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string,
    agriculture: PropTypes.string,
    livelihoods: PropTypes.string,
    traditionalCrafts: PropTypes.string
  })
};

export default Economy;
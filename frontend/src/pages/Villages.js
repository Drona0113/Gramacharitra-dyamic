import React from 'react';
import { useVillages } from '../context/VillageContext';
import VillageCard from '../components/common/VillageCard';

const Villages = () => {
  const { villages, loading } = useVillages();

  return (
    <div className="villages-page">
      <div className="container">
        <section id="all-villages">
          <div className="section-title">
            <h2>Discover Sacred Villages</h2>
          </div>
          {loading ? (
            <div className="loading">Loading villages...</div>
          ) : (
            <div className="village-grid">
              {villages.map(village => (
                <VillageCard key={village._id} village={village} hideManageButton={true} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Villages; 
import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import NameOrigin from './VillageSections/NameOrigin';
import History from './VillageSections/History';
import Geography from './VillageSections/Geography';
import Temples from './VillageSections/Temples';
import Festivals from './VillageSections/Festivals';
import Economy from './VillageSections/Economy';
import VillageProfile from './VillageSections/VillageProfile';
import Facts from './VillageSections/Facts';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './VillageDetail.css';

const VillageDetail = () => {
  const { id } = useParams();
  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);
  // For anchor-style navigation highlighting (optional future)
  const [activeSection, setActiveSection] = useState('');
  
  // Define scrollTo callback before any early return to satisfy hooks rules
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }, []);

  useEffect(() => {
    const fetchVillage = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/villages/${id}`);
        setVillage(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVillage();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading village details...</div>;
  }

  if (!village) {
    return <div className="error">Village not found</div>;
  }

  return (
    <div className="village-detail-page">
      {/* Banner Section */}
      <div className="village-banner">
        <img className="village-banner-img" src={village.image} alt={village.name} />
        <div className="village-banner-overlay" />
        <div className="village-banner-content">
          <h1 className="village-title">{village.name}</h1>
          <div className="village-district">{village.district} District, Andhra Pradesh</div>
          <p className="village-description">{village.description}</p>
        </div>
      </div>

      {/* Section Navigation */}
      <nav className="village-nav green-nav">
        <ul>
          <li>
            <button 
              className={activeSection === 'name-origin' ? 'active' : ''}
              onClick={() => scrollTo('name-origin')}
            >
              <i className="fas fa-id-card"></i> Name Origin
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'history' ? 'active' : ''}
              onClick={() => scrollTo('history')}
            >
              <i className="fas fa-landmark"></i> History
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'nature' ? 'active' : ''}
              onClick={() => scrollTo('nature')}
            >
              <i className="fas fa-seedling"></i> Nature
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'sacred-sites' ? 'active' : ''}
              onClick={() => scrollTo('sacred-sites')}
            >
              <i className="fas fa-om"></i> Sacred Sites
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'festivals' ? 'active' : ''}
              onClick={() => scrollTo('festivals')}
            >
              <i className="fas fa-fire"></i> Festivals
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'economy' ? 'active' : ''}
              onClick={() => scrollTo('economy')}
            >
              <i className="fas fa-rupee-sign"></i> Local Economy
            </button>
          </li>
          <li>
            <button 
              className={activeSection === 'facts' ? 'active' : ''}
              onClick={() => scrollTo('facts')}
            >
              <i className="fas fa-info-circle"></i> Little-Known Facts
            </button>
          </li>
        </ul>
      </nav>

      {/* Section Content */}
      <main className="village-content green-section">
        <section id="name-origin">
          <NameOrigin data={village.sections.nameOrigin} />
        </section>

        <section id="history">
          <History data={village.sections.history?.timeline} />
        </section>

        <section id="nature">
          <Geography data={village.sections.geography} />
        </section>

        <section id="sacred-sites">
          <Temples data={village.sections.temples} />
        </section>

        <section id="festivals">
          <Festivals data={village.sections.festivals} />
        </section>

        <section id="economy">
          <Economy data={village.sections.economy} />
        </section>

        <section id="facts">
          <Facts data={village.sections.facts} />
        </section>

        {/* Hidden from nav but available if needed */}
        {village.sections.profile && (
          <section id="profile" style={{ display: 'none' }}>
            <VillageProfile data={village.sections.profile} />
          </section>
        )}
      </main>

      {/* User Reviews */}
      <div className="village-reviews green-section">
        <h2><i className="fas fa-comments"></i> User Reviews</h2>
        <ReviewForm villageId={village._id} />
        <ReviewList villageId={village._id} />
      </div>

      {/* Footer/Map */}
      <footer className="village-footer">
        <p className="footer-quote">
          "Every village has a story to tell, a tradition to preserve, and a heritage to celebrate."
        </p>
        <a 
          href={`https://www.google.com/maps?q=${village.location.coordinates[1]},${village.location.coordinates[0]}`} 
          className="map-btn" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i className="fas fa-map-marker-alt"></i> View on Google Maps
        </a>
      </footer>
    </div>
  );
};

export default VillageDetail;
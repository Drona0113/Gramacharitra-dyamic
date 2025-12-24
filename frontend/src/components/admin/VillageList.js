import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const VillageList = ({ onEdit }) => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await api.get('/villages');
      setVillages(response.data);
    } catch (err) {
      setError('Failed to fetch villages');
      console.error('Error fetching villages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVillage = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/villages/${id}`);
        setVillages(villages.filter(village => village._id !== id));
        alert('Village deleted successfully!');
      } catch (err) {
        console.error('Error deleting village:', err);
        alert('Failed to delete village. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading villages...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="village-list-container">
      <div className="village-grid">
        {villages.length === 0 ? (
          <div className="no-villages">
            <p>No villages found. Add a new village to get started.</p>
          </div>
        ) : (
          villages.map(village => (
            <div key={village._id} className="village-card admin-village-card">
              <div className="village-image">
                <img 
                  src={village.image} 
                  alt={village.name}
                  onError={(e) => {
                    e.target.src = '/images/gramacharitra.jpg';
                  }}
                />
              </div>
              <div className="village-info">
                <h3>{village.name}</h3>
                <p className="district">{village.district} District</p>
                <p className="description">{village.description.substring(0, 100)}...</p>
                
                <div className="admin-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(village)}
                    title="Edit Village"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteVillage(village._id, village.name)}
                    title="Delete Village"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                  <a 
                    href={`/village/${village._id}`}
                    className="btn-view"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Village"
                  >
                    <i className="fas fa-eye"></i> View
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VillageList;
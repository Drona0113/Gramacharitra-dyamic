import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useVillages } from '../../context/VillageContext';

const VillageCard = ({ village, showAdminActions = false, onEdit, onDelete, hideManageButton = false }) => {
  const { user } = useAuth();
  const { deleteVillage } = useVillages();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${village.name}"? This action cannot be undone.`)) {
      try {
        await deleteVillage(village._id);
        if (onDelete) onDelete(village._id);
        alert('Village deleted successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to delete village. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(village);
    } else {
      alert('Edit functionality is not available on this page. Please go to the Admin Dashboard to edit villages.');
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`village-card modern-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-image-container">
        <img 
          src={imageError ? '/images/gramacharitra.jpg' : village.image} 
          alt={village.name} 
          loading="lazy"
          onError={handleImageError}
          className="card-image"
        />
        <div className="image-overlay"></div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="village-name">{village.name}</h3>
          <span className="village-district">{village.district} District</span>
        </div>
        
        <p className="village-description">
          {village.description.length > 120 
            ? `${village.description.substring(0, 120)}...` 
            : village.description}
        </p>
        
        <div className="card-actions">
          <Link to={`/village/${village._id}`} className="btn-explore">
            <i className="fas fa-eye"></i>
            Explore Village
          </Link>
          
          {user && showAdminActions && onEdit && (
            <div className="admin-actions">
              <button 
                onClick={handleEdit}
                className="btn-edit"
                title="Edit Village"
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="btn-delete"
                title="Delete Village"
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          )}
          
          {user && user.role && user.role === 'admin' && !hideManageButton && (
            <div className="quick-admin-actions">
              <Link 
                to={`/admin`}
                className="btn-admin"
                title="Admin Panel"
              >
                <i className="fas fa-cog"></i>
                Manage
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {isHovered && (
        <div className="hover-overlay">
          <div className="hover-content">
            <h4>Quick Facts</h4>
            <ul>
              <li><i className="fas fa-map-marker-alt"></i> {village.district} District</li>
              {village.sections?.profile?.population && (
                <li><i className="fas fa-users"></i> Population: {village.sections.profile.population}</li>
              )}
              {village.sections?.profile?.nearestTown && (
                <li><i className="fas fa-road"></i> Near: {village.sections.profile.nearestTown}</li>
              )}
              {village.sections?.temples?.length > 0 && (
                <li><i className="fas fa-temple-buddhist"></i> {village.sections.temples.length} Temples</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageCard;
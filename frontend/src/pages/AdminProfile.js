import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import api from '../services/api';
import './AdminProfile.css';

const AdminProfile = () => {
    const { adminUser, logoutAdmin } = useAdmin();
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchVillages();
    }, []);

    const fetchVillages = async () => {
        try {
            setLoading(true);
            const res = await api.get('/villages');
            setVillages(res.data);
        } catch (error) {
            setError('Failed to fetch villages');
            console.error('Error fetching villages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVillage = async (villageId, villageName) => {
        if (window.confirm(`Are you sure you want to delete "${villageName}"?`)) {
            try {
                await api.delete(`/villages/${villageId}`);
                setVillages(villages.filter(village => village._id !== villageId));
                alert('Village deleted successfully!');
            } catch (error) {
                alert('Failed to delete village');
                console.error('Error deleting village:', error);
            }
        }
    };

    const handleEditVillage = (villageId) => {
        navigate(`/admin/edit-village/${villageId}`);
    };

    const handleLogout = () => {
        logoutAdmin();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading villages...</p>
            </div>
        );
    }

    return (
        <div className="admin-profile">
            <div className="admin-profile-header">
                <div className="admin-info">
                    <h1>Admin Profile</h1>
                    <p>Welcome, {adminUser?.name || 'Admin'}</p>
                    <p className="admin-email">{adminUser?.email}</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="add-village-btn"
                        onClick={() => navigate('/admin/add-village')}
                    >
                        + Add Village
                    </button>
                    <button 
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="villages-section">
                <h2>Manage Villages ({villages.length})</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="villages-grid">
                    {villages.map(village => (
                        <div key={village._id} className="village-card">
                            <div className="village-image">
                                {village.image ? (
                                    <img 
                                        src={village.image} 
                                        alt={village.name}
                                        onError={(e) => {
                                            e.target.src = '/images/gramacharitra.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="no-image-placeholder">
                                        <span>📍</span>
                                        <p>No Image</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="village-content">
                                <h3>{village.name}</h3>
                                <p className="village-location">
                                    <span className="district">{village.district}</span>
                                </p>
                                <p className="village-description">
                                    {village.description || 'No description available'}
                                </p>
                                <p className="village-date">
                                    Created: {village.createdAt ? new Date(village.createdAt).toLocaleDateString() : '—'}
                                </p>
                            </div>

                            <div className="village-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEditVillage(village._id)}
                                >
                                    ✏️ Edit
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteVillage(village._id, village.name)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {villages.length === 0 && !loading && (
                    <div className="no-villages">
                        <p>No villages found. Start by adding your first village!</p>
                        <button 
                            className="add-first-village-btn"
                            onClick={() => navigate('/admin/add-village')}
                        >
                            Add Your First Village
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProfile;
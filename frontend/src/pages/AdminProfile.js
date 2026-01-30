import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import api from '../services/api';
import './AdminProfile.css';

const AdminProfile = () => {
    const { adminUser, logoutAdmin, getCurrentAdmin } = useAdmin();
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileKey, setProfileKey] = useState(0); // Force re-render
    const [lastUpdate, setLastUpdate] = useState(Date.now()); // Track updates
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('AdminProfile - Component mounted or navigation changed');
        console.log('AdminProfile - Current adminUser on mount:', adminUser);
        // Refresh admin user data when component mounts or navigation changes
        refreshAdminData();
        fetchVillages();
    }, [location.pathname]); // Add location.pathname as dependency

    // Add focus event listener to detect when user returns to tab after login
    useEffect(() => {
        const handleFocus = () => {
            console.log('AdminProfile - Window focused, refreshing admin data');
            refreshAdminData();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    useEffect(() => {
        console.log('AdminProfile - adminUser changed:', adminUser);
        if (adminUser) {
            console.log('AdminProfile - adminUser details:', {
                id: adminUser.id || adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            });
            setProfileKey(prev => prev + 1);
            setLastUpdate(Date.now());
        }
    }, [adminUser]);

    const refreshAdminData = async () => {
        console.log('AdminProfile - Refreshing admin data...');
        console.log('AdminProfile - Token in localStorage:', localStorage.getItem('token'));
        const freshData = await getCurrentAdmin();
        console.log('AdminProfile - Fresh admin data:', freshData);
        setProfileKey(prev => prev + 1);
        setLastUpdate(Date.now());
    };

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

    const handleRefreshProfile = async () => {
        await refreshAdminData();
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
                <div className="admin-info" key={`${profileKey}-${lastUpdate}`}>
                    <h1>Admin Profile</h1>
                    <p>Welcome, {adminUser?.name || 'Admin'}</p>
                    <p className="admin-email">{adminUser?.email}</p>
                    <small>Updated: {new Date(lastUpdate).toLocaleTimeString()}</small>
                    
                    {/* Debug Info - Remove in production */}
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                        <strong>Debug Info:</strong><br/>
                        adminUser: {adminUser ? JSON.stringify({
                            id: adminUser.id || adminUser._id,
                            name: adminUser.name,
                            email: adminUser.email,
                            role: adminUser.role
                        }, null, 2) : 'null'}<br/>
                        Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}
                    </div>
                </div>
                <div className="header-actions">
                    <button 
                        className="refresh-btn"
                        onClick={handleRefreshProfile}
                        title="Refresh Profile"
                    >
                        🔄 Refresh
                    </button>
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
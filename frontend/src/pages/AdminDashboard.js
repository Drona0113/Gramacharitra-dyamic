import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { adminUser, logoutAdmin } = useAdmin();
    const [stats, setStats] = useState({
        totalVillages: 0,
        recentActivity: []
    });
    const [villages, setVillages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/villages');
            const villagesData = response.data;
            setVillages(villagesData);
            setStats({
                totalVillages: villagesData.length,
                recentActivity: villagesData.slice(0, 5)
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            logoutAdmin();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome, {adminUser?.name || 'Admin'}</h1>
                    <p>Manage your Grama Charitra villages and content</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-primary"
                        onClick={() => navigate('/admin/villages')}
                    >
                        Manage Villages
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">🏘️</div>
                    <div className="stat-info">
                        <h3>{stats.totalVillages}</h3>
                        <p>Total Villages</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-info">
                        <h3>Admin</h3>
                        <p>Your Role</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔧</div>
                    <div className="stat-info">
                        <h3>Active</h3>
                        <p>System Status</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-villages">
                    <h3>Recent Villages</h3>
                    <div className="villages-grid">
                        {villages.slice(0, 6).map(village => (
                            <div key={village._id} className="village-preview-card">
                                <img 
                                    src={village.image}
                                    alt={village.name}
                                    onError={(e) => {
                                        e.target.src = '/images/gramacharitra.jpg';
                                    }}
                                />
                                <div className="village-preview-info">
                                    <h4>{village.name}</h4>
                                    <p>{village.district}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-actions">
                    <h3>Quick Actions</h3>
                    <div className="action-buttons">
                        <button 
                            className="action-btn"
                            onClick={() => navigate('/admin/add-village')}
                        >
                            <span className="action-icon">➕</span>
                            Add New Village
                        </button>
                        <button 
                            className="action-btn"
                            onClick={() => navigate('/admin/villages')}
                        >
                            <span className="action-icon">✏️</span>
                            Edit Villages
                        </button>
                        <button 
                            className="action-btn"
                            onClick={() => navigate('/admin/villages')}
                        >
                            <span className="action-icon">🗑️</span>
                            Manage Content
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
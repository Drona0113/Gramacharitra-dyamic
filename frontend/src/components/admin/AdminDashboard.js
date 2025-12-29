import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VillageList from './VillageList';
import VillageForm from './VillageForm';
import { useAdmin } from '../../context/AdminContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const {
    adminUser,
    logoutAdmin,
    updateAdminProfile,
    isAdminLoading,
  } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'villages';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [stats, setStats] = useState({
    totalVillages: 0,
    totalUsers: 0,
    totalReviews: 0
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    organization: '',
    location: '',
    bio: '',
    avatarUrl: ''
  });
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  // keep `tab` query param in sync with the active tab so page refresh preserves it
  useEffect(() => {
    const cur = new URLSearchParams(location.search).get('tab') || 'villages';
    if (cur !== activeTab) {
      const next = new URLSearchParams(location.search);
      next.set('tab', activeTab);
      navigate(`${location.pathname}?${next.toString()}`, { replace: true });
    }
  }, [activeTab, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (adminUser) {
      setProfileForm({
        name: adminUser.name || '',
        email: adminUser.email || '',
        phone: adminUser.phone || '',
        designation: adminUser.designation || '',
        organization: adminUser.organization || '',
        location: adminUser.location || '',
        bio: adminUser.bio || '',
        avatarUrl: adminUser.avatarUrl || ''
      });
    }
  }, [adminUser]);

  const fetchStats = async () => {
    try {
      // Fetch analytics from admin endpoint (protected)
      const res = await api.get('/admin/analytics');
      const data = res.data || {};
      setStats(prev => ({
        ...prev,
        totalVillages: data.totalVillages ?? prev.totalVillages,
        totalUsers: data.totalUsers ?? prev.totalUsers,
        totalReviews: data.totalReviews ?? prev.totalReviews,
        monthlyVisitors: data.monthlyVisitors ?? prev.monthlyVisitors
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddNew = () => {
    setEditingVillage(null);
    setShowAddForm(true);
  };

  const handleEdit = (village) => {
    setEditingVillage(village);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingVillage(null);
  };

  const handleFormSave = () => {
    // Refresh the village list after save
    window.location.reload(); // Simple refresh for now
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileStatus({ type: '', message: '' });
    setIsSavingProfile(true);
    try {
      await updateAdminProfile(profileForm);
      setProfileStatus({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setProfileStatus({
        type: 'error',
        message: error?.message || error?.errors?.[0] || 'Failed to update profile.'
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileReset = () => {
    if (!adminUser) return;
    setProfileForm({
      name: adminUser.name || '',
      email: adminUser.email || '',
      phone: adminUser.phone || '',
      designation: adminUser.designation || '',
      organization: adminUser.organization || '',
      location: adminUser.location || '',
      bio: adminUser.bio || '',
      avatarUrl: adminUser.avatarUrl || ''
    });
    setProfileStatus({ type: '', message: '' });
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        try {
          await api.post('/auth/avatar', { avatarUrl: dataUrl });
          // refresh admin user data
          await updateAdminProfile({ avatarUrl: dataUrl });
        } catch (err) {
          console.error('Failed to upload admin avatar to server, saving locally', err);
          setProfileForm(prev => ({ ...prev, avatarUrl: dataUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setProfileForm(prev => ({ ...prev, avatarUrl: '' }));
  };

  const handleAvatarUrlChange = () => {
    const url = prompt('Enter the image URL:');
    if (url) {
      setProfileForm(prev => ({ ...prev, avatarUrl: url }));
    }
  };

  // Debug authentication state
  console.log('AdminDashboard - isAdminLoading:', isAdminLoading);
  console.log('AdminDashboard - adminUser:', adminUser);
  console.log('AdminDashboard - localStorage token:', localStorage.getItem('token'));

  // Show loading state while admin context is loading
  if (isAdminLoading) {
    console.log('AdminDashboard - Showing loading state');
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (!adminUser) {
    console.log('AdminDashboard - No admin user, showing access denied');
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  console.log('AdminDashboard - Rendering dashboard for admin:', adminUser.name);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {adminUser.name}!</p>
        </div>
        <button onClick={logoutAdmin} className="btn-secondary">
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'villages' ? 'active' : ''}`}
          onClick={() => setActiveTab('villages')}
        >
          Manage Villages
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Admin Profile
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'villages' && (
          <div className="villages-management">
            <div className="section-header">
              <h2>Village Management</h2>
              <button 
                onClick={handleAddNew}
                className="btn-primary"
              >
                Add New Village
              </button>
            </div>
            
            {showAddForm ? (
              <VillageForm 
                village={editingVillage}
                onClose={handleFormClose}
                onSave={handleFormSave}
              />
            ) : (
              <VillageList onEdit={handleEdit} />
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics">
            <h2>Analytics Dashboard</h2>
            <div className="analytics-cards">
              <div className="analytics-card">
                <h3>Total Villages</h3>
                <p className="analytics-number">{stats.totalVillages}</p>
              </div>
              <div className="analytics-card">
                <h3>Total Users</h3>
                <p className="analytics-number">{stats.totalUsers}</p>
              </div>
              <div className="analytics-card">
                <h3>Total Reviews</h3>
                <p className="analytics-number">{stats.totalReviews}</p>
              </div>
              <div className="analytics-card">
                <h3>Monthly Visitors</h3>
                <p className="analytics-number">{stats.monthlyVisitors ? stats.monthlyVisitors : '—'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-page">
            <div className="container">
              <div className="profile-card">
                <div className="profile-header">
                  <div className="avatar-section">
                    <div className="avatar-container">
                      <div className="avatar" onClick={() => profileForm.avatarUrl && setShowImageModal(true)}>
                        {profileForm.avatarUrl ? (
                          <img src={profileForm.avatarUrl} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      {isEditMode && (
                        <>
                          <button className="avatar-edit-btn" onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}>
                            <i className="fas fa-camera"></i>
                          </button>
                          {profileForm.avatarUrl && (
                            <button className="avatar-remove-btn" onClick={() => handleAvatarRemove()}>
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                          {showAvatarDropdown && (
                            <div className="avatar-dropdown">
                              <div className="dropdown-item" onClick={() => document.getElementById('avatar-upload').click()}>
                                <i className="fas fa-upload"></i>
                                Upload Photo
                              </div>
                              <div className="dropdown-item" onClick={() => handleAvatarUrlChange()}>
                                <i className="fas fa-link"></i>
                                Add URL
                              </div>
                              {profileForm.avatarUrl && (
                                <div className="dropdown-item remove" onClick={() => handleAvatarRemove()}>
                                  <i className="fas fa-trash"></i>
                                  Remove Photo
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="user-details">
                      <h2>{profileForm.name || 'Admin User'}</h2>
                      <div className="user-role">
                        <i className="fas fa-user-shield"></i>
                        <span>Administrator</span>
                      </div>
                    </div>
                  </div>
                  {!isEditMode && (
                    <button className="btn-primary" onClick={() => setIsEditMode(true)}>
                      <i className="fas fa-edit"></i> Edit Profile
                    </button>
                  )}
                </div>

                <div className="profile-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="info-content">
                        <label>Email Address</label>
                        {isEditMode ? (
                          <input
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className="edit-input"
                          />
                        ) : (
                          <span>{profileForm.email || 'Not provided'}</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div className="info-content">
                        <label>Phone Number</label>
                        {isEditMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            placeholder="+91 12345 67890"
                            className="edit-input"
                          />
                        ) : (
                          <span>{profileForm.phone || 'Not provided'}</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <div className="info-content">
                        <label>Designation</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="designation"
                            value={profileForm.designation}
                            onChange={handleProfileChange}
                            placeholder="District Coordinator"
                            className="edit-input"
                          />
                        ) : (
                          <span>{profileForm.designation || 'Not specified'}</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-building"></i>
                      </div>
                      <div className="info-content">
                        <label>Organization</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="organization"
                            value={profileForm.organization}
                            onChange={handleProfileChange}
                            placeholder="Grama Charitra"
                            className="edit-input"
                          />
                        ) : (
                          <span>{profileForm.organization || 'Not specified'}</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="info-content">
                        <label>Location</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="location"
                            value={profileForm.location}
                            onChange={handleProfileChange}
                            placeholder="Andhra Pradesh, India"
                            className="edit-input"
                          />
                        ) : (
                          <span>{profileForm.location || 'Not specified'}</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <div className="info-content">
                        <label>About</label>
                        {isEditMode ? (
                          <textarea
                            name="bio"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            placeholder="Share your mission, interests or admin responsibilities."
                            className="edit-textarea"
                            rows="3"
                          />
                        ) : (
                          <span>{profileForm.bio || 'No bio provided'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="profile-stats">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">
                          {adminUser.createdAt
                            ? new Date(adminUser.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </span>
                        <p>Member Since</p>
                      </div>
                    </div>
                  </div>

                  {isEditMode && (
                    <div className="profile-actions">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => {
                          handleProfileReset();
                          setIsEditMode(false);
                        }}
                        disabled={isSavingProfile || isAdminLoading}
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleProfileSubmit}
                        disabled={isSavingProfile || isAdminLoading}
                      >
                        <i className="fas fa-save"></i> {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}

                  {profileStatus.message && (
                    <div className={`profile-status ${profileStatus.type}`}>
                      <i className={`fas ${profileStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                      {profileStatus.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden file input for avatar upload */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarUpload}
            />

            {/* Image Modal */}
            {showImageModal && profileForm.avatarUrl && (
              <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
                <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close-btn" onClick={() => setShowImageModal(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                  <div className="modal-image-container">
                    <img src={profileForm.avatarUrl} alt="Profile" className="modal-image" />
                  </div>
                  <div className="modal-header">
                    <h3>{profileForm.name}</h3>
                    <p>Administrator</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
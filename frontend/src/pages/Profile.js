import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { getRoleIcon, getRoleColor } from '../utils/roleUtils';
import api from '../services/api';
import './Profile.css';

// Ensure the component has access to the helper functions
const Profile = () => {
  const { user } = useAuth();
  const { adminUser } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch all users when admin is logged in
  useEffect(() => {
    const currentUser = adminUser || user;
    if (currentUser && currentUser.role && currentUser.role === 'admin') {
      fetchAllUsers();
    }
  }, [adminUser, user]);

  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/auth/users');
      console.log('Fetched users:', response.data);
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load saved image from localStorage on component mount
  useEffect(() => {
    const loadImage = () => {
      if (user && user._id) {
        console.log('Loading image for user:', user.email, 'ID:', user._id);

        // Try multiple possible keys for backward compatibility
        const possibleKeys = [
          `profileImage_${user._id}`,
          `profileImage_${user.email}`,
          'profileImage' // fallback for any user
        ];

        for (const key of possibleKeys) {
          const savedImage = localStorage.getItem(key);
          if (savedImage) {
            console.log('Found image with key:', key);
            setImagePreview(savedImage);
            return;
          }
        }

        // If no image found, check if any profile image exists (for debugging)
        const allKeys = Object.keys(localStorage).filter(k => k.includes('profileImage'));
        if (allKeys.length > 0) {
          console.log('Available profile image keys:', allKeys);
        }
      }
    };

    // Load immediately if user is available
    loadImage();

    // Also set up a retry mechanism for cases where user data loads slowly
    const retryTimer = setTimeout(() => {
      if (user && !imagePreview) {
        console.log('Retrying image load...');
        loadImage();
      }
    }, 100);

    // Set up interval to check periodically (for debugging)
    const intervalTimer = setInterval(() => {
      if (user && !imagePreview) {
        const allKeys = Object.keys(localStorage).filter(k => k.includes('profileImage'));
        if (allKeys.length > 0) {
          console.log('Profile image keys available:', allKeys);
          loadImage();
        }
      }
    }, 500);

    return () => {
      clearTimeout(retryTimer);
      clearInterval(intervalTimer);
    };
  }, [user, imagePreview]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if current user is admin with null checks
  const currentUser = adminUser || user || {};
  
  // Set loading to false once we have user data
  useEffect(() => {
    if (user || adminUser) {
      setIsLoading(false);
    }
  }, [user, adminUser]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return <div className="loading">Loading user data...</div>;
  }
  const isAdmin = currentUser && currentUser.role && currentUser.role === 'admin';
  const showAllUsers = isAdmin;

  console.log('Profile.js - Current user:', user);
  console.log('Profile.js - Admin user:', adminUser);
  console.log('Profile.js - Is admin:', isAdmin);
  console.log('Profile.js - Show all users:', showAllUsers);
  console.log('Profile.js - All users count:', allUsers.length);

  // Show login message if no user is logged in (after loading)
  if ((!user && !adminUser) || !currentUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-card">
            <div className="login-prompt">
              <i className="fas fa-user-lock"></i>
              <h3>Access Restricted</h3>
              <p>Please log in to view profiles.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        setAllUsers(allUsers.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Show all users for admin in a card layout
  if (isAdmin && allUsers && allUsers.length > 0) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="admin-header">
            <h1>User Directory</h1>
            <p>Manage and view all registered users in the system</p>
          </div>
          
          {loadingUsers ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="users-grid">
              {allUsers.map((userItem) => (
                <div key={userItem._id} className="user-card">
                  <div className="card-header">
                    <div className="user-avatar">
                      {userItem.avatarUrl ? (
                        <img src={userItem.avatarUrl} alt={userItem.name} />
                      ) : (
                        <div className="avatar-placeholder" style={{ backgroundColor: getRoleColor(userItem.role) }}>
                          <i className={getRoleIcon(userItem.role)}></i>
                        </div>
                      )}
                    </div>
                    <div className="user-basic">
                      <h3>{userItem.name}</h3>
                      <span className="user-email">{userItem.email}</span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="user-meta">
                      <div className="meta-item">
                        <i className="fas fa-user-tag"></i>
                        <span className="role-badge" style={{ backgroundColor: getRoleColor(userItem.role) }}>
                          {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                        </span>
                      </div>
                      {userItem.phone && (
                        <div className="meta-item">
                          <i className="fas fa-phone"></i>
                          <span>{userItem.phone}</span>
                        </div>
                      )}
                      {userItem.designation && (
                        <div className="meta-item">
                          <i className="fas fa-briefcase"></i>
                          <span>{userItem.designation}</span>
                        </div>
                      )}
                      {userItem.location && (
                        <div className="meta-item">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{userItem.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    <span className="join-date">
                      <i className="far fa-calendar-alt"></i>
                      Joined {new Date(userItem.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="action-buttons">
                      <button 
                        className="btn-message" 
                        title="Send Message"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Message user:', userItem._id);
                        }}
                      >
                        <i className="far fa-envelope"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show loading state for admin while fetching users
  if (showAllUsers && loadingUsers) {
    console.log('Showing loading state for admin');
    return (
      <div className="profile-page">
        <div className="container">
          <div className="admin-users-header">
            <h1>All User Profiles</h1>
            <p>Manage and view all registered users</p>
          </div>
          <div className="loading-users">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show individual user profile

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImagePreview(imageData);

        // Save to localStorage for persistence (multiple keys for compatibility)
        if (user) {
          const keys = [
            `profileImage_${user._id}`,
            `profileImage_${user.email}`,
            'profileImage' // fallback
          ];

          keys.forEach(key => {
            localStorage.setItem(key, imageData);
          });
        }
      };
      reader.readAsDataURL(file);
    }
    setShowDropdown(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Remove from localStorage (all possible keys)
    if (user) {
      const keys = [
        `profileImage_${user._id}`,
        `profileImage_${user.email}`,
        'profileImage' // fallback
      ];

      keys.forEach(key => {
        localStorage.removeItem(key);
      });
    }

    setShowDropdown(false);
  };

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (action) => {
    switch (action) {
      case 'add':
        triggerFileInput();
        break;
      case 'view':
        if (imagePreview) {
          setShowImageModal(true);
        }
        setShowDropdown(false);
        break;
      case 'remove':
        removeImage();
        break;
      default:
        setShowDropdown(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Hero Section with Gradient Background */}
      <div className="profile-hero" style={{ 
        background: `linear-gradient(135deg, ${getRoleColor(currentUser?.role, true)} 0%, ${getRoleColor(currentUser?.role, false)} 100%)` 
      }}>
        <div className="container">
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div
                className="avatar"
                style={{
                  backgroundColor: imagePreview ? 'transparent' : (currentUser ? getRoleColor(currentUser.role) : '#667eea'),
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '4px solid rgba(255,255,255,0.2)'
                }}
                onClick={handleAvatarClick}
              >
                {!imagePreview && currentUser?.role && <i className={getRoleIcon(currentUser.role)}></i>}
              </div>
              
              {/* Avatar Action Buttons */}
              <div className="avatar-actions">
                <button className="btn-action" onClick={() => handleOptionClick('add')} title="Change Photo">
                  <i className="fas fa-camera"></i>
                </button>
                {imagePreview && (
                  <>
                    <button className="btn-action" onClick={() => handleOptionClick('view')} title="View Photo">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-action danger" onClick={() => handleOptionClick('remove')} title="Remove Photo">
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="profile-info">
              <div className="profile-meta">
                <h1>{currentUser?.name || 'User'}</h1>
                <span className="user-role">
                  <i className={getRoleIcon(currentUser?.role)}></i>
                  {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'User'}
                </span>
                {currentUser?.email && (
                  <p className="user-email">
                    <i className="fas fa-envelope"></i> {currentUser.email}
                  </p>
                )}
              </div>
              
              <div className="profile-stats">
                <div className="stat-card">
                  <i className="fas fa-village"></i>
                  <div className="stat-content">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Villages</span>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-images"></i>
                  <div className="stat-content">
                    <span className="stat-number">47</span>
                    <span className="stat-label">Photos</span>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-star"></i>
                  <div className="stat-content">
                    <span className="stat-number">4.8</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fas fa-user"></i> Overview
          </button>
          <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
            <i className="fas fa-chart-line"></i> Activity
          </button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>
        
        <div className="profile-content">
          <div className="content-grid">
            <div className="main-content">
              {activeTab === 'overview' && (
                <div className="tab-content">
                  <section className="info-section">
                    <h3><i className="fas fa-info-circle"></i> Personal Information</h3>
                    <div className="info-grid">
                      <div className="info-card">
                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fas fa-envelope"></i>
                          </div>
                          <div className="info-content">
                            <label>Email Address</label>
                            <span>{currentUser?.email || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fas fa-phone"></i>
                          </div>
                          <div className="info-content">
                            <label>Phone</label>
                            <span>{currentUser?.phone || 'Not provided'}</span>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fas fa-calendar-alt"></i>
                          </div>
                          <div className="info-content">
                            <label>Member Since</label>
                            <span>{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}</span>
                          </div>
                        </div>

                        <div className="info-item">
                          <div className="info-icon">
                            <i className="fas fa-id-badge"></i>
                          </div>
                          <div className="info-content">
                            <label>User ID</label>
                            <span>#{currentUser?._id ? currentUser._id.slice(-8) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="about-section">
                    <h3><i className="fas fa-book-open"></i> About</h3>
                    <div className="about-content">
                      <p>Welcome to your profile! Here you can manage your personal information and account settings. Explore the cultural heritage of Andhra Pradesh and connect with local communities.</p>
                      <button className="btn-edit">
                        <i className="fas fa-edit"></i> Edit Profile
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="tab-content">
                  <div className="activity-feed">
                    <h3><i className="fas fa-history"></i> Recent Activity</h3>
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-badge">
                          <i className="fas fa-image"></i>
                        </div>
                        <div className="timeline-content">
                          <h4>New Photo Uploaded</h4>
                          <p>Added a new photo to the "Temples of Andhra" album</p>
                          <span className="timeline-time">2 hours ago</span>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-badge">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="timeline-content">
                          <h4>Location Added</h4>
                          <p>Added a new heritage site: Lepakshi Temple</p>
                          <span className="timeline-time">1 day ago</span>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-badge">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="timeline-content">
                          <h4>New Connection</h4>
                          <p>You're now connected with Priya Sharma</p>
                          <span className="timeline-time">3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="tab-content">
                  <div className="settings-section">
                    <h3><i className="fas fa-user-shield"></i> Account Settings</h3>
                    <div className="settings-grid">
                      <div className="setting-item">
                        <i className="fas fa-bell"></i>
                        <div className="setting-content">
                          <h4>Notifications</h4>
                          <p>Manage your notification preferences</p>
                        </div>
                        <button className="btn-icon">
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                      <div className="setting-item">
                        <i className="fas fa-lock"></i>
                        <div className="setting-content">
                          <h4>Privacy</h4>
                          <p>Control your privacy settings</p>
                        </div>
                        <button className="btn-icon">
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                      <div className="setting-item">
                        <i className="fas fa-palette"></i>
                        <div className="setting-content">
                          <h4>Theme</h4>
                          <p>Change app appearance</p>
                        </div>
                        <button className="btn-icon">
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sidebar">
              <div className="quick-actions">
                <h4>Quick Actions</h4>
                <button className="action-btn">
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
                <button className="action-btn">
                  <i className="fas fa-share-alt"></i> Share Profile
                </button>
                <button className="action-btn">
                  <i className="fas fa-download"></i> Download Data
                </button>
              </div>

              <div className="recent-activity">
                <h4>Quick Stats</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <i className="fas fa-heart"></i>
                    <span className="stat-value">128</span>
                    <span className="stat-label">Likes</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-comment"></i>
                    <span className="stat-value">42</span>
                    <span className="stat-label">Comments</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-share"></i>
                    <span className="stat-value">19</span>
                    <span className="stat-label">Shares</span>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-eye"></i>
                    <span className="stat-value">1.2k</span>
                    <span className="stat-label">Views</span>
                  </div>
                </div>
              </div>

              <div className="badges-section">
                <h4>Your Badges</h4>
                <div className="badges-grid">
                  <div className="badge-item" title="Cultural Explorer">
                    <i className="fas fa-medal"></i>
                  </div>
                  <div className="badge-item" title="Heritage Photographer">
                    <i className="fas fa-camera-retro"></i>
                  </div>
                  <div className="badge-item" title="Local Guide">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <div className="badge-item" title="Community Star">
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Image Modal */}
      {showImageModal && imagePreview && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowImageModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-image-container">
              <img src={imagePreview} alt="Profile" className="modal-image" />
            </div>
            <div className="modal-header">
              <h3>Profile Image</h3>
              <p>GRAMA CHARITHRA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

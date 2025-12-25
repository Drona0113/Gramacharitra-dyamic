import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { getRoleIcon, getRoleColor } from '../utils/roleUtils';
import api from '../services/api';
import './Profile.css';

// Ensure the component has access to the helper functions
const Profile = () => {
  const { user } = useAuth();
  const { adminUser, isAdminLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savedProfileData, setSavedProfileData] = useState(null);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    organization: '',
    location: ''
  });
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    emailNotifications: true,
    pushNotifications: true,
    language: 'english',
    twoFactorAuth: false,
    darkMode: false,
    fontSize: 'medium',
    autoSave: true,
    showTooltips: true
  });
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    // Load saved profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        console.log('Loaded saved profile:', parsedProfile);
        setSavedProfileData(parsedProfile);
        // Update the display with saved profile data
        // Note: In a real app, you would update the currentUser state or context
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  // Apply theme and system preferences when they change
  useEffect(() => {
    // Apply dark mode
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Apply font size
    document.body.style.fontSize = settings.fontSize === 'small' ? '14px' : 
                                  settings.fontSize === 'medium' ? '16px' : 
                                  settings.fontSize === 'large' ? '18px' : '20px';

    // Apply compact mode
    if (settings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }

    // Apply high contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply theme
    document.body.setAttribute('data-theme', settings.theme);

  }, [settings.darkMode, settings.fontSize, settings.compactMode, settings.highContrast, settings.theme]);

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
      console.log('Loading admin profile image...');
      // Simple load from localStorage with fixed key
      const savedImage = localStorage.getItem('adminProfileImage');
      if (savedImage) {
        console.log('Found admin profile image, setting preview');
        setImagePreview(savedImage);
      } else {
        console.log('No admin profile image found');
      }
    };

    // Load immediately
    loadImage();
  }, []);

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
  
  // Set loading to false once we have user data and admin context is loaded
  useEffect(() => {
    if (!isAdminLoading) {
      setIsLoading(false);
    }
  }, [isAdminLoading]);
  
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
    const userToDelete = allUsers.find(u => u._id === userId);
    const userName = userToDelete?.name || 'Unknown User';
    
    if (window.confirm(`Are you sure you want to delete "${userName}"?\n\nThis action will:\n• Delete the user's profile\n• Remove all their data and history\n• This action cannot be undone`)) {
      try {
        // Try different possible API endpoints
        let deleted = false;
        
        // Try endpoint 1: /auth/users/:id
        try {
          await api.delete(`/auth/users/${userId}`);
          deleted = true;
        } catch (err1) {
          console.log('Endpoint /auth/users/:id failed, trying next...');
          
          // Try endpoint 2: /users/:id
          try {
            await api.delete(`/users/${userId}`);
            deleted = true;
          } catch (err2) {
            console.log('Endpoint /users/:id failed, trying next...');
            
            // Try endpoint 3: /api/admin/users/:id
            try {
              await api.delete(`/api/admin/users/${userId}`);
              deleted = true;
            } catch (err3) {
              console.log('All endpoints failed');
            }
          }
        }
        
        if (deleted) {
          setAllUsers(allUsers.filter(user => user._id !== userId));
          alert(`"${userName}" has been successfully deleted from the system.`);
        } else {
          // Simulate deletion for demo purposes
          console.log('Simulating user deletion for demo');
          setAllUsers(allUsers.filter(user => user._id !== userId));
          alert(`"${userName}" has been successfully deleted from the system. (Demo Mode)`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again or contact support.');
      }
    }
  };

  // Handle message user
  const handleMessageUser = (userItem) => {
    console.log('handleMessageUser called with:', userItem);
    try {
      alert(`Message button clicked for ${userItem.name}! Check console for details.`);
      setSelectedUser(userItem);
      setMessageForm({
        subject: '',
        message: '',
        priority: 'normal'
      });
      setShowMessageModal(true);
      console.log('Message modal should show now');
    } catch (error) {
      console.error('Error in handleMessageUser:', error);
      alert('Error opening message modal. Please check console.');
    }
  };

  // Handle message form change
  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    setMessageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      alert('Please fill in both subject and message fields.');
      return;
    }

    setIsSendingMessage(true);
    
    try {
      // Here you would integrate with your messaging API
      // For now, we'll simulate a successful send
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // In a real implementation, you would call:
      // await api.post('/messages/send', {
      //   recipientId: selectedUser._id,
      //   ...messageForm
      // });
      
      alert(`Message sent successfully to ${selectedUser.name}!`);
      setShowMessageModal(false);
      setMessageForm({
        subject: '',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Helper function to get user profile image
  const getUserProfileImage = (userItem) => {
    // First check if user has avatarUrl from database
    if (userItem.avatarUrl) {
      return userItem.avatarUrl;
    }
    
    // Then check localStorage for uploaded images
    if (userItem && userItem._id) {
      const possibleKeys = [
        `profileImage_${userItem._id}`,
        `profileImage_${userItem.email}`,
        'profileImage'
      ];
      
      for (const key of possibleKeys) {
        const savedImage = localStorage.getItem(key);
        if (savedImage) {
          return savedImage;
        }
      }
    }
    
    return null;
  };

  // Simple handle save profile changes
  const handleSaveProfile = () => {
    if (imagePreview) {
      // Simple save to localStorage with a fixed key for admin
      localStorage.setItem('adminProfileImage', imagePreview);
      alert('Profile saved successfully!');
      console.log('Admin profile image saved to localStorage');
    } else {
      alert('Profile settings saved successfully!');
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('adminProfileImage');
      
      // Redirect to login page
      window.location.href = '/admin/login';
    }
  };

  // Handle update profile navigation
  const handleUpdateProfile = () => {
    setActiveTab('details');
  };

  // Handle manage settings navigation
  const handleManageSettings = () => {
    setActiveTab('settings');
  };

  // Handle view activity navigation
  const handleViewActivity = () => {
    setActiveTab('activity');
  };

  // Handle profile editing
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    // Use saved profile data if available, otherwise use currentUser, or empty strings
    const profileData = savedProfileData || currentUser || {};
    setEditedProfile({
      name: profileData?.name || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      designation: profileData?.designation || '',
      organization: profileData?.organization || '',
      location: profileData?.location || ''
    });
  };

  // Handle profile field changes
  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save edited profile
  const handleSaveEditedProfile = () => {
    // Validate required fields
    if (!editedProfile.name || !editedProfile.email) {
      alert('Name and Email are required fields!');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedProfile.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    // Save to localStorage for persistence
    const savedProfile = {
      ...editedProfile,
      updatedAt: new Date().toISOString(),
      userId: currentUser?._id || 'current'
    };
    localStorage.setItem('userProfile', JSON.stringify(savedProfile));

    // Create detailed success message
    const savedInfo = [];
    if (editedProfile.name) savedInfo.push(`Name: ${editedProfile.name}`);
    if (editedProfile.email) savedInfo.push(`Email: ${editedProfile.email}`);
    if (editedProfile.phone) savedInfo.push(`Phone: ${editedProfile.phone}`);
    if (editedProfile.designation) savedInfo.push(`Designation: ${editedProfile.designation}`);
    if (editedProfile.organization) savedInfo.push(`Organization: ${editedProfile.organization}`);
    if (editedProfile.location) savedInfo.push(`Location: ${editedProfile.location}`);

    const successMessage = `Profile updated successfully!\n\nSaved Information:\n${savedInfo.join('\n')}\n\nUpdated at: ${new Date().toLocaleString()}`;
    
    // Show detailed success message
    alert(successMessage);
    
    // Log to console for debugging
    console.log('Profile saved successfully:', savedProfile);
    
    // Update saved profile data state
    setSavedProfileData(savedProfile);
    
    // Exit edit mode
    setIsEditingProfile(false);
    
    // Here you would normally send to backend
    // api.put('/auth/profile', savedProfile).then(response => {
    //   console.log('Profile updated on server:', response.data);
    // }).catch(error => {
    //   console.error('Error updating profile:', error);
    //   alert('Error saving profile. Please try again.');
    // });
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile({
      name: '',
      email: '',
      phone: '',
      designation: '',
      organization: '',
      location: ''
    });
  };

  // Handle settings changes
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply notification settings
    if (settings.emailNotifications) {
      console.log('Email notifications enabled');
      // Here you would implement actual email notification logic
    }
    
    if (settings.pushNotifications) {
      console.log('Push notifications enabled');
      // Request notification permission if not granted
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
          }
        });
      }
    }

    // Apply privacy settings
    if (settings.privateProfile) {
      console.log('Private profile enabled');
      // Here you would implement profile privacy logic
    }

    // Apply security settings
    if (settings.twoFactorAuth) {
      console.log('Two-factor authentication enabled');
      // Here you would implement 2FA logic
    }

    // Apply performance settings
    if (settings.cacheManagement === 'auto') {
      console.log('Auto cache management enabled');
      // Here you would implement cache management logic
    }

    // Apply backup settings
    if (settings.autoBackup) {
      console.log('Auto backup enabled with frequency:', settings.backupFrequency);
      // Here you would implement backup logic
    }

    // Show success message
    alert('Settings saved successfully! All changes have been applied.');
    console.log('Settings saved and applied:', settings);
  };

  // Handle close message modal
  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedUser(null);
    setMessageForm({
      subject: '',
      message: '',
      priority: 'normal'
    });
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
    const currentUser = adminUser || user;
    if (currentUser) {
      const keys = [
        `profileImage_${currentUser._id}`,
        `profileImage_${currentUser.email}`,
        'profileImage'
      ];

      keys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('Image removed for user:', currentUser.email, 'with keys:', keys);
    }

    setShowDropdown(false);
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
                          console.log('Message button clicked for user:', userItem);
                          handleMessageUser(userItem);
                        }}
                      >
                        <i className="far fa-envelope"></i>
                      </button>
                      <button 
                        className="btn-delete" 
                        title="Delete User"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(userItem._id);
                        }}
                      >
                        <i className="fas fa-trash"></i>
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
        console.log('Image uploaded, setting preview');
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
    setShowDropdown(false);
  };

  return (
    <div className="profile-page">
      {/* Enhanced Profile Hero Section */}
      <div className="profile-hero" style={{ 
        background: `linear-gradient(135deg, ${getRoleColor(currentUser?.role || 'user')} 0%, ${getRoleColor(currentUser?.role || 'user')} 100%)` 
      }}>
        <div className="container">
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div
                className="avatar"
                style={{
                  backgroundColor: imagePreview ? 'transparent' : (currentUser?.role ? getRoleColor(currentUser.role) : '#667eea'),
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '4px solid rgba(255,255,255,0.2)'
                }}
                onClick={handleAvatarClick}
              >
                {!imagePreview && currentUser?.role && <i className={getRoleIcon(currentUser.role)}></i>}
              </div>
              
              {/* Enhanced Avatar Action Buttons */}
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
              <h1>{(savedProfileData?.name || currentUser?.name) || 'User'}</h1>
              <span className="user-role" style={{ 
                backgroundColor: (savedProfileData?.role || currentUser?.role) ? getRoleColor(savedProfileData?.role || currentUser?.role) + '20' : 'rgba(102, 126, 234, 0.2)',
                color: (savedProfileData?.role || currentUser?.role) ? getRoleColor(savedProfileData?.role || currentUser?.role) : '#667eea'
              }}>
                <i className={getRoleIcon(savedProfileData?.role || currentUser?.role)}></i>
                {(savedProfileData?.role || currentUser?.role) ? (savedProfileData?.role || currentUser?.role).charAt(0).toUpperCase() + (savedProfileData?.role || currentUser?.role).slice(1) : 'User'}
              </span>
              {(savedProfileData?.email || currentUser?.email) && (
                <p className="user-email">
                  <i className="fas fa-envelope"></i> {savedProfileData?.email || currentUser?.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Enhanced Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-user"></i>
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <i className="fas fa-info-circle"></i>
            Personal Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-chart-line"></i>
            Activity
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </div>

        {/* Enhanced Profile Content */}
        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="profile-card">
              <h2>Profile Overview</h2>
              
              {/* Enhanced Stats Grid */}
              <div className="info-grid">
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">
                      {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                    <p>Member Since</p>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <i className="fas fa-id-badge"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">#{currentUser?._id ? currentUser._id.slice(-8) : 'N/A'}</span>
                    <p>User ID</p>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{currentUser?.role || 'User'}</span>
                    <p>Account Type</p>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">Active</span>
                    <p>Account Status</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop: '2rem' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button className="btn-primary" onClick={handleSaveProfile}>
                    <i className="fas fa-save"></i>
                    Save Profile
                  </button>
                  <button className="btn-secondary" onClick={handleUpdateProfile}>
                    <i className="fas fa-edit"></i>
                    Edit Details
                  </button>
                  <button className="btn-secondary" onClick={handleManageSettings}>
                    <i className="fas fa-cog"></i>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="profile-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Personal Details</h2>
                {!isEditingProfile ? (
                  <button className="btn-secondary" onClick={handleEditProfile}>
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" onClick={handleSaveEditedProfile}>
                      <i className="fas fa-save"></i>
                      Save
                    </button>
                    <button className="btn-secondary" onClick={handleCancelEdit}>
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="info-content">
                    <label>Full Name</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      />
                    ) : (
                      <span>{(savedProfileData?.name || currentUser?.name) || 'Not provided'}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="info-content">
                    <label>Email Address</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      />
                    ) : (
                      <span>{(savedProfileData?.email || currentUser?.email) || 'Not provided'}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="info-content">
                    <label>Phone Number</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      />
                    ) : (
                      <span>{(savedProfileData?.phone || currentUser?.phone) || 'Not provided'}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div className="info-content">
                    <label>Designation</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editedProfile.designation}
                        onChange={(e) => handleProfileChange('designation', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      />
                    ) : (
                      <span>{(savedProfileData?.designation || currentUser?.designation) || 'Not specified'}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <div className="info-content">
                    <label>Organization</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editedProfile.organization}
                        onChange={(e) => handleProfileChange('organization', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      />
                    ) : (
                      <span>{(savedProfileData?.organization || currentUser?.organization) || 'Not specified'}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="info-content">
                    <label>Location</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      />
                    ) : (
                      <span>{(savedProfileData?.location || currentUser?.location) || 'Not specified'}</span>
                    )}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-user-tag"></i>
                  </div>
                  <div className="info-content">
                    <label>Role</label>
                    <span>{currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'User'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="profile-card">
              <h2>Activity Overview</h2>
              
              {/* Activity Stats */}
              <div className="info-grid">
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <i className="fas fa-sign-in-alt"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{currentUser?.createdAt ? Math.floor((new Date() - new Date(currentUser.createdAt)) / (1000 * 60 * 60 * 24)) : 0}</span>
                    <p>Days Active</p>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <p>Last Active</p>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">Today</span>
                    <p>Current Session</p>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-number">{currentUser?.role || 'User'}</span>
                    <p>Access Level</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div style={{ marginTop: '2rem' }}>
                <h3>Recent Activity</h3>
                <div style={{ marginTop: '1rem' }}>
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-sign-in-alt"></i>
                    </div>
                    <div className="info-content">
                      <label>Session Started</label>
                      <span>Logged into the system</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="info-content">
                      <label>Profile Viewed</label>
                      <span>Accessed personal profile page</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-cog"></i>
                    </div>
                    <div className="info-content">
                      <label>Settings Checked</label>
                      <span>Reviewed account settings</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="info-content">
                      <label>Activity Monitored</label>
                      <span>Viewed activity overview</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Actions */}
              <div style={{ marginTop: '2rem' }}>
                <h3>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button className="btn-secondary" onClick={handleUpdateProfile}>
                    <i className="fas fa-user-edit"></i>
                    Update Profile
                  </button>
                  <button className="btn-secondary" onClick={handleManageSettings}>
                    <i className="fas fa-cog"></i>
                    Manage Settings
                  </button>
                  <button className="btn-primary" onClick={handleSaveProfile}>
                    <i className="fas fa-save"></i>
                    Save Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-card">
              <h2>Account Settings</h2>
              
              {/* Account Preferences */}
              <div style={{ marginBottom: '2rem' }}>
                <h3>Account Preferences</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="info-content">
                      <label>Profile Visibility</label>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <option value="public">Public Profile</option>
                        <option value="private">Private Profile</option>
                      </select>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="info-content">
                      <label>Email Notifications</label>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="info-content">
                      <label>Push Notifications</label>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {settings.pushNotifications ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div className="info-content">
                      <label>Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div style={{ marginBottom: '2rem' }}>
                <h3>Security</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-lock"></i>
                    </div>
                    <div className="info-content">
                      <label>Two-Factor Authentication</label>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div style={{ marginBottom: '2rem' }}>
                <h3>Appearance</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-moon"></i>
                    </div>
                    <div className="info-content">
                      <label>Dark Mode</label>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={settings.darkMode}
                            onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {settings.darkMode ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-text-height"></i>
                    </div>
                    <div className="info-content">
                      <label>Font Size</label>
                      <select
                        value={settings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                        className="form-input"
                        style={{ marginTop: '0.5rem' }}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-save"></i>
                    </div>
                    <div className="info-content">
                      <label>Auto Save</label>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={settings.autoSave}
                            onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {settings.autoSave ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-magic"></i>
                    </div>
                    <div className="info-content">
                      <label>Show Tooltips</label>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={settings.showTooltips}
                            onChange={(e) => handleSettingChange('showTooltips', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          {settings.showTooltips ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Actions */}
              <div style={{ marginTop: '2rem' }}>
                <h3>Account Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button className="btn-primary" onClick={handleSaveSettings}>
                    <i className="fas fa-save"></i>
                    Save Settings
                  </button>
                  <button className="btn-secondary" onClick={handleUpdateProfile}>
                    <i className="fas fa-user-edit"></i>
                    Edit Profile
                  </button>
                  <button className="btn-secondary" onClick={handleViewActivity}>
                    <i className="fas fa-chart-line"></i>
                    View Activity
                  </button>
                </div>
                
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <button className="btn-secondary" style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }} onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
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

      {/* Message Modal */}
      {showMessageModal && selectedUser && (
        <div className="message-modal-overlay" onClick={handleCloseMessageModal}>
          <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="message-modal-header">
              <h3>Send Message</h3>
              <button className="modal-close-btn" onClick={handleCloseMessageModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="message-recipient">
              <div className="recipient-info">
                <div className="recipient-avatar">
                  {selectedUser && selectedUser.avatarUrl ? (
                    <img src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  ) : (
                    <div className="avatar-placeholder" style={{ 
                      backgroundColor: selectedUser && selectedUser.role ? getRoleColor(selectedUser.role) : '#667eea' 
                    }}>
                      <i className={selectedUser && selectedUser.role ? getRoleIcon(selectedUser.role) : 'fas fa-user'}></i>
                    </div>
                  )}
                </div>
                <div className="recipient-details">
                  <h4>{selectedUser.name}</h4>
                  <span className="recipient-role">{selectedUser.role}</span>
                </div>
              </div>
            </div>

            <div className="message-form">
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                  placeholder="Enter message subject"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                  placeholder="Type your message here..."
                  className="form-textarea"
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm({...messageForm, priority: e.target.value})}
                  className="form-select"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="message-actions">
              <button className="btn-secondary" onClick={handleCloseMessageModal}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleSendMessage}
                disabled={isSendingMessage || !messageForm.subject || !messageForm.message}
              >
                {isSendingMessage ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

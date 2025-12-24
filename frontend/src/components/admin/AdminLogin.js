import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [name, setName] = useState('');
    const [adminSecret, setAdminSecret] = useState('');

    const { loginAdmin, registerAdmin } = useAdmin(); // Use AdminContext for admin actions
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let user;
            if (isRegisterMode) {
                // Call admin registration endpoint with admin secret
                if (!adminSecret.trim()) {
                    setError('Admin secret key is required for registration');
                    setIsLoading(false);
                    return;
                }
                const result = await registerAdmin({
                    name,
                    email: credentials.email,
                    password: credentials.password,
                    adminSecret
                });
                user = result.user;
            } else {
                // Admin login (no adminSecret)
                const result = await loginAdmin({
                    email: credentials.email,
                    password: credentials.password
                });
                user = result.user;
            }

            // Check if user has admin privileges
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Access denied. Admin privileges required.');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setError(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setCredentials({ email: '', password: '' });
        setName('');
        setAdminSecret('');
        setError('');
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        resetForm();
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <h2 style={{color: 'rgb(2, 83, 18)'}}>
                        {isRegisterMode ? 'Admin Registration' : 'Admin Login'}
                    </h2>
                    <p>Access the Grama Charitra Admin Panel</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    {isRegisterMode && (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isRegisterMode}
                                    placeholder="Enter your full name"
                                    disabled={isLoading}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="adminSecret">Admin Secret Key</label>
                                <input
                                    type="password"
                                    id="adminSecret"
                                    value={adminSecret}
                                    onChange={(e) => setAdminSecret(e.target.value)}
                                    required={isRegisterMode}
                                    placeholder="Enter admin secret key"
                                    disabled={isLoading}
                                />
                                <small className="form-help-text">
                                    Contact system administrator for the secret key
                                </small>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin email"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            disabled={isLoading}
                            minLength="6"
                        />
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="admin-login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isRegisterMode ? 'Register as Admin' : 'Login as Admin')}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <button 
                        type="button"
                        className="toggle-mode-btn"
                        onClick={toggleMode}
                        disabled={isLoading}
                    >
                        {isRegisterMode ? 'Already have an account? Login' : 'Need an account? Register'}
                    </button>
                </div>

                <div className="admin-info">
                    <p><strong>Admin Access Required</strong></p>
                    <p>Only authorized administrators can access the village management system.</p>
                    {isRegisterMode && (
                        <p><small>Admin registration requires a secret key from the system administrator.</small></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(null);
    // start as loading so ProtectedAdminRoute waits for the auth check
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        getCurrentAdmin();
    }, []);

    // 🔹 Admin Login
    const loginAdmin = async ({ email, password }) => {
        try {
            setIsAdminLoading(true);
            // Clear any existing admin data first
            setAdminUser(null);
            setIsAdmin(false);
            localStorage.removeItem("token");
            
            const res = await api.post('/auth/login', {
                email,
                password
            });
            const user = res.data.user;
            console.log('AdminContext - Login response user:', user);
            
            if (user.role !== 'admin') {
                throw { message: "Access denied. Admin privileges required." };
            }
            
            // Set new admin data
            setAdminUser(user);
            setIsAdmin(true);
            localStorage.setItem("token", res.data.token);
            console.log('AdminContext - Admin logged in successfully:', user.name);
            
            return { success: true, user };
        } catch (error) {
            // Clear admin data on login failure
            setAdminUser(null);
            setIsAdmin(false);
            localStorage.removeItem("token");
            throw error.response?.data || { message: "Admin login failed" };
        } finally {
            setIsAdminLoading(false);
        }
    };

    // 🔹 Admin Register
    const registerAdmin = async ({ name, email, password, adminSecret }) => {
        try {
            setIsAdminLoading(true);
            const res = await api.post('/auth/register-admin', {
                name,
                email,
                password,
                adminSecret
            });
            setAdminUser(res.data.user);
            setIsAdmin(true);
            localStorage.setItem("token", res.data.token);
            return { success: true, user: res.data.user };
        } catch (error) {
            throw error.response?.data || { message: "Admin registration failed" };
        } finally {
            setIsAdminLoading(false);
        }
    };

    // 🔹 Admin Logout
    const logoutAdmin = () => {
        console.log('AdminContext - Logging out admin');
        setAdminUser(null);
        setIsAdmin(false);
        localStorage.removeItem("token");
        // Force page reload to clear any cached state
        window.location.href = '/';
    };

    // 🔹 Get Current Admin (from backend using token)
    const getCurrentAdmin = async () => {
        console.log('AdminContext - getCurrentAdmin called');
        try {
            setIsAdminLoading(true);
            const token = localStorage.getItem("token");
            console.log('AdminContext - Token found:', !!token);
            
            if (!token) {
                console.log('AdminContext - No token, clearing admin data');
                setAdminUser(null);
                setIsAdmin(false);
                return null;
            }

            // Force fresh data by bypassing any cache - use the centralized api instance
            const res = await api.get('/auth/current', {
                headers: { 
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            const user = res.data;
            console.log('AdminContext - Fresh user data received:', user);
            
            if (user.role !== 'admin') {
                console.log('AdminContext - User is not admin:', user.role);
                setAdminUser(null);
                setIsAdmin(false);
                return null;
            }
            
            console.log('AdminContext - Admin user confirmed:', user.name);
            // Force update even if data looks the same
            setAdminUser(prevUser => {
                if (!prevUser || prevUser.id !== user.id || prevUser.name !== user.name || prevUser.email !== user.email) {
                    console.log('AdminContext - Admin user data updated');
                    return user;
                }
                console.log('AdminContext - Admin user data unchanged');
                return user;
            });
            setIsAdmin(true);
            return user;
        } catch (error) {
            console.log('AdminContext - Error in getCurrentAdmin:', error);
            setAdminUser(null);
            setIsAdmin(false);
            return null;
        } finally {
            setIsAdminLoading(false);
        }
    };

    // 🔹 Update Admin Profile
    const updateAdminProfile = async (updates) => {
        try {
            setIsAdminLoading(true);
            const res = await api.put(
                '/auth/profile',
                updates
            );
            setAdminUser(res.data);
            return res.data;
        } catch (error) {
            throw error.response?.data || { message: "Failed to update profile" };
        } finally {
            setIsAdminLoading(false);
        }
    };

    const value = {
        adminUser,
        isAdmin,
        isAdminLoading,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
        getCurrentAdmin,
        updateAdminProfile
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

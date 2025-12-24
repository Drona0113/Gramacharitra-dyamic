import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        getCurrentAdmin();
    }, []);

    const withAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // 🔹 Admin Login
    const loginAdmin = async ({ email, password }) => {
        try {
            setIsAdminLoading(true);
            const res = await axios.post(`${API_BASE}/auth/login`, {
                email,
                password
            });
            const user = res.data.user;
            if (user.role !== 'admin') {
                throw { message: "Access denied. Admin privileges required." };
            }
            setAdminUser(user);
            setIsAdmin(true);
            localStorage.setItem("token", res.data.token);
            return { success: true, user };
        } catch (error) {
            throw error.response?.data || { message: "Admin login failed" };
        } finally {
            setIsAdminLoading(false);
        }
    };

    // 🔹 Admin Register
    const registerAdmin = async ({ name, email, password, adminSecret }) => {
        try {
            setIsAdminLoading(true);
            const res = await axios.post(`${API_BASE}/auth/register-admin`, {
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
        setAdminUser(null);
        setIsAdmin(false);
        localStorage.removeItem("token");
        window.location.href = '/';
    };

    // 🔹 Get Current Admin (from backend using token)
    const getCurrentAdmin = async () => {
        try {
            setIsAdminLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setAdminUser(null);
                setIsAdmin(false);
                return;
            }

            const res = await axios.get(`${API_BASE}/auth/current`, {
                headers: withAuthHeaders()
            });

            const user = res.data;
            if (user.role !== 'admin') {
                setAdminUser(null);
                setIsAdmin(false);
                return;
            }
            setAdminUser(user);
            setIsAdmin(true);
        } catch (error) {
            setAdminUser(null);
            setIsAdmin(false);
        } finally {
            setIsAdminLoading(false);
        }
    };

    // 🔹 Update Admin Profile
    const updateAdminProfile = async (updates) => {
        try {
            setIsAdminLoading(true);
            const res = await axios.put(
                `${API_BASE}/auth/profile`,
                updates,
                { headers: withAuthHeaders() }
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

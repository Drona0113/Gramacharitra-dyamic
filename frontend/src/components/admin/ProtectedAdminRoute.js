import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const ProtectedAdminRoute = ({ children }) => {
    const { adminUser, isAdminLoading } = useAdmin();

    if (isAdminLoading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: '20px'
            }}>
                <div className="loading-spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Verifying admin access...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!adminUser || adminUser.role !== 'admin') {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
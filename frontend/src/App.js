import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VillageProvider } from './context/VillageContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import VillagePage from './pages/VillagePage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AddVillage from './components/admin/AddVillage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SearchResults from './pages/SearchResults';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import Villages from './pages/Villages';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <VillageProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/villages" element={<Villages />} />
                  <Route path="/village/:id" element={<VillagePage />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/profile" element={
                    <ProtectedAdminRoute>
                      <AdminProfile />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/add-village" element={
                    <ProtectedAdminRoute>
                      <AddVillage />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/admin/villages" element={
                    <ProtectedAdminRoute>
                      <AdminPage />
                    </ProtectedAdminRoute>
                  } />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/search" element={<SearchResults />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </VillageProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
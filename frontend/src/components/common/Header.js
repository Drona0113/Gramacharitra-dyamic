import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import SearchBar from './SearchBar';

const Header = () => {
  const { user, logout, isAdmin: isUserAdmin } = useAuth();
  const { adminUser, isAdmin: isPortalAdmin, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdminLoggedIn = Boolean(adminUser) || isPortalAdmin || isUserAdmin;

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    if (!user && (adminUser || isPortalAdmin)) {
      logoutAdmin();
    } else {
      logout();
    }
    navigate('/');
  };

  const renderNavLinks = () => {
    if (isAdminLoggedIn) {
      return (
        <>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/profile" onClick={closeMenu}>User&apos;s Profiles</Link></li>
          <li><Link to="/villages" onClick={closeMenu}>Villages</Link></li>
          <li><Link to="/admin/dashboard" onClick={closeMenu}>Admin Dashboard</Link></li>
          <li>
            <a href="#!" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </>
      );
    }

    if (user) {
      return (
        <>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/villages" onClick={closeMenu}>Villages</Link></li>
          <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
          <li>
            <a href="#!" onClick={handleLogout}>
              Logout
            </a>
          </li>
        </>
      );
    }

    return (
      <>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/villages" onClick={closeMenu}>Villages</Link></li>
        <li><Link to="/login" onClick={closeMenu}>User Login</Link></li>
        <li><Link to="/admin" onClick={closeMenu}>Admin Login</Link></li>
        {/*<li><Link to="/register" onClick={closeMenu}>Register</Link></li>*/}
      </>
    );
  };

  return (
    <header>
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>GRAMA CHARITHRA</h1>
        </Link>
        <p>Exploring the sacred villages and cultural heritage of Andhra Pradesh</p>
      </div>
      
      <div className="lang-toggle">
        <div id="google_translate_element"></div>
      </div>
      
      <nav>
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          {renderNavLinks()}
        </ul>
      </nav>
      
      <div className="search-container">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
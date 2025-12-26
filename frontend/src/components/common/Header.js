import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
          <li><NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/profile" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>User&apos;s Profiles</NavLink></li>
          <li><NavLink to="/villages" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Villages</NavLink></li>
          <li><NavLink to="/admin/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Admin Dashboard</NavLink></li>
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
          <li><NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/villages" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Villages</NavLink></li>
          <li><NavLink to="/profile" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Profile</NavLink></li>
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
        <li><NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Home</NavLink></li>
        {/* Villages link hidden for anonymous users; appears after login */}
        <li><NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>User Login</NavLink></li>
        <li><NavLink to="/admin" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Admin Login</NavLink></li>
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
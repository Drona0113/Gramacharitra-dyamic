import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
       
        
        <div className="social-links">
          <button type="button" className="social-btn" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </button>
          <button type="button" className="social-btn" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </button>
          <button type="button" className="social-btn" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </button>
          <button type="button" className="social-btn" aria-label="YouTube">
            <i className="fab fa-youtube"></i>
          </button>
        </div>
        
        <p className="copyright">
          &copy; {new Date().getFullYear()} Grama Charithra. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
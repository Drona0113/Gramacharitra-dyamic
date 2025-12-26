import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-left">
          <div className="brand">Grama Charithra</div>
          <p className="footer-tag">Explore sacred villages, preserve heritage.</p>
        </div>

        <div className="footer-center">
          <div className="social-links">
            <button type="button" className="social-btn" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
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
        </div>

        <div className="footer-right">
          <p className="copyright">&copy; {new Date().getFullYear()} Grama Charithra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
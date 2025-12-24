import React, { useEffect } from 'react';

const LanguageTranslator = () => {
  useEffect(() => {
    // Hide Google Translate toolbar
    const removeGoogleTranslateElements = () => {
      const elements = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate');
      elements.forEach(elem => {
        if (elem) {
          elem.style.display = 'none';
        }
      });
      // Remove the top margin added by Google Translate
      if (document.body) {
        document.body.style.top = '0px';
      }
    };

    // Initialize Google Translate with English as default
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        const optionsDiv = document.querySelector('.goog-te-combo');
        if (optionsDiv) {
          optionsDiv.value = 'en';
          optionsDiv.dispatchEvent(new Event('change'));
        }
      }
    };

    // Wait for Google Translate to load
    const checkGoogleTranslate = setInterval(() => {
      if (window.google && window.google.translate) {
        clearInterval(checkGoogleTranslate);
        removeGoogleTranslateElements();
        initGoogleTranslate();
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkGoogleTranslate);
    };
  }, []);

  return (
    <div className="lang-toggle">
      <div id="google_translate_element"></div>
      <iframe
        title="Google Translate Element Remover"
        src="about:blank"
        style={{
          display: 'none',
          visibility: 'hidden',
          width: 0,
          height: 0,
          border: 'none'
        }}
      />
    </div>
  );
};

export default LanguageTranslator;
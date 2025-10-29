import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">☕</span>
          <h1>NAIROBIAN TEA</h1>
        </div>
        <div className="header-stats">
          <span className="stat">📰 Fresh Updates</span>
          <span className="stat">🌆 Nairobi Stories</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
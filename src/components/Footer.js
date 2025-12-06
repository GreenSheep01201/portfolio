import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'white', padding: '60px 0', marginTop: '60px', borderTop: '1px solid #f2f4f6' }}>
      <div className="container" style={{ textAlign: 'center', color: '#8b95a1' }}>
        <p style={{ marginBottom: '12px' }}>&copy; 2025 Hong Gildong. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="mailto:email@example.com">Email</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

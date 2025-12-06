import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'white', padding: '60px 0', marginTop: '60px', borderTop: '1px solid #f2f4f6' }}>
      <div className="container" style={{ textAlign: 'center', color: '#8b95a1' }}>
        <p style={{ marginBottom: '12px' }}>&copy; 2025 Seo Wongil. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="mailto:seowongil@gmail.com">Email</a>
          <a href="https://github.com/GreenSheep01201" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/green-sheep-2427bb2ba/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

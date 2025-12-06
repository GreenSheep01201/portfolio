import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    // 홈페이지가 아니면 먼저 홈으로 이동
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinkStyle = {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '15px',
    fontWeight: 500,
    color: '#4e5968',
    padding: 0
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(242, 244, 246, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div
          style={{ fontWeight: 700, fontSize: '18px', cursor: 'pointer' }}
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Portfolio
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={navLinkStyle} onClick={() => scrollToSection('about')}>About</button>
          <button style={navLinkStyle} onClick={() => scrollToSection('skills')}>Tech Stack</button>
          <button style={navLinkStyle} onClick={() => scrollToSection('projects')}>Projects</button>
          <button style={navLinkStyle} onClick={() => scrollToSection('blog')}>Blog</button>
          <button style={navLinkStyle} onClick={() => scrollToSection('contact')}>Contact</button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

import React from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
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
        <div style={{ fontWeight: 700, fontSize: '18px' }}>Portfolio</div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: 500, color: '#4e5968' }}>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

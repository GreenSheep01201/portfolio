import React from 'react';
import { motion } from 'framer-motion';

const BlogItem = ({ title, date, excerpt, link }) => {
  return (
    <motion.a 
      href={link}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.8)' }}
      style={{
        display: 'block',
        padding: '24px',
        borderRadius: '20px',
        backgroundColor: 'white',
        marginBottom: '16px',
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.2s ease'
      }}
    >
      <div style={{ fontSize: '14px', color: '#8b95a1', marginBottom: '8px' }}>{date}</div>
      <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#191f28', marginBottom: '8px' }}>{title}</h4>
      <p style={{ fontSize: '15px', color: '#4e5968', lineHeight: 1.5 }}>{excerpt}</p>
    </motion.a>
  );
};

export default BlogItem;

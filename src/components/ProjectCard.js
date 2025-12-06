import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ title, description, tags, link, github }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: 'var(--toss-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {github && <a href={github} target="_blank" rel="noreferrer"><Github size={20} color="#8b95a1" /></a>}
          {link && <a href={link} target="_blank" rel="noreferrer"><ExternalLink size={20} color="#8b95a1" /></a>}
        </div>
      </div>
      
      <p style={{ fontSize: '17px', color: '#4e5968', lineHeight: 1.5 }}>
        {description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
        {tags.map((tag, index) => (
          <span key={index} style={{
            backgroundColor: '#f2f4f6',
            color: '#4e5968',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500
          }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectCard;

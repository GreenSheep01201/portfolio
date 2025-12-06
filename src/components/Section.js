import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ id, title, subtitle, children, background = 'transparent' }) => {
  return (
    <section id={id} className="section" style={{ backgroundColor: background }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section;

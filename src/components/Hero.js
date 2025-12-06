import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="about" className="container" style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
          안녕하세요, <br />
          <span style={{ color: '#3182f6' }}>문제를 해결하는 개발자</span><br />
          홍길동입니다.
        </h1>
        <p style={{ fontSize: '20px', color: '#4e5968', maxWidth: '600px', marginBottom: '40px' }}>
          사용자의 불편함을 기술로 해결하고, <br />
          더 나은 경험을 만드는 것에 집중합니다.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: '#3182f6',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(49, 130, 246, 0.3)'
          }}
        >
          이력서 보기
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;

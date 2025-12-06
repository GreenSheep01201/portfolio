import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section id="about" className="container" style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          style={{ fontSize: '22px', color: '#3182f6', fontWeight: 600, marginBottom: '6px' }}
        >
          안녕하세요!
        </motion.p>

        <motion.h1
          variants={itemVariants}
          style={{ fontSize: '44px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}
        >
          <span style={{ color: '#3182f6' }}>문제를 해결하는 개발자</span>
        </motion.h1>

        <motion.h1
          variants={itemVariants}
          style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}
        >
          서원길  입니다.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{ fontSize: '20px', color: '#4e5968', maxWidth: '600px', marginBottom: '60px' }}
        >
          사용자의 불편함을 기술로 해결하고, <br />
          더 나은 경험을 만드는 것에 집중합니다.
        </motion.p>

        <motion.div
          variants={itemVariants}
          animate={{
            y: [0, 10, 0],
            opacity: isScrolled ? 0 : 1
          }}
          transition={{
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.3 }
          }}
          style={{ textAlign: 'center', cursor: 'pointer', pointerEvents: isScrolled ? 'none' : 'auto' }}
          onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })}
        >
          <span style={{ fontSize: '14px', color: '#8b95a1', display: 'block', marginBottom: '8px' }}>
            아래로 스크롤
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#8b95a1' }}>
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

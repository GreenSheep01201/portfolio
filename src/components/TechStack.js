import React from 'react';
import { motion } from 'framer-motion';
import {
  SiJavascript, SiPython, SiDotnet, SiPhp,
  SiReact, SiTailwindcss, SiVite,
  SiExpress, SiDjango, SiFlask, SiStreamlit, SiApache,
  SiMysql, SiAmazonwebservices, SiDocker, SiLinux,
  SiNodered, SiWireshark, SiJetbrains
} from 'react-icons/si';
import { TbLetterC, TbDatabase, TbBug } from 'react-icons/tb';

const TechStack = () => {
  const iconMap = {
    "JavaScript": <SiJavascript color="#F7DF1E" />,
    "Python": <SiPython color="#3776AB" />,
    "PHP": <SiPhp color="#777BB4" />,
    "C": <TbLetterC color="#A8B9CC" />,
    "C#": <SiDotnet color="#512BD4" />,
    "React": <SiReact color="#61DAFB" />,
    "Tailwind CSS": <SiTailwindcss color="#06B6D4" />,
    "Vite": <SiVite color="#646CFF" />,
    "Express": <SiExpress color="#000000" />,
    "Django": <SiDjango color="#092E20" />,
    "Flask": <SiFlask color="#000000" />,
    "Apache": <SiApache color="#D22128" />,
    "Streamlit": <SiStreamlit color="#FF4B4B" />,
    "MySQL": <SiMysql color="#4479A1" />,
    "MSSQL": <TbDatabase color="#CC2927" />,
    "AWS (EC2, RDS)": <SiAmazonwebservices color="#FF9900" />,
    "Docker": <SiDocker color="#2496ED" />,
    "Linux": <SiLinux color="#FCC624" />,
    "Node-RED": <SiNodered color="#8F0000" />,
    "Wireshark": <SiWireshark color="#1679A7" />,
    "dotPeek": <SiJetbrains color="#000000" />,
    "OllyDbg": <TbBug color="#4a4a4a" />
  };

  const categories = [
    {
      title: "Languages",
      items: ["JavaScript", "Python", "PHP", "C", "C#"]
    },
    {
      title: "Frontend",
      items: ["React", "Tailwind CSS", "Vite"]
    },
    {
      title: "Backend",
      items: ["Express", "Django", "Flask", "Apache", "Streamlit"]
    },
    {
      title: "Database",
      items: ["MySQL", "MSSQL"]
    },
    {
      title: "Cloud & Infra",
      items: ["AWS (EC2, RDS)", "Docker", "Linux"]
    },
    {
      title: "Tools & Others",
      items: ["Node-RED", "Wireshark", "dotPeek", "OllyDbg"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="skills" className="section" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <h2 className="section-title">Tech Stack</h2>
        <p className="section-subtitle">실무와 프로젝트에서 직접 활용하며 경험을 쌓아온 기술들입니다.</p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              style={{
                padding: '24px',
                backgroundColor: '#f8f9fa',
                borderRadius: '16px'
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#3182f6', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {category.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {category.items.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#4e5968',
                      border: '1px solid #e5e8eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {item}
                    <span style={{ fontSize: '18px', display: 'flex' }}>{iconMap[item]}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;

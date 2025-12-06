import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import BlogItem from './components/BlogItem';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import BlogList from './components/BlogList';
import { blogPosts } from './data/blogPosts';

function HomePage() {
  const projects = [
    {
      title: "생산 관리 시스템",
      description: "모델별 공정 관리 및 작업자 할당을 위한 생산 관리 시스템입니다. JWT 기반 인증과 역할 기반 접근 제어(RBAC)를 구현했습니다.",
      tags: ["React", "TypeScript", "Express", "MySQL"],
      github: null,
      link: null
    },
    {
      title: "BIN 데이터 관리 시스템",
      description: "Location 별 BIN 데이터를 관리하고 QR코드 스캔을 통한 위치 이동 및 이력 추적 기능을 제공하는 재고 관리 시스템입니다.",
      tags: ["React", "Tailwind CSS", "Express", "MySQL", "MSSQL"],
      github: null,
      link: null
    },
    {
      title: "온습도 모니터링 대시보드",
      description: "Raspberry Pi와 온습도 센서로 데이터를 수집하고, Node-RED를 통해 서버로 전송하여 실시간 시각화하는 대시보드입니다. 임계값 초과 시 알림 기능을 제공합니다.",
      tags: ["React", "TypeScript", "Express", "MySQL", "Raspberry Pi", "Node-RED"],
      github: null,
      link: null
    },
    {
      title: "설비 일일점검 시스템",
      description: "설비의 일일 점검 항목을 관리하고 점검 이력을 기록하는 웹 애플리케이션입니다.",
      tags: ["React", "Express", "MySQL"],
      github: null,
      link: null
    },
    {
      title: "자재소요계획(MRP) 시스템",
      description: "생산 계획에 따른 자재 소요량을 계산하고 발주 계획을 수립하는 MRP 시스템입니다.",
      tags: ["React", "Express", "Tailwind CSS", "MySQL", "MSSQL"],
      github: null,
      link: null
    },
    {
      title: "OQC 측정 데이터 뷰어",
      description: "생산 공장의 OQC(출하품질검사) 측정 데이터를 조회하고 분석하는 뷰어입니다.",
      tags: ["React", "Express", "MySQL"],
      github: null,
      link: null
    },
    {
      title: "YOLO 기반 포장 검사 시스템",
      description: "YOLO 객체 탐지 모델을 활용하여 제품 포장 상태를 실시간으로 검사하는 비전 시스템입니다.",
      tags: ["Python", "YOLO", "OpenCV", "Tkinter"],
      github: null,
      link: null
    },
    {
      title: "영상 내 인원 추적 시스템",
      description: "YOLO와 OpenCV를 활용하여 영상 속 사람 수를 카운팅하고 동선을 추적하는 AI 비전 프로젝트입니다.",
      tags: ["Python", "YOLO", "OpenCV"],
      github: null,
      link: null
    },
    {
      title: "Setting QR 프로그램",
      description: "제품 양산 과정 중 시리얼 통신을 통해 설정된 데이터를 저장 및 시리얼 번호(SN)를 QR코드로 생성하고 출력하는 데스크톱 애플리케이션입니다. MySQL과 연동하여 데이터를 관리합니다.",
      tags: ["Python", "C#", "MySQL", "Tkinter"],
      github: null,
      link: null
    },
    {
      title: "IT 자산관리 시스템",
      description: "회사 내 IT 자산(PC, 모니터, 소프트웨어 등)을 등록하고 관리하는 웹 애플리케이션입니다.",
      tags: ["React", "Express", "Python", "MySQL"],
      github: null,
      link: null
    },
    {
      title: "AI 사진 편집기",
      description: "AI 기술을 활용한 사진 편집 도구입니다. 배경 제거, 이미지 보정 등의 기능을 제공합니다.",
      tags: ["React", "Python", "AI"],
      github: null,
      link: null
    },
    {
      title: "이미지 검증 시스템",
      description: "제품 이미지의 품질을 검증하고 불량 여부를 판단하는 시스템입니다.",
      tags: ["React", "Express", "Python"],
      github: null,
      link: null
    }
  ];

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <TechStack />

      <Section id="projects" title="Projects" subtitle="문제를 해결하기 위해 만들었던 프로젝트들입니다.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </Section>

      <Section id="blog" title="Blog" subtitle="개발 과정에서의 고민과 배움을 기록합니다." background="#e8f3ff">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {blogPosts.slice(0, 3).map((blog) => (
            <BlogItem key={blog.id} {...blog} />
          ))}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/blog" style={{ textDecoration: 'none' }}>
              <span style={{
                color: '#3182f6',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
                padding: '12px 24px',
                backgroundColor: '#e8f3ff',
                borderRadius: '24px',
                display: 'inline-block',
                transition: 'all 0.2s ease'
              }}>
                총 {blogPosts.length}개의 글 보기 →
              </span>
            </Link>
          </div>
        </div>
      </Section>

      <Section id="contact" title="Contact">
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: 'var(--toss-shadow)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>함께 일하고 싶으신가요?</h3>
          <p style={{ color: '#4e5968', marginBottom: '32px' }}>
            새로운 도전을 좋아하고, <br />
            함께 성장하는 것을 즐깁니다. <br />
            언제든 편하게 연락주세요.
          </p>
          <a href="mailto:seowongil@gmail.com" style={{
            backgroundColor: '#3182f6',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 700,
            display: 'inline-block'
          }}>
            이메일 보내기
          </a>
        </div>
      </Section>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
    </Routes>
  );
}

export default App;

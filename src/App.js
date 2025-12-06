import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import BlogItem from './components/BlogItem';
import Footer from './components/Footer';

function App() {
  const projects = [
    {
      title: "Toy Project 1: Smart To-Do",
      description: "단순한 할 일 관리가 아닌, AI가 우선순위를 추천해주는 똑똑한 투두리스트입니다. 사용자의 행동 패턴을 분석하여 최적의 시간을 제안합니다.",
      tags: ["React", "TypeScript", "OpenAI API"],
      github: "https://github.com",
      link: "https://example.com"
    },
    {
      title: "Toy Project 2: Weather Mood",
      description: "날씨에 따라 어울리는 음악과 글귀를 추천해주는 감성 큐레이션 서비스입니다. 공공데이터 포털의 날씨 API를 활용했습니다.",
      tags: ["React", "Styled-components", "Spotify API"],
      github: "https://github.com",
      link: null
    },
    {
      title: "Portfolio v1",
      description: "현재 보고 계신 포트폴리오 사이트입니다. Toss의 디자인 시스템을 벤치마킹하여 깔끔하고 직관적인 UX를 구현했습니다.",
      tags: ["React", "Framer Motion"],
      github: "https://github.com",
      link: "https://example.com"
    }
  ];

  const blogs = [
    {
      title: "React 프로젝트 구조 잡기 (feat. Atomic Design)",
      date: "2025. 11. 20",
      excerpt: "프로젝트 초기 설정 단계에서 컴포넌트 구조를 어떻게 잡아야 효율적인지 고민했던 과정을 기록합니다.",
      link: "#"
    },
    {
      title: "프론트엔드 성능 최적화: 렌더링 줄이기",
      date: "2025. 11. 10",
      excerpt: "불필요한 리렌더링을 방지하기 위해 useMemo와 useCallback을 적용하여 성능을 30% 향상시킨 경험을 공유합니다.",
      link: "#"
    },
    {
      title: "10월 회고: 꾸준함의 힘",
      date: "2025. 11. 01",
      excerpt: "한 달 동안 1일 1커밋을 실천하며 느꼈던 점과 앞으로의 학습 방향에 대해 정리해 보았습니다.",
      link: "#"
    }
  ];

  return (
    <div className="App">
      <Navbar />
      <Hero />
      
      <Section id="projects" title="Projects" subtitle="문제를 해결하기 위해 만들었던 프로젝트들입니다.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </Section>

      <Section id="blog" title="Blog" subtitle="개발 과정에서의 고민과 배움을 기록합니다." background="#e8f3ff">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {blogs.map((blog, index) => (
            <BlogItem key={index} {...blog} />
          ))}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <a href="#" style={{ color: '#3182f6', fontWeight: 600, fontSize: '15px' }}>블로그 더보기 &rarr;</a>
          </div>
        </div>
      </Section>

      <Section id="contact" title="Contact">
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: 'var(--toss-shadow)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>함께 일하고 싶으신가요?</h3>
          <p style={{ color: '#4e5968', marginBottom: '32px' }}>
            새로운 도전을 좋아하고, 함께 성장하는 것을 즐깁니다. <br />
            언제든 편하게 연락주세요.
          </p>
          <a href="mailto:email@example.com" style={{ 
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

export default App;
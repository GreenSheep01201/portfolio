import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogItem from './BlogItem';
import { blogPosts } from '../data/blogPosts';

const BlogList = () => {
  const navigate = useNavigate();

  // 페이지 진입 시 스크롤 최상단으로 이동
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#f2f4f6', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(242, 244, 246, 0.9)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              color: '#4e5968',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            홈으로
          </button>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>Blog</div>
        </div>
      </header>

      {/* 본문 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '100px 20px 60px'
        }}
      >
        {/* 타이틀 */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#191f28',
            marginBottom: '12px'
          }}>
            Blog
          </h1>
          <p style={{ color: '#6b7684', fontSize: '16px' }}>
            개발 과정에서의 고민과 배움을 기록합니다.
          </p>
          <div style={{
            marginTop: '16px',
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#e8f3ff',
            borderRadius: '20px',
            color: '#3182f6',
            fontSize: '14px',
            fontWeight: 600
          }}>
            총 {blogPosts.length}개의 글
          </div>
        </div>

        {/* 블로그 목록 */}
        <div>
          {blogPosts.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <BlogItem {...blog} />
            </motion.div>
          ))}
        </div>

        {/* 하단 네비게이션 */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '16px 32px',
              backgroundColor: '#3182f6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogList;

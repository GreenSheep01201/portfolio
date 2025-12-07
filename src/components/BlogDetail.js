import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogPosts } from '../data/blogPosts';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);

  // 페이지 진입 시 스크롤 최상단으로 이동
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 홈의 Blog 섹션으로 이동
  const navigateToBlogSection = () => {
    navigate('/');
    setTimeout(() => {
      const blogSection = document.getElementById('blog');
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!post) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>포스트를 찾을 수 없습니다</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3182f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

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
            onClick={navigateToBlogSection}
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
            돌아가기
          </button>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>Blog</div>
        </div>
      </header>

      {/* 본문 */}
      <motion.article
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
        {/* 메타 정보 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '4px 12px',
                  backgroundColor: '#e8f3ff',
                  color: '#3182f6',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: '16px',
            color: '#191f28'
          }}>
            {post.title}
          </h1>
          <p style={{ color: '#8b95a1', fontSize: '15px' }}>{post.date}</p>
        </div>

        {/* 콘텐츠 */}
        <div style={{
          backgroundColor: 'white',
          padding: '48px',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          wordBreak: 'break-word'
        }}>
          <ReactMarkdown
            components={{
              h2: ({children}) => (
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  marginTop: '48px',
                  marginBottom: '16px',
                  color: '#191f28',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #e5e8eb'
                }}>
                  {children}
                </h2>
              ),
              h3: ({children}) => (
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginTop: '32px',
                  marginBottom: '12px',
                  color: '#333d4b'
                }}>
                  {children}
                </h3>
              ),
              p: ({children}) => (
                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: '#4e5968',
                  marginBottom: '16px'
                }}>
                  {children}
                </p>
              ),
              ul: ({children}) => (
                <ul style={{
                  paddingLeft: '24px',
                  marginBottom: '16px',
                  color: '#4e5968'
                }}>
                  {children}
                </ul>
              ),
              ol: ({children}) => (
                <ol style={{
                  paddingLeft: '24px',
                  marginBottom: '16px',
                  color: '#4e5968'
                }}>
                  {children}
                </ol>
              ),
              li: ({children}) => (
                <li style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  marginBottom: '8px'
                }}>
                  {children}
                </li>
              ),
              strong: ({children}) => (
                <strong style={{ color: '#191f28', fontWeight: 600 }}>
                  {children}
                </strong>
              ),
              blockquote: ({children}) => (
                <blockquote style={{
                  borderLeft: '4px solid #3182f6',
                  paddingLeft: '16px',
                  margin: '24px 0',
                  color: '#6b7684',
                  fontStyle: 'italic'
                }}>
                  {children}
                </blockquote>
              ),
              table: ({children}) => (
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    {children}
                  </table>
                </div>
              ),
              th: ({children}) => (
                <th style={{
                  backgroundColor: '#f8f9fa',
                  padding: '12px',
                  borderBottom: '2px solid #e5e8eb',
                  textAlign: 'left',
                  fontWeight: 600
                }}>
                  {children}
                </th>
              ),
              td: ({children}) => (
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e5e8eb'
                }}>
                  {children}
                </td>
              ),
              code: ({inline, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: '12px',
                      padding: '20px',
                      fontSize: '14px',
                      margin: '24px 0'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code style={{
                    backgroundColor: '#f1f3f5',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#e74c3c',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* 하단 네비게이션 */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={navigateToBlogSection}
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
            목록으로 돌아가기
          </button>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogDetail;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', 'EduRichBrain', '교육리서치', '경영리서치', 'AI'];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('블로그 로딩 실패:', error);
      setStories(getMockStories());
    } finally {
      setLoading(false);
    }
  };

  const getMockStories = () => [
    {
      id: '1',
      title: 'EduRichBrain으로 학원 운영 혁신하기',
      category: 'EduRichBrain',
      excerpt: 'AI 기반 학원 관리 시스템으로 상담부터 커리큘럼까지 한 번에 관리하는 방법을 소개합니다.',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop',
      date: '2025년 11월 20일',
      author: 'EduRichBrain',
    },
    {
      id: '2',
      title: '데이터 기반 학생 성적 분석의 중요성',
      category: '교육리서치',
      excerpt: '학생별 맞춤 학습을 위한 데이터 분석 방법론과 실제 적용 사례를 다룹니다.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      date: '2025년 11월 18일',
      author: 'EduRichBrain',
    },
    {
      id: '3',
      title: '학원 경영의 핵심: 효율적인 리드 관리',
      category: '경영리서치',
      excerpt: '상담 전환율을 높이는 리드 관리 전략과 CRM 활용법을 소개합니다.',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      date: '2025년 11월 15일',
      author: 'EduRichBrain',
    },
    {
      id: '4',
      title: 'ChatGPT로 맞춤형 교육 콘텐츠 제작하기',
      category: 'AI',
      excerpt: 'AI를 활용한 효과적인 교육 자료 생성 방법과 프롬프트 엔지니어링 팁을 공유합니다.',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      date: '2025년 11월 12일',
      author: 'EduRichBrain',
    },
    {
      id: '5',
      title: '학습 동기부여를 높이는 커리큘럼 설계',
      category: '교육리서치',
      excerpt: '학생들의 흥미와 참여도를 높이는 커리큘럼 구성 원칙을 탐구합니다.',
      coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
      date: '2025년 11월 10일',
      author: 'EduRichBrain',
    },
    {
      id: '6',
      title: '학원 마케팅 자동화 전략',
      category: '경영리서치',
      excerpt: 'AI 마케팅 비서를 활용한 학부모 소통 및 이벤트 관리 자동화 방법을 안내합니다.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      date: '2025년 11월 8일',
      author: 'EduRichBrain',
    },
  ];

  const filteredStories = selectedCategory === '전체'
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)' }}>
      {/* Left Sidebar Navigation */}
      <aside style={{
        width: '260px',
        background: 'rgba(10, 14, 39, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
      }}>
        <Link href="/" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          marginBottom: '40px',
        }}>
          EduRichBrain
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            제품
          </Link>
          <Link href="/pricing" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            요금제
          </Link>
          <Link href="/diagnosis" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            경영진단
          </Link>
          <Link href="/blog" style={{
            color: 'white',
            background: 'rgba(59, 130, 246, 0.2)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            블로그
          </Link>
          <Link href="/about" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            회사
          </Link>
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            데모
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        background: 'transparent',
        overflowY: 'auto',
      }}>
        {/* Top Bar */}
        <header style={{
          height: '60px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '8px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}>
              로그인
            </button>
          </div>
        </header>

        <div style={{ padding: '60px 40px' }}>
          {/* Header */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: '40px',
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '600',
              color: 'white',
              margin: 0,
              marginBottom: '30px',
              letterSpacing: '-0.02em',
            }}>
              고객사례
            </h1>

            {/* Category Tabs */}
            <div style={{
              display: 'flex',
              gap: '0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: selectedCategory === category
                      ? '2px solid white'
                      : '2px solid transparent',
                    padding: '12px 24px',
                    color: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '400',
                    transition: 'all 0.2s ease',
                    marginBottom: '-1px',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            {loading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '16px',
              }}>
                로딩 중...
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                marginTop: '40px',
              }}>
                {filteredStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/blog/${story.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      {/* Square Thumbnail */}
                      <div style={{
                        width: '100%',
                        paddingBottom: '100%',
                        background: `url(${story.coverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }} />

                      {/* Content */}
                      <div style={{
                        padding: '20px',
                      }}>
                        {/* Category Badge */}
                        <div style={{
                          display: 'inline-block',
                          background: getCategoryColor(story.category),
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}>
                          {story.category}
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: 'white',
                          marginBottom: '8px',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {story.title}
                        </h3>

                        {/* Excerpt */}
                        <p style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          lineHeight: '1.5',
                          margin: 0,
                          marginBottom: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {story.excerpt}
                        </p>

                        {/* Date */}
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.4)',
                        }}>
                          {story.date}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredStories.length === 0 && !loading && (
              <div style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '16px',
              }}>
                해당 카테고리의 스토리가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    'EduRichBrain': '#3b82f6',
    '교육리서치': '#10b981',
    '경영리서치': '#f59e0b',
    'AI': '#8b5cf6',
  };
  return colors[category] || '#6b7280';
}

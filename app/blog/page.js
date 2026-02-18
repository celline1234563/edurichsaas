'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';

export default function BlogPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState(['전체', 'EduRichBrain', '교육리서치', '경영리서치', 'AI']);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const data = await response.json();
      setStories(data);

      // 카테고리 동적 생성 (중복 제거)
      const categorySet = new Set(data.map(story => story.category).filter(cat => cat && cat !== '전체'));
      setCategories(['전체', ...categorySet]);
    } catch (error) {
      console.error('블로그 로딩 실패:', error);
      const mockData = getMockStories();
      setStories(mockData);
      const categorySet = new Set(mockData.map(story => story.category).filter(cat => cat && cat !== '전체'));
      setCategories(['전체', ...categorySet]);
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
    <div className="app-layout">
      {/* Main Content */}
      <div className="main-area" style={{ paddingTop: '64px' }}>

        <div style={{ padding: isMobile ? '40px 20px' : '60px 40px' }}>
          {/* Header */}
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            marginBottom: isMobile ? '32px' : '40px',
          }}>
            <h1 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '600',
              color: 'white',
              margin: 0,
              marginBottom: isMobile ? '24px' : '30px',
              letterSpacing: '-0.02em',
            }}>
              스토리
            </h1>

            {/* Category Tabs */}
            <div style={{
              display: 'flex',
              gap: '0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              overflowX: isMobile ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch'
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
                    padding: isMobile ? '10px 16px' : '12px 24px',
                    color: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '400',
                    transition: 'all 0.2s ease',
                    marginBottom: '-1px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category && !isMobile) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category && !isMobile) {
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
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: isMobile ? '20px' : '24px',
                marginTop: isMobile ? '32px' : '40px',
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
                        borderRadius: isMobile ? '12px' : '16px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                    >
                      {/* Square Thumbnail */}
                      <div style={{
                        width: '100%',
                        paddingBottom: '75%',
                        background: `url(${story.coverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }} />

                      {/* Content */}
                      <div style={{
                        padding: isMobile ? '16px' : '20px',
                      }}>
                        {/* Category Badge */}
                        <div style={{
                          display: 'inline-block',
                          background: getCategoryColor(story.category),
                          padding: isMobile ? '3px 8px' : '4px 10px',
                          borderRadius: '20px',
                          fontSize: isMobile ? '10px' : '11px',
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: isMobile ? '10px' : '12px',
                        }}>
                          {story.category}
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: isMobile ? '16px' : '18px',
                          fontWeight: '700',
                          color: 'white',
                          marginBottom: isMobile ? '6px' : '8px',
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
                          fontSize: isMobile ? '12px' : '13px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          lineHeight: '1.5',
                          margin: 0,
                          marginBottom: isMobile ? '10px' : '12px',
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
                          fontSize: isMobile ? '11px' : '12px',
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
                padding: isMobile ? '60px 20px' : '80px 20px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: isMobile ? '14px' : '16px',
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

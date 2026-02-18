'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';

export default function AboutPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const isMobile = useIsMobile();

  const categories = ['전체', '회사소개', '제품소개'];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      // 실제로는 /api/about에서 가져올 수 있습니다
      setStories(getMockStories());
    } catch (error) {
      console.error('회사 정보 로딩 실패:', error);
      setStories(getMockStories());
    } finally {
      setLoading(false);
    }
  };

  const getMockStories = () => [
    {
      id: '1',
      title: 'EduRichBrain 회사 소개',
      category: '회사소개',
      excerpt: '교육 현장의 혁신을 이끄는 AI 기반 학원 관리 솔루션 전문 기업입니다.',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop',
      date: '2025년 11월 20일',
    },
    {
      id: '2',
      title: 'EduRichBrain의 비전과 미션',
      category: '회사소개',
      excerpt: '교육의 미래를 함께 만들어가는 EduRichBrain의 비전과 핵심 가치를 소개합니다.',
      coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=800&fit=crop',
      date: '2025년 11월 18일',
    },
    {
      id: '3',
      title: '우리의 성장 스토리',
      category: '회사소개',
      excerpt: '2020년 창업 이후 EduRichBrain이 걸어온 혁신의 여정을 공유합니다.',
      coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=800&fit=crop',
      date: '2025년 11월 15일',
    },
    {
      id: '4',
      title: 'AI 기반 학원 관리 솔루션',
      category: '제품소개',
      excerpt: '상담부터 커리큘럼, 마케팅까지 원스톱으로 관리하는 올인원 솔루션입니다.',
      coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=800&fit=crop',
      date: '2025년 11월 12일',
    },
    {
      id: '5',
      title: '스마트 상담 관리 시스템',
      category: '제품소개',
      excerpt: 'AI가 추천하는 맞춤형 상담 전략으로 전환율을 2배 높이세요.',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop',
      date: '2025년 11월 10일',
    },
    {
      id: '6',
      title: 'AI 커리큘럼 자동 생성',
      category: '제품소개',
      excerpt: '학생별 맞춤 커리큘럼을 AI가 자동으로 설계하고 추천합니다.',
      coverImage: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&h=800&fit=crop',
      date: '2025년 11월 8일',
    },
  ];

  const filteredStories = selectedCategory === '전체'
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Main Content */}
      <div className="main-area" style={{
        flex: 1,
        background: 'transparent',
        overflowY: 'auto',
        paddingTop: '64px',
      }}>
        <div style={{
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Hero Section */}
          <div style={{
            width: '100%',
            maxWidth: '100%',
            textAlign: 'center',
            padding: isMobile ? '80px 20px 40px' : '140px 40px 80px',
          }}>
            <div style={{
              fontSize: isMobile ? '11px' : '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: isMobile ? '16px' : '24px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              회사
            </div>

            <h1 style={{
              fontSize: isMobile ? '36px' : '72px',
              fontWeight: '600',
              color: 'white',
              margin: '0 auto',
              marginBottom: isMobile ? '20px' : '32px',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              maxWidth: isMobile ? '100%' : '900px',
            }}>
              교육 현장의 혁신을 위한<br />EduRichBrain의 비전
            </h1>

            <p style={{
              fontSize: isMobile ? '16px' : '22px',
              color: 'rgba(255, 255, 255, 0.65)',
              lineHeight: '1.6',
              marginBottom: isMobile ? '32px' : '48px',
              maxWidth: isMobile ? '100%' : '800px',
              margin: `0 auto ${isMobile ? '32px' : '48px'}`,
            }}>
              우리의 사명은 일반적으로 인간보다 더 스마트한 AI 시스템을 만들어 인류 전체의 이익을 누리게 하는 것입니다.
              우리는 모든 학원이 AI 기반 솔루션을 통해 더 효율적으로 운영되고, 학생들에게 더 나은 교육을 제공할 수 있도록 돕고자 합니다.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <button style={{
                background: 'white',
                color: '#0a0e27',
                border: 'none',
                padding: isMobile ? '14px 28px' : '16px 32px',
                borderRadius: '6px',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: isMobile ? '100%' : 'auto',
              }}>
                Our plan for EduRichBrain
              </button>
              <button style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: isMobile ? '14px 28px' : '16px 32px',
                borderRadius: '6px',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: isMobile ? '100%' : 'auto',
              }}>
                Our Charter
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div style={{
            width: '100%',
            maxWidth: '1400px',
            padding: isMobile ? '0 20px 60px' : '0 80px 120px',
          }}>
            <div style={{
              width: '100%',
              height: isMobile ? '300px' : '600px',
              borderRadius: '16px',
              background: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=900&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const colors = {
    '회사소개': '#3b82f6',
    '제품소개': '#10b981',
  };
  return colors[category] || '#6b7280';
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { marked } from 'marked';

export default function StoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [params.id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${params.id}`);
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.error('스토리 로딩 실패:', error);
      // Mock 데이터로 폴백
      setStory(getMockStory(params.id));
    } finally {
      setLoading(false);
    }
  };

  const getMockStory = (id) => {
    const stories = {
      '1': {
        id: '1',
        title: 'EduRichBrain으로 학원 운영 혁신하기',
        category: 'EduRichBrain',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
        date: '2025년 11월 20일',
        author: 'EduRichBrain',
        content: `
# EduRichBrain으로 학원 운영을 혁신하는 방법

학원 운영의 모든 과정을 AI가 도와드립니다.

## 상담 관리 자동화

상담부터 등록까지의 전 과정을 체계적으로 관리할 수 있습니다.

- **리드 관리**: 칸반 보드로 상담 단계를 시각적으로 관리
- **자동 메시지**: 템플릿 기반 메시지 자동 발송
- **성적 추적**: 학생별 성적 변화 그래프로 확인

## AI 블로그 제작

학원 마케팅을 위한 블로그 콘텐츠를 AI가 자동으로 생성합니다.

- 정보형, 홍보형, 영업형 콘텐츠 선택
- 학교별, 주제별 맞춤 콘텐츠
- 실시간 트렌딩 토픽 반영

## 커리큘럼 설계

학생 수준에 맞는 맞춤형 커리큘럼을 쉽게 설계할 수 있습니다.

- 레벨별 커리큘럼 템플릿
- 학생 진도 자동 추적
- 수업 실행 및 피드백 관리

**EduRichBrain과 함께 학원 운영의 새로운 기준을 만들어보세요.**
        `,
      },
      '2': {
        id: '2',
        title: '데이터 기반 학생 성적 분석의 중요성',
        category: '교육리서치',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
        date: '2025년 11월 18일',
        author: 'EduRichBrain',
        content: `
# 데이터 기반 학생 성적 분석

효과적인 학습 지도를 위한 데이터 분석 방법론을 소개합니다.

## 왜 데이터 분석이 중요한가?

학생 개개인의 학습 패턴과 성장 곡선을 이해하는 것은 맞춤형 교육의 시작입니다.

## 핵심 지표

1. **성적 추이**: 시간에 따른 성적 변화 분석
2. **과목별 강약점**: 과목별 성취도 비교
3. **학습 시간**: 투입 시간 대비 성과 분석

## 실제 적용 사례

데이터 분석을 통해 학생의 취약점을 파악하고, 맞춤형 학습 계획을 수립한 사례를 공유합니다.
        `,
      },
    };

    return stories[id] || stories['1'];
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        paddingTop: '64px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '18px',
      }}>
        로딩 중...
      </div>
    );
  }

  if (!story) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        paddingTop: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>스토리를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/blog')}
          style={{
            background: '#3b82f6',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      paddingTop: '64px',
      paddingBottom: '60px',
    }}>
      {/* Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(10, 14, 39, 1)), url(${story.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px 20px',
          width: '100%',
        }}>
          <button
            onClick={() => router.push('/blog')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)',
            }}
          >
            ← 목록으로
          </button>

          <div style={{
            display: 'inline-block',
            background: getCategoryColor(story.category),
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: 'white',
            fontWeight: '600',
            marginBottom: '15px',
          }}>
            {story.category}
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            lineHeight: '1.2',
          }}>
            {story.title}
          </h1>

          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
          }}>
            <span>{story.author}</span>
            <span>•</span>
            <span>{story.date}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '60px 20px',
      }}>
        <article
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '60px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '18px',
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{
            __html: marked(story.content || ''),
          }}
        />

        {/* Share & Navigation */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            onClick={() => router.push('/blog')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            목록으로
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              공유하기
            </button>
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

import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

export async function GET() {
  try {
    // Notion 설정이 없으면 Mock 데이터 반환
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
      console.log('Notion 설정이 없습니다. Mock 데이터를 반환합니다.');
      return NextResponse.json(getMockStories());
    }

    // Notion 데이터베이스 쿼리
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    // Notion 페이지를 스토리 형식으로 변환
    const stories = response.results.map((page) => {
      const properties = page.properties;

      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || '제목 없음',
        category: properties.Category?.select?.name || '전체',
        excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || '',
        coverImage: properties.CoverImage?.files?.[0]?.file?.url ||
                   properties.CoverImage?.files?.[0]?.external?.url ||
                   'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        date: formatDate(properties.Date?.date?.start),
        author: properties.Author?.rich_text?.[0]?.plain_text || 'EduRichBrain',
        published: properties.Published?.checkbox || false,
      };
    });

    // 게시된 스토리만 필터링
    const publishedStories = stories.filter(story => story.published);

    return NextResponse.json(publishedStories);
  } catch (error) {
    console.error('Notion API 에러:', error);
    // 에러 발생 시 Mock 데이터 반환
    return NextResponse.json(getMockStories());
  }
}

function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleDateString('ko-KR');

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

function getMockStories() {
  return [
    {
      id: '1',
      title: 'EduRichBrain으로 학원 운영 혁신하기',
      category: 'EduRichBrain',
      excerpt: 'AI 기반 학원 관리 시스템으로 상담부터 커리큘럼까지 한 번에 관리하는 방법을 소개합니다.',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      date: '2025년 11월 20일',
      author: 'EduRichBrain',
      published: true,
    },
    {
      id: '2',
      title: '데이터 기반 학생 성적 분석의 중요성',
      category: '교육리서치',
      excerpt: '학생별 맞춤 학습을 위한 데이터 분석 방법론과 실제 적용 사례를 다룹니다.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
      date: '2025년 11월 18일',
      author: 'EduRichBrain',
      published: true,
    },
    {
      id: '3',
      title: '학원 경영의 핵심: 효율적인 리드 관리',
      category: '경영리서치',
      excerpt: '상담 전환율을 높이는 리드 관리 전략과 CRM 활용법을 소개합니다.',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
      date: '2025년 11월 15일',
      author: 'EduRichBrain',
      published: true,
    },
    {
      id: '4',
      title: 'ChatGPT로 맞춤형 교육 콘텐츠 제작하기',
      category: 'AI',
      excerpt: 'AI를 활용한 효과적인 교육 자료 생성 방법과 프롬프트 엔지니어링 팁을 공유합니다.',
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      date: '2025년 11월 12일',
      author: 'EduRichBrain',
      published: true,
    },
    {
      id: '5',
      title: '학습 동기부여를 높이는 커리큘럼 설계',
      category: '교육리서치',
      excerpt: '학생들의 흥미와 참여도를 높이는 커리큘럼 구성 원칙을 탐구합니다.',
      coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      date: '2025년 11월 10일',
      author: 'EduRichBrain',
      published: true,
    },
    {
      id: '6',
      title: '학원 마케팅 자동화 전략',
      category: '경영리서치',
      excerpt: 'AI 마케팅 비서를 활용한 학부모 소통 및 이벤트 관리 자동화 방법을 안내합니다.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      date: '2025년 11월 8일',
      author: 'EduRichBrain',
      published: true,
    },
  ];
}

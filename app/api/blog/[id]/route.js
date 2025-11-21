import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Notion 설정이 없으면 Mock 데이터 반환
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
      console.log('Notion 설정이 없습니다. Mock 데이터를 반환합니다.');
      return NextResponse.json(getMockStory(id));
    }

    // Notion 페이지 가져오기
    const page = await notion.pages.retrieve({ page_id: id });
    const properties = page.properties;

    // 페이지 내용(블록) 가져오기
    const blocks = await notion.blocks.children.list({
      block_id: id,
    });

    // 블록을 마크다운으로 변환
    const content = await blocksToMarkdown(blocks.results);

    const story = {
      id: page.id,
      title: properties.Title?.title?.[0]?.plain_text || '제목 없음',
      category: properties.Category?.select?.name || '전체',
      coverImage: properties.CoverImage?.files?.[0]?.file?.url ||
                 properties.CoverImage?.files?.[0]?.external?.url ||
                 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
      date: formatDate(properties.Date?.date?.start),
      author: properties.Author?.rich_text?.[0]?.plain_text || 'EduRichBrain',
      content: content,
    };

    return NextResponse.json(story);
  } catch (error) {
    console.error('Notion API 에러:', error);
    // 에러 발생 시 Mock 데이터 반환
    return NextResponse.json(getMockStory(params.id));
  }
}

// Notion 블록을 마크다운으로 변환
async function blocksToMarkdown(blocks) {
  let markdown = '';

  for (const block of blocks) {
    const { type } = block;
    const value = block[type];

    switch (type) {
      case 'paragraph':
        markdown += `\n${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'heading_1':
        markdown += `\n# ${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'heading_2':
        markdown += `\n## ${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'heading_3':
        markdown += `\n### ${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'bulleted_list_item':
        markdown += `- ${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'numbered_list_item':
        markdown += `1. ${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'code':
        markdown += `\n\`\`\`${value.language}\n${richTextToPlain(value.rich_text)}\n\`\`\`\n`;
        break;
      case 'quote':
        markdown += `\n> ${richTextToPlain(value.rich_text)}\n`;
        break;
      case 'image':
        const imageUrl = value.file?.url || value.external?.url;
        if (imageUrl) {
          markdown += `\n![image](${imageUrl})\n`;
        }
        break;
      case 'divider':
        markdown += '\n---\n';
        break;
      default:
        break;
    }
  }

  return markdown;
}

// Rich text를 plain text로 변환
function richTextToPlain(richText) {
  if (!richText) return '';
  return richText.map(text => text.plain_text).join('');
}

function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleDateString('ko-KR');

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

function getMockStory(id) {
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
    '3': {
      id: '3',
      title: '학원 경영의 핵심: 효율적인 리드 관리',
      category: '경영리서치',
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
      date: '2025년 11월 15일',
      author: 'EduRichBrain',
      content: `
# 효율적인 리드 관리 전략

상담 전환율을 높이는 체계적인 리드 관리 방법을 알아봅니다.

## 리드 관리의 중요성

신규 학생 유치는 학원 성장의 핵심입니다. 효과적인 리드 관리는 상담 전환율을 2배 이상 높일 수 있습니다.

## 칸반 보드 활용법

- **신규 상담**: 첫 문의가 들어온 학부모
- **레벨테스트 예정**: 테스트 일정을 잡은 경우
- **등록 대기**: 테스트 완료 후 등록 결정 대기
- **등록 완료**: 실제 등록한 학생

## 자동화 팁

템플릿 메시지를 활용하여 각 단계별 follow-up을 자동화하세요.
      `,
    },
  };

  return stories[id] || stories['1'];
}

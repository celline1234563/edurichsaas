import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function GET(request, { params }) {
  const { id } = await params;

  try {
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
      title: properties.Name?.title?.[0]?.plain_text || '제목 없음',
      category: properties.학원정보?.select?.name || '전체',
      coverImage: page.cover?.external?.url ||
                 page.cover?.file?.url ||
                 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
      date: formatDate(properties['컨텐츠 발행일']?.date?.start),
      author: properties.기획?.rich_text?.[0]?.plain_text || 'EduRichBrain',
      content: content,
    };

    return NextResponse.json(story);
  } catch (error) {
    console.error('Notion API 에러:', error);
    // 에러 발생 시 Mock 데이터 반환
    return NextResponse.json(getMockStory(id));
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
    'kakao-notification': {
      id: 'kakao-notification',
      title: '학부모님들께 우리 아이의 학습현황을 가장 빠르게 주는 방법 : 카카오톡 알림',
      category: 'EduRichBrain',
      coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop',
      date: '2025년 12월 16일',
      author: 'EduRichBrain',
      content: `
# 학부모님들께 우리 아이의 학습현황을 가장 빠르게 주는 방법 : 카카오톡 알림

학원 운영의 모든 알림을 카카오톡으로 자동 발송 — 학부모는 안심하고, 원장님은 업무에서 해방됩니다.

## 왜 '학원 알림톡'이 필수일까요?

많은 원장님들이 여전히 **학원 문자(LMS/SMS)**를 통해 공지사항을 전달하고 계십니다. 하지만 스팸 문자로 오인받아 확인되지 않거나, 발송 비용(건당 30~50원)이 만만치 않은 것이 현실입니다.

**학원 카카오톡 알림**은 대한민국 국민 대부분이 사용하는 카카오톡을 통해 발송되므로 도달률이 월등히 높습니다. 또한, 학원의 로고와 이름을 명확히 보여주는 프로필을 통해 학부모님께 더 큰 신뢰감을 줄 수 있습니다.

---

## 원장님들의 현실적인 고민

- 상담 예약했는데 노쇼 발생 🤯
- 등하원 문자 일일이 발송 ⏰
- 수강료 납부 안내 전화 민망함 😓
- 학습 리포트 발송 번거로움 📉
- 단체 문자 비용 부담 💸

> "아직도 등하원 체크를 위해 엑셀을 켜고, 학원 문자 사이트에 접속하시나요? 반복되는 행정 업무만 줄여도 원장님은 교육 퀄리티 향상에 집중할 수 있습니다."

---

## 발송 가능한 알림톡 유형

### 📌 상담 관련 알림
- **상담 예약 안내**: 예약 시 즉시 발송 → 노쇼 방지
- **레벨테스트 일정 알림**: 테스트 전날/당일 발송 → 확실한 참석
- **상담 결과 알림**: 상담 후 발송 → 학부모 신뢰 증가

### 🏫 등하원 알림
- **등원 확인**: 학생 등원 시 자동 발송 → 학부모 안심
- **하원 예정 알림**: 하원 10분 전 발송 → 안전한 귀가

### 💳 결제 관련 알림
- **수강료 납부 안내**: 매월 정기 발송 → 미납률 감소
- **납부 완료 확인**: 결제 직후 발송 → 투명한 운영

### 📊 학습 관련 알림
- **학습 리포트 발송**: 주간/월간 발송 → 학부모 만족도 증가
- **숙제/과제 알림**: 수업 후 발송 → 학습 효과 상승

---

## 도입 기대 효과

| 항목 | Before (일반 문자) | After (에듀알림) |
|------|-------------------|-----------------|
| 메시지 확인율 | 40% | 95%+ |
| 건당 비용 | 30~50원 | 10원대 |
| 노쇼율 | 15~20% | 5% 미만 |
| 미납률 | 10% | 3% 미만 |
| 학부모 만족도 | 보통 | 매우 높음 |

---

## 자주 묻는 질문

### Q. 일반 문자와 알림톡, 무엇이 다른가요?

**비용 측면:**
- 문자 (LMS): 건당 30~50원
- 알림톡: 건당 10원대

**도달률 측면:**
- 문자: 40~60% (스팸 필터링)
- 알림톡: 95%+ (카카오톡 알림)

**신뢰도 측면:**
- 문자: 발신번호만 표시
- 알림톡: 학원 로고 + 이름 표시

---

## 스마트한 학원 운영의 시작

지금 바로 에듀리치브레인 데모를 체험해보고, **학원 알림톡**으로 변화된 학원 운영을 경험하세요.

**EduRichBrain과 함께 학원 운영의 새로운 기준을 만들어보세요.**
      `,
    },
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

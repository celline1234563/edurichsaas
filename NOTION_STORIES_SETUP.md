# Notion 스토리 블로그 연동 가이드

EduRichSaaS의 스토리 페이지를 Notion 데이터베이스와 연동하는 방법을 안내합니다.

## 1. Notion Integration 생성

1. https://www.notion.so/my-integrations 접속
2. "New integration" 클릭
3. Name: EduRichBrain Stories
4. "Submit" 클릭 후 Token 복사

## 2. Notion 데이터베이스 생성

필수 속성:
- Title (제목)
- Category (Select: 전체/EduRichBrain/교육리서치/경영리서치/AI)
- Excerpt (요약)
- CoverImage (이미지)
- Date (날짜)
- Author (작성자)
- Published (Checkbox)

## 3. 환경변수 설정

.env.local 파일에 추가:
```
NOTION_TOKEN=secret_xxxxx
NOTION_DATABASE_ID=xxxxx
```

## 4. 테스트

npm run dev 실행 후:
- http://localhost:3000/stories 접속

Mock 데이터로 바로 작동합니다!

# 에리브(Eriv) 대기제 + 간편가입 통합 설계서

## 1. 배경 & 목표

### GTM 맥락
- Wave 단위 코호트 오픈 (Week 1: 5명 / Week 2: 30명 / 숨고르기 / Month 2: 100명 / 이후 확장)
- Track A (VVIP 5-30명, 대표가 갠톡 영업) + Track B (일반 1000명 목표)
- 진단 완료자 우선 초대가 핵심 차별화

### 설계 원칙
- `waitlist_signups` 별도 테이블 만들지 않음 — 기존 `users` 테이블 재사용
- `access_status` 컬럼으로 대기/활성 상태 관리 → 별도 가입 단계 없이 상태 토글로 오픈
- 유저한테 대기번호/우선권 수치 안 보여줌 (심플하게. Wave 열릴 때 알림톡만)
- 간편가입(OAuth) 유지, 휴대폰만 별도 게이트에서 수집

---

## 2. 유입 경로 (딱 2개)

### 경로 A — 홈 직진
```
홈 → [대기 신청하기] CTA → /waitlist
  → OAuth 간편가입 (카카오/구글)
  → 휴대폰/학원명/규모 입력 (필수 게이트)
  → "신청 완료" 화면
```

### 경로 B — 진단 경유 (진단자 우선 배정)
```
홈 → [무료 경영진단] CTA → /waitlist
  → OAuth 간편가입
  → 휴대폰/학원명/규모 입력 (대기 등록 선완료)
  → /diagnosis 진단 진행
  → 결과 페이지 (대기 중 + 진단 혜택 플래그 자동 연결)
```

**핵심 규칙**: 진단은 대기 등록 **후에** 얹히는 보너스. 진단 중간 이탈해도 대기는 유지됨.

---

## 3. /waitlist 페이지 구조

```
┌─────────────────────────────────┐
│ [주 CTA - 크게]                  │
│  바로 대기 신청하기              │
│  → 이어서 간편가입               │
│                                 │
│  ─── 또는 ───                    │
│                                 │
│ [보조 - 작게]                    │
│  나한테 맞는지 진단도 해보기     │
│  → 진단하시면 Wave 우선 배정     │
└─────────────────────────────────┘
```

"대기만"을 디폴트, 진단은 옵션. 분기 선택 부담 제거.

---

## 4. DB 스키마

```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS academy_name text,
  ADD COLUMN IF NOT EXISTS academy_size text,           -- '1인' / '~10명' / '~30명' / '30명+'
  ADD COLUMN IF NOT EXISTS access_status text DEFAULT 'waiting',  -- waiting / invited / active / declined
  ADD COLUMN IF NOT EXISTS wave_number int,
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS diagnosis_response_id uuid REFERENCES diagnosis_responses(id),
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS referrer text;

-- 대기 등록 완료 조건
-- access_status='waiting' AND phone IS NOT NULL AND academy_name IS NOT NULL

-- Wave 초대 쿼리 (진단 완료자 우선)
SELECT * FROM users
WHERE access_status = 'waiting' AND phone IS NOT NULL
ORDER BY (diagnosis_response_id IS NOT NULL) DESC, created_at ASC
LIMIT 30;
```

---

## 5. 라우팅 & 게이트

`access_status` 기반 전역 가드 미들웨어:

| 상태 | 접근 가능 영역 |
|------|---------------|
| `waiting` (휴대폰 O) | `/waitlist/complete` (신청 완료 화면), `/diagnosis`, 홈 |
| `waiting` (휴대폰 X) | `/waitlist/phone` (휴대폰 필수 입력 페이지)로 강제 리디렉트 |
| `invited` | 가입 토큰 링크 → 서비스 활성화 |
| `active` | 전체 서비스 정상 사용 |
| `declined` | 로그인 차단 |

**구현 포인트**: OAuth만 완료하고 휴대폰 미입력 상태에서 다른 페이지 가려고 하면 `/waitlist/phone`로 강제 이동.

---

## 6. 알림톡 시스템

### 사전 준비 (2주 소요)
1. 카카오 비즈니스 채널 신청 (사업자등록증 필요) — **지금 바로 시작**
2. 발송 업체 선정: 알리고 추천 (저렴, ~8원/건)
3. 템플릿 심사 2건 (기존 진단자용 / Wave 초대용) — 승인 2주

### 알림톡 템플릿

**A. 기존 진단 완료자 안내**
```
[에리브 대기 신청 안내]
○○ 원장님, 지난번 경영진단 해주셔서 감사합니다.
에리브 베타 오픈을 앞두고 있고, 진단해주신 분들 먼저 초대해드릴 예정입니다.
아래에서 대기 신청해주시면 Wave 1 우선 배정해드려요.
▶ {waitlist_link}
```

**B. Wave 초대**
```
[에리브 Wave {N} 초대]
○○ 원장님, 에리브입니다.
대기하셨던 Wave {N} 오픈 알림 드립니다.
아래 링크로 48시간 내 가입 부탁드려요.
▶ {activation_link}
```

### 발송 플로우
- 관리자 대시보드에서 Wave 오픈 시 쿼리 → 체크박스 선택 → 일괄 발송 버튼
- 이메일은 Resend 등으로 백업 (알림톡 실패/차단 대비)

---

## 7. UTM 추적

플랫폼별 링크 예시:
```
쓰레드:        /waitlist?utm_source=threads&utm_campaign=launch
인스타 프로필: /waitlist?utm_source=instagram&utm_medium=bio
유튜브:        /waitlist?utm_source=youtube&utm_campaign=[영상제목]
```

- 랜딩 페이지에서 `window.location.search` + `document.referrer` 캡처
- OAuth 가입 시 sessionStorage/쿠키에 보관 → `users` 레코드에 저장
- 정확도 60-70% (iOS 사파리 referrer 유실) 감안 — "인스타 vs 유튜브 어디서 더 많이 왔나" 비교용

---

## 8. 진단 결과 매칭 로직

```sql
-- 진단 완료 훅에서
INSERT INTO diagnosis_responses (...) RETURNING id AS new_id;

-- 같은 user_id 또는 이메일의 대기자에 연결
UPDATE users
SET diagnosis_response_id = :new_id,
    updated_at = NOW()
WHERE id = :user_id
  AND diagnosis_response_id IS NULL;
```

유저한테 별도 UX 표시 불필요. 내부적으로 Wave 배정 때 자동 우선 정렬.

---

## 9. 관리자 기능

### Wave 배정 대시보드 (신규 페이지)
- 필터: `access_status`, `diagnosis_response_id IS NOT NULL`, `academy_size`, 가입일
- 체크박스로 N명 선택 → "Wave N 배정 + 알림톡 발송" 버튼
- 일괄 `wave_number`, `invited_at` 업데이트 + 알림톡 API 호출

### Track A 자동 추천
- 조건: `diagnosis_response_id IS NOT NULL AND academy_size IN ('30명+')`
- 별도 리스트로 노출 → 대표가 갠톡 영업 대상 확인

---

## 10. 구현 순서 (태스크 리스트)

### Phase 1 — DB & 기본 페이지 (오픈 전)
1. `users` 테이블 스키마 확장 (SQL 마이그레이션)
2. `/waitlist` 페이지 (주/보조 CTA)
3. `/waitlist/phone` 휴대폰 필수 입력 페이지 (OAuth 후 게이트)
4. `access_status` 기반 전역 라우팅 미들웨어
5. OAuth 콜백에 UTM 캡처 로직 삽입

### Phase 2 — 진단 연동
6. 진단 완료 훅에서 `users.diagnosis_response_id` 자동 연결
7. 진단 결과 페이지에 "대기 중 + 진단 혜택 적용" 표시

### Phase 3 — 관리자 & 발송 (알림톡 승인 받은 뒤)
8. 관리자 Wave 배정 대시보드
9. 알림톡 발송 API (알리고 연동)
10. 이메일 백업 발송 (Resend)

---

## 11. 미정 사항 (개발 착수 전 확정 필요)

- [ ] OAuth 제공자: 카카오만? 구글도? (카카오 필수, 구글은 선택)
- [ ] 알림톡 발송 업체 최종 확정 (알리고 가격/안정성 확인 후)
- [ ] 기존 진단 완료자 데이터 — DB에 얼마나 있고, 이메일/전화번호 수집돼 있는지 확인
- [ ] Wave 번호 수동 할당 vs 자동 계산 — 관리자가 수동 지정 권장 (초기)
- [ ] 선착순 몇 명까지 받고 마감할지 — Track B 1000명 한도 맞는지?

---

## 12. 피해야 할 것 (과설계 경계)

- ❌ 별도 `waitlist_signups` 테이블 (users로 통합하기)
- ❌ `priority_score` 자동 계산 로직 (진단 여부만 있으면 됨)
- ❌ 대기 번호 변화 UX ("#847 → #231 당겨짐") — 유저 FOMO 수치 노출 불필요
- ❌ 회원가입 자체 플로우 대규모 개편 (간편가입 유지, 휴대폰만 추가 게이트)
- ❌ 대기자 상태 조회 페이지 별도 개발 — 로그인하면 자동으로 대기 중 화면

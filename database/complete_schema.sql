-- =====================================================
-- EduRichSaaS 통합 스키마
-- 결제/구독/팀원/크레딧 관련 테이블
-- =====================================================
-- 실행 전 주의사항:
-- 1. 이미 존재하는 테이블 (accounts, academies, user_credits, payment_history)은
--    이 스키마에서 생성하지 않습니다.
-- 2. Supabase SQL Editor에서 실행하세요.
-- =====================================================


-- =====================================================
-- 0. 안 쓰는 테이블 삭제 (정리)
-- =====================================================
DROP TABLE IF EXISTS user_subscriptions CASCADE;


-- =====================================================
-- 1. subscriptions 테이블 (구독 정보)
-- =====================================================
-- 결제 완료 시 구독 정보가 저장되는 핵심 테이블

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_key TEXT NOT NULL UNIQUE,        -- 사용자 식별키 (user_id와 동일하게 사용)
  billing_key TEXT,                          -- 토스 빌링키 (정기결제용)
  plan_id TEXT NOT NULL,                     -- 'starter', 'growth', 'pro', 'enterprise'
  billing_cycle TEXT NOT NULL,               -- 'monthly', 'yearly'
  status TEXT DEFAULT 'active',              -- 'active', 'cancelled', 'expired'
  current_period_start TIMESTAMPTZ,          -- 현재 구독 기간 시작
  current_period_end TIMESTAMPTZ,            -- 현재 구독 기간 종료
  next_payment_date TIMESTAMPTZ,             -- 다음 결제 예정일
  last_payment_amount INTEGER,               -- 마지막 결제 금액
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_key ON subscriptions(customer_key);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_payment ON subscriptions(next_payment_date);

COMMENT ON TABLE subscriptions IS '
플랜별 정보 (VAT 포함):

[월간 결제]
- starter: 30,000원/월 / AI 1,500P / 원장 1명, 학생 30명
- growth: 99,000원/월 / AI 5,500P / 원장+직원 2명, 학생 100명
- pro: 249,000원/월 / AI 15,000P / 원장+직원 5명, 학생 300명
- enterprise: 599,000원/월 / AI 35,000P / 직원 무제한, 학생 무제한

[연간 결제] (20% 할인)
- starter: 24,000원/월 (연 288,000원)
- growth: 79,000원/월 (연 948,000원)
- pro: 199,000원/월 (연 2,388,000원)
- enterprise: 479,000원/월 (연 5,748,000원)
';


-- =====================================================
-- 2. billing_keys 테이블 (빌링키 저장)
-- =====================================================
-- 토스페이먼츠에서 발급받은 빌링키 저장

CREATE TABLE IF NOT EXISTS billing_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_key TEXT NOT NULL,                -- 사용자 식별키
  billing_key TEXT NOT NULL,                 -- 토스 빌링키
  card_company TEXT,                         -- 카드사
  card_number TEXT,                          -- 마스킹된 카드번호 (예: 1234****5678)
  card_type TEXT,                            -- 카드 타입 (신용/체크)
  authenticated_at TIMESTAMPTZ,              -- 인증 일시
  is_active BOOLEAN DEFAULT true,            -- 활성 상태
  raw_response JSONB,                        -- 토스 API 응답 원본
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_billing_keys_customer_key ON billing_keys(customer_key);
CREATE INDEX IF NOT EXISTS idx_billing_keys_is_active ON billing_keys(is_active);


-- =====================================================
-- 3. team_members 테이블 (팀원 관리)
-- =====================================================
-- 학원장이 추가한 강사/직원/알바 관리

CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  owner_user_id TEXT NOT NULL,               -- 구독 소유자 (학원장) ID
  member_user_id TEXT,                       -- 팀원 user_id (가입 완료 후 설정)
  member_email TEXT NOT NULL,                -- 팀원 이메일
  member_name TEXT,                          -- 팀원 이름
  role TEXT NOT NULL,                        -- 'instructor', 'staff', 'parttime'
  role_name TEXT,                            -- '강사', '직원', '알바'
  monthly_price INTEGER NOT NULL,            -- 13000, 8000, 4000
  status TEXT DEFAULT 'pending',             -- 'pending', 'active', 'inactive'
  invite_token TEXT UNIQUE,                  -- 초대 토큰
  invited_at TIMESTAMPTZ,                    -- 초대 발송 일시
  accepted_at TIMESTAMPTZ,                   -- 초대 수락 일시
  removed_at TIMESTAMPTZ,                    -- 제거 일시
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_role CHECK (role IN ('instructor', 'staff', 'parttime')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'inactive'))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_subscription ON team_members(subscription_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_members_invite_token ON team_members(invite_token);
CREATE INDEX IF NOT EXISTS idx_team_members_member_email ON team_members(member_email);

COMMENT ON TABLE team_members IS '
역할별 월 비용:
- instructor (강사): 13,000원/월
- staff (직원): 8,000원/월
- parttime (알바): 4,000원/월
';


-- =====================================================
-- 4. credit_history 테이블 (포인트 내역)
-- =====================================================
-- AI 포인트 충전/차감 내역

CREATE TABLE IF NOT EXISTS credit_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,                     -- 사용자 ID
  amount INTEGER NOT NULL,                   -- 변동량 (양수: 충전, 음수: 차감)
  type TEXT NOT NULL,                        -- 'add', 'deduct'
  reason TEXT NOT NULL,                      -- 변동 사유
  balance_after INTEGER NOT NULL,            -- 변동 후 잔액
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('add', 'deduct'))
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON credit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_created_at ON credit_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_history_type ON credit_history(type);

COMMENT ON TABLE credit_history IS '
reason 예시:
- subscription: 구독 플랜 포인트 지급
- credit_package: 포인트 패키지 구매
- blog_generation: 블로그 생성 (차감)
- consultation_report: 상담 보고서 (차감)
- ai_chatbot: AI 챗봇 사용 (차감)
';


-- =====================================================
-- 5. RLS (Row Level Security) 정책
-- =====================================================

-- subscriptions RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (customer_key = auth.uid()::TEXT);

DROP POLICY IF EXISTS "Service role full access subscriptions" ON subscriptions;
CREATE POLICY "Service role full access subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- billing_keys RLS
ALTER TABLE billing_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own billing_keys" ON billing_keys;
CREATE POLICY "Users can view own billing_keys" ON billing_keys
  FOR SELECT USING (customer_key = auth.uid()::TEXT);

DROP POLICY IF EXISTS "Service role full access billing_keys" ON billing_keys;
CREATE POLICY "Service role full access billing_keys" ON billing_keys
  FOR ALL USING (auth.role() = 'service_role');

-- team_members RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can manage team members" ON team_members;
CREATE POLICY "Owner can manage team members" ON team_members
  FOR ALL USING (owner_user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS "Member can view own info" ON team_members;
CREATE POLICY "Member can view own info" ON team_members
  FOR SELECT USING (member_user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS "Service role full access team_members" ON team_members;
CREATE POLICY "Service role full access team_members" ON team_members
  FOR ALL USING (auth.role() = 'service_role');

-- credit_history RLS
ALTER TABLE credit_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credit history" ON credit_history;
CREATE POLICY "Users can view own credit history" ON credit_history
  FOR SELECT USING (user_id = auth.uid()::TEXT);

DROP POLICY IF EXISTS "Service role full access credit_history" ON credit_history;
CREATE POLICY "Service role full access credit_history" ON credit_history
  FOR ALL USING (auth.role() = 'service_role');


-- =====================================================
-- 6. 유틸리티 함수
-- =====================================================

-- 역할별 월 가격 조회
CREATE OR REPLACE FUNCTION get_team_role_price(p_role TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'instructor' THEN 13000
    WHEN 'staff' THEN 8000
    WHEN 'parttime' THEN 4000
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql;

-- 팀원 총 비용 계산
CREATE OR REPLACE FUNCTION get_team_total_cost(p_owner_user_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE((
    SELECT SUM(monthly_price)
    FROM team_members
    WHERE owner_user_id = p_owner_user_id
      AND status IN ('pending', 'active')
  ), 0);
END;
$$ LANGUAGE plpgsql;

-- 일할 계산 (다음 결제일까지 남은 일수 기준)
CREATE OR REPLACE FUNCTION calculate_prorated_amount(
  p_monthly_price INTEGER,
  p_next_payment_date TIMESTAMPTZ
)
RETURNS INTEGER AS $$
DECLARE
  days_remaining INTEGER;
BEGIN
  days_remaining := GREATEST(EXTRACT(DAY FROM (p_next_payment_date - NOW()))::INTEGER, 1);
  RETURN CEIL((p_monthly_price / 30.0) * days_remaining);
END;
$$ LANGUAGE plpgsql;

-- 플랜별 AI 포인트 조회
CREATE OR REPLACE FUNCTION get_plan_credits(p_plan_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_plan_id
    WHEN 'starter' THEN 1500
    WHEN 'growth' THEN 5500
    WHEN 'pro' THEN 15000
    WHEN 'enterprise' THEN 35000
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql;

-- 크레딧 충전 함수
CREATE OR REPLACE FUNCTION add_user_credits(
  p_user_id TEXT,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'subscription'
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- user_credits 테이블 업데이트 (없으면 생성)
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    credits = user_credits.credits + p_amount,
    updated_at = NOW();

  -- 새 잔액 조회
  SELECT credits INTO new_balance
  FROM user_credits
  WHERE user_id = p_user_id;

  -- 히스토리 기록
  INSERT INTO credit_history (user_id, amount, type, reason, balance_after)
  VALUES (p_user_id, p_amount, 'add', p_reason, new_balance);

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;

-- 크레딧 차감 함수
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id TEXT,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'ai_usage'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- 현재 잔액 확인
  SELECT credits INTO current_balance
  FROM user_credits
  WHERE user_id = p_user_id;

  -- 잔액 부족 체크
  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  -- 차감
  UPDATE user_credits
  SET credits = credits - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- 히스토리 기록
  INSERT INTO credit_history (user_id, amount, type, reason, balance_after)
  VALUES (p_user_id, -p_amount, 'deduct', p_reason, current_balance - p_amount);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 7. updated_at 자동 갱신 트리거
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- subscriptions 트리거
DROP TRIGGER IF EXISTS trigger_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- billing_keys 트리거
DROP TRIGGER IF EXISTS trigger_billing_keys_updated_at ON billing_keys;
CREATE TRIGGER trigger_billing_keys_updated_at
  BEFORE UPDATE ON billing_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- team_members 트리거
DROP TRIGGER IF EXISTS trigger_team_members_updated_at ON team_members;
CREATE TRIGGER trigger_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- 완료!
-- =====================================================
-- 이 스키마를 실행하면 다음 테이블이 생성됩니다:
-- 1. subscriptions - 구독 정보
-- 2. billing_keys - 빌링키 저장
-- 3. team_members - 팀원 관리
-- 4. credit_history - 포인트 내역
--
-- 기존 테이블 (accounts, academies, user_credits, payment_history)은
-- 그대로 유지됩니다.
-- =====================================================

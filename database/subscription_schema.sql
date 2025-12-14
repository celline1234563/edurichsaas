-- 구독 및 크레딧 시스템 테이블 스키마
-- Supabase에서 실행해주세요
-- ⚠️ 이 스크립트는 edurichbrain과 공유하는 Supabase DB에서 실행됩니다

-- ============================================
-- 1. 사용자 구독 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL, -- 'starter', 'growth', 'pro', 'enterprise'
  billing_cycle TEXT NOT NULL, -- 'monthly', 'yearly'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 (이미 존재하면 무시)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON user_subscriptions(user_id, is_active);

-- ============================================
-- 2. 사용자 크레딧 테이블 (이미 존재할 수 있음)
-- ============================================
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);

-- ============================================
-- 3. 크레딧 사용 내역 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS credit_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- 양수: 충전, 음수: 차감
  type TEXT NOT NULL, -- 'add', 'deduct'
  reason TEXT NOT NULL, -- 'subscription', 'ai_usage', 'blog_generation', 'consultation_report', 등
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_credit_history_user_id ON credit_history(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_history_created_at ON credit_history(created_at DESC);

-- ============================================
-- 4. 결제 내역 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL, -- 결제 금액 (원)
  payment_type TEXT NOT NULL, -- 'subscription', 'credit_package'
  plan_id TEXT, -- 구독인 경우
  package_id TEXT, -- 크레딧 패키지인 경우
  credits_granted INTEGER, -- 지급된 크레딧
  payment_method TEXT, -- 'card', 'bank_transfer', etc
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  transaction_id TEXT, -- 외부 결제 시스템 트랜잭션 ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_status ON payment_history(payment_status);

-- ============================================
-- 5. 크레딧 차감 함수 (CREATE OR REPLACE로 안전하게 업데이트)
-- ============================================
CREATE OR REPLACE FUNCTION deduct_user_credit(p_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id;

  IF current_credits IS NULL OR current_credits < 1 THEN
    RETURN FALSE;
  END IF;

  UPDATE user_credits
  SET credits = credits - 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO credit_history (user_id, amount, type, reason, balance_after)
  VALUES (p_user_id, -1, 'deduct', 'ai_usage', current_credits - 1);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. 크레딧 충전 함수
-- ============================================
CREATE OR REPLACE FUNCTION add_user_credits(
  p_user_id TEXT,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'subscription'
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- UPSERT: 없으면 생성, 있으면 업데이트
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    credits = user_credits.credits + p_amount,
    updated_at = NOW();

  SELECT credits INTO new_balance
  FROM user_credits
  WHERE user_id = p_user_id;

  INSERT INTO credit_history (user_id, amount, type, reason, balance_after)
  VALUES (p_user_id, p_amount, 'add', p_reason, new_balance);

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. 특정 금액의 크레딧 차감 함수
-- ============================================
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id TEXT,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'ai_usage'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id;

  IF current_credits IS NULL OR current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE user_credits
  SET credits = credits - p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO credit_history (user_id, amount, type, reason, balance_after)
  VALUES (p_user_id, -p_amount, 'deduct', p_reason, current_credits - p_amount);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. RLS (Row Level Security) 정책
-- ⚠️ 기존 정책이 있으면 삭제 후 재생성
-- ============================================

-- RLS 활성화
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- user_subscriptions 정책
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Service role full access subscriptions" ON user_subscriptions;

CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Service role full access subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- user_credits 정책
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role full access credits" ON user_credits;

CREATE POLICY "Users can view own credits" ON user_credits
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Service role full access credits" ON user_credits
  FOR ALL USING (auth.role() = 'service_role');

-- credit_history 정책
DROP POLICY IF EXISTS "Users can view own credit history" ON credit_history;
DROP POLICY IF EXISTS "Service role full access credit_history" ON credit_history;

CREATE POLICY "Users can view own credit history" ON credit_history
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Service role full access credit_history" ON credit_history
  FOR ALL USING (auth.role() = 'service_role');

-- payment_history 정책
DROP POLICY IF EXISTS "Users can view own payment history" ON payment_history;
DROP POLICY IF EXISTS "Service role full access payment_history" ON payment_history;

CREATE POLICY "Users can view own payment history" ON payment_history
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Service role full access payment_history" ON payment_history
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 9. 플랜별 크레딧 상수 (참고용)
-- ============================================
COMMENT ON TABLE user_subscriptions IS '
플랜별 월간 AI 포인트:
- starter: 1,500P
- growth: 5,500P
- pro: 15,000P
- enterprise: 35,000P

추가 크레딧 패키지:
- 베이직: 10,000P / 33,000원
- 스탠다드: 18,000P / 55,000원 (20% 보너스)
- 프리미엄: 40,000P / 110,000원 (33% 보너스)
';

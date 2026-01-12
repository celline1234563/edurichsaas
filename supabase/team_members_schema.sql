-- =====================================================
-- 팀 멤버 테이블 스키마
-- 팀 확장 옵션: 강사/직원/알바 추가 관리
-- =====================================================

-- 팀 멤버 테이블
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  owner_user_id TEXT NOT NULL,  -- 구독 소유자 (학원장)
  member_user_id TEXT,  -- 가입 완료된 팀원 user_id (가입 전엔 null)
  member_email TEXT NOT NULL,
  member_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('instructor', 'staff', 'parttime')),  -- 강사, 직원, 알바
  monthly_price INTEGER NOT NULL,  -- 13000, 8000, 4000
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  invite_token TEXT UNIQUE,  -- 초대 토큰 (가입 링크용)
  invite_sent_at TIMESTAMPTZ,
  invite_accepted_at TIMESTAMPTZ,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  removed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_subscription ON team_members(subscription_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_members_invite_token ON team_members(invite_token);
CREATE INDEX IF NOT EXISTS idx_team_members_member_email ON team_members(member_email);

-- 역할별 월 가격 상수
-- instructor (강사): 13,000원/월
-- staff (직원): 8,000원/월
-- parttime (알바): 4,000원/월

-- 역할별 가격 조회 함수
CREATE OR REPLACE FUNCTION get_team_role_price(p_role TEXT)
RETURNS INTEGER AS $$
BEGIN
  CASE p_role
    WHEN 'instructor' THEN RETURN 13000;
    WHEN 'staff' THEN RETURN 8000;
    WHEN 'parttime' THEN RETURN 4000;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 구독의 팀원 총 비용 계산 함수
CREATE OR REPLACE FUNCTION get_team_total_cost(p_subscription_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_cost INTEGER;
BEGIN
  SELECT COALESCE(SUM(monthly_price), 0)
  INTO total_cost
  FROM team_members
  WHERE subscription_id = p_subscription_id
    AND status IN ('pending', 'active');

  RETURN total_cost;
END;
$$ LANGUAGE plpgsql;

-- 일할 계산 함수 (남은 일수 기준)
CREATE OR REPLACE FUNCTION calculate_prorated_amount(
  p_monthly_price INTEGER,
  p_next_payment_date TIMESTAMPTZ
)
RETURNS INTEGER AS $$
DECLARE
  days_remaining INTEGER;
  daily_rate NUMERIC;
BEGIN
  -- 다음 결제일까지 남은 일수 계산
  days_remaining := EXTRACT(DAY FROM (p_next_payment_date - NOW()));

  -- 일할 계산 (월 30일 기준)
  daily_rate := p_monthly_price / 30.0;

  RETURN CEIL(daily_rate * days_remaining);
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_team_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_members_updated_at();

-- RLS (Row Level Security) 정책
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 소유자는 자신의 팀원 조회/수정 가능
CREATE POLICY team_members_owner_policy ON team_members
  FOR ALL
  USING (owner_user_id = auth.uid()::TEXT);

-- 팀원은 자신의 정보만 조회 가능
CREATE POLICY team_members_self_policy ON team_members
  FOR SELECT
  USING (member_user_id = auth.uid()::TEXT);

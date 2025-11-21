-- ============================================
-- EduRichSaaS Database Schema
-- ============================================

-- 사용자 크레딧 테이블
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 학생 테이블
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  grade VARCHAR(20),
  school VARCHAR(100),
  phone VARCHAR(20),
  parent_phone VARCHAR(20),
  email VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, graduated
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 평가 테이블
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  evaluation_date DATE NOT NULL,
  comprehension_score INTEGER, -- 이해도 점수 (1-10)
  attitude_score INTEGER, -- 태도 점수 (1-10)
  concentration_score INTEGER, -- 집중도 점수 (1-10)
  homework_score INTEGER, -- 숙제 완성도 점수 (1-10)
  participation_score INTEGER, -- 수업 참여도 점수 (1-10)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 성적 테이블
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  exam_type VARCHAR(50) NOT NULL, -- midterm, final, mock, etc.
  subject VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  total_score INTEGER DEFAULT 100,
  rank INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보고서 테이블
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- weekly, monthly, consultation
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  period_start DATE,
  period_end DATE,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 커리큘럼 테이블
CREATE TABLE IF NOT EXISTS curriculum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(50) NOT NULL,
  level VARCHAR(50),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content JSONB, -- 커리큘럼 상세 내용 (JSON 형태)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 상담 이력 테이블
CREATE TABLE IF NOT EXISTS consultation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  consultation_date DATE NOT NULL,
  consultant_name VARCHAR(100),
  consultation_type VARCHAR(50), -- initial, follow_up, parent, etc.
  summary TEXT NOT NULL,
  action_items TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초간단 일지 테이블 (v2)
CREATE TABLE IF NOT EXISTS daily_simple_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  attendance BOOLEAN DEFAULT true,
  homework_completed BOOLEAN DEFAULT false,
  class_attitude VARCHAR(50), -- excellent, good, average, poor
  today_topic VARCHAR(200),
  quick_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 자동 수집 데이터 테이블 (v2)
CREATE TABLE IF NOT EXISTS auto_collected_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  data_date DATE NOT NULL,
  data_type VARCHAR(50) NOT NULL, -- test_result, homework, etc.
  data_value JSONB NOT NULL, -- 수집된 데이터 (JSON 형태)
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 역할 테이블
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- director, teacher, staff, part_time
  display_name VARCHAR(100),
  permissions JSONB, -- 권한 설정 (JSON 형태)
  assigned_student_ids UUID[], -- 담당 학생 ID 배열
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 인덱스 생성
-- ============================================
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_evaluations_student_id ON evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_date ON evaluations(evaluation_date);
CREATE INDEX IF NOT EXISTS idx_scores_student_id ON scores(student_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(exam_date);
CREATE INDEX IF NOT EXISTS idx_reports_student_id ON reports(student_id);
CREATE INDEX IF NOT EXISTS idx_consultation_student_id ON consultation_history(student_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_student_id ON daily_simple_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_simple_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_auto_data_student_id ON auto_collected_data(student_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

-- students 테이블 RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own students"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own students"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students"
  ON students FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students"
  ON students FOR DELETE
  USING (auth.uid() = user_id);

-- evaluations 테이블 RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluations of their students"
  ON evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = evaluations.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert evaluations for their students"
  ON evaluations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = evaluations.student_id
      AND students.user_id = auth.uid()
    )
  );

-- scores 테이블 RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view scores of their students"
  ON scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = scores.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert scores for their students"
  ON scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = scores.student_id
      AND students.user_id = auth.uid()
    )
  );

-- reports 테이블 RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports of their students"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = reports.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reports for their students"
  ON reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = reports.student_id
      AND students.user_id = auth.uid()
    )
  );

-- user_credits 테이블 RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 함수 생성
-- ============================================

-- 크레딧 차감 함수
CREATE OR REPLACE FUNCTION deduct_user_credit(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits INTEGER;
  v_result JSONB;
BEGIN
  -- 현재 크레딧 확인
  SELECT credits INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id;

  IF v_current_credits IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User credits not found');
  END IF;

  IF v_current_credits <= 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Insufficient credits');
  END IF;

  -- 크레딧 차감
  UPDATE user_credits
  SET credits = credits - 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object('success', true, 'remaining_credits', v_current_credits - 1);
END;
$$;

-- 기본 권한 가져오기 함수
CREATE OR REPLACE FUNCTION get_default_permissions(p_role VARCHAR)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'director' THEN '{"view_all": true, "edit_all": true, "delete_all": true, "manage_users": true}'::JSONB
    WHEN 'teacher' THEN '{"view_assigned": true, "edit_assigned": true, "create_reports": true}'::JSONB
    WHEN 'staff' THEN '{"view_assigned": true, "edit_assigned": true}'::JSONB
    WHEN 'part_time' THEN '{"view_assigned": true}'::JSONB
    ELSE '{}'::JSONB
  END;
END;
$$;

-- 사용자 권한 확인 함수
CREATE OR REPLACE FUNCTION user_has_permission(p_user_id UUID, p_permission VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_permissions JSONB;
BEGIN
  SELECT permissions INTO v_permissions
  FROM user_roles
  WHERE user_id = p_user_id AND is_active = true;

  IF v_permissions IS NULL THEN
    RETURN false;
  END IF;

  RETURN (v_permissions->p_permission)::BOOLEAN;
END;
$$;

-- 학생 접근 권한 확인 함수
CREATE OR REPLACE FUNCTION user_can_access_student(p_user_id UUID, p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_role VARCHAR;
  v_assigned_students UUID[];
BEGIN
  SELECT role, assigned_student_ids INTO v_role, v_assigned_students
  FROM user_roles
  WHERE user_id = p_user_id AND is_active = true;

  -- director는 모든 학생 접근 가능
  IF v_role = 'director' THEN
    RETURN true;
  END IF;

  -- 담당 학생인지 확인
  IF p_student_id = ANY(v_assigned_students) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- 주간 AI 평가 생성 함수 (placeholder)
CREATE OR REPLACE FUNCTION generate_weekly_ai_evaluation(
  p_student_id UUID,
  p_week_start DATE,
  p_week_end DATE
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  -- 실제 AI 평가 로직은 애플리케이션에서 처리
  -- 이 함수는 필요한 데이터를 수집하여 반환
  RETURN jsonb_build_object(
    'student_id', p_student_id,
    'period', jsonb_build_object('start', p_week_start, 'end', p_week_end),
    'message', 'Data collected for AI evaluation'
  );
END;
$$;

-- ============================================
-- 뷰 생성
-- ============================================

-- 사용자 권한 뷰
CREATE OR REPLACE VIEW user_permissions_view AS
SELECT
  u.id AS user_id,
  u.email,
  u.created_at AS user_created_at,
  ur.role,
  ur.display_name,
  ur.permissions,
  ur.assigned_student_ids,
  ur.is_active
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- ============================================
-- 초기 데이터
-- ============================================

-- 샘플 커리큘럼 데이터
INSERT INTO curriculum (subject, level, title, description, is_active) VALUES
('수학', '중1', '중학교 1학년 수학', '중학교 1학년 수학 전체 커리큘럼', true),
('영어', '중1', '중학교 1학년 영어', '중학교 1학년 영어 전체 커리큘럼', true),
('수학', '중2', '중학교 2학년 수학', '중학교 2학년 수학 전체 커리큘럼', true),
('영어', '중2', '중학교 2학년 영어', '중학교 2학년 영어 전체 커리큘럼', true)
ON CONFLICT DO NOTHING;

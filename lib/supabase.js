import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// 사용자 인증
// ============================================
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserCredits = async (userId) => {
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data;
};

export const deductCredit = async (userId) => {
  const { data, error } = await supabase.rpc('deduct_user_credit', {
    p_user_id: userId
  });

  return { data, error };
};

// ============================================
// 학생 관리
// ============================================
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getStudentById = async (studentId) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', studentId)
    .single();

  if (error) throw error;
  return data;
};

export const createStudent = async (studentData) => {
  const { data, error } = await supabase
    .from('students')
    .insert([studentData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateStudent = async (studentId, updates) => {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteStudent = async (studentId) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId);

  if (error) throw error;
};

// ============================================
// 평가 관리
// ============================================
export const getEvaluationsByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('student_id', studentId)
    .order('evaluation_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const createEvaluation = async (evaluationData) => {
  const { data, error } = await supabase
    .from('evaluations')
    .insert([evaluationData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEvaluationsByDateRange = async (studentId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('student_id', studentId)
    .gte('evaluation_date', startDate)
    .lte('evaluation_date', endDate)
    .order('evaluation_date', { ascending: true });

  if (error) throw error;
  return data;
};

// ============================================
// 성적 관리
// ============================================
export const getScoresByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('student_id', studentId)
    .order('exam_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const createScore = async (scoreData) => {
  const { data, error } = await supabase
    .from('scores')
    .insert([scoreData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getScoresByDateRange = async (studentId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('student_id', studentId)
    .gte('exam_date', startDate)
    .lte('exam_date', endDate)
    .order('exam_date', { ascending: true });

  if (error) throw error;
  return data;
};

export const getScoresByTypes = async (studentId, examTypes, startDate, endDate) => {
  let query = supabase
    .from('scores')
    .select('*')
    .eq('student_id', studentId);

  if (examTypes && examTypes.length > 0) {
    query = query.in('exam_type', examTypes);
  }

  if (startDate) {
    query = query.gte('exam_date', startDate);
  }

  if (endDate) {
    query = query.lte('exam_date', endDate);
  }

  const { data, error } = await query.order('exam_date', { ascending: true });

  if (error) throw error;
  return data;
};

// ============================================
// 보고서 관리
// ============================================
export const getReportsByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('student_id', studentId)
    .order('generated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateReport = async (reportId, updates) => {
  const { data, error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// 커리큘럼 관리
// ============================================
export const getActiveCurriculum = async (subject = '수학') => {
  const { data, error } = await supabase
    .from('curriculum')
    .select('*')
    .eq('subject', subject)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

export const getAllCurriculum = async () => {
  const { data, error } = await supabase
    .from('curriculum')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ============================================
// 상담 이력 관리
// ============================================
export const getConsultationHistory = async (studentId) => {
  const { data, error } = await supabase
    .from('consultation_history')
    .select('*')
    .eq('student_id', studentId)
    .order('consultation_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const createConsultation = async (consultationData) => {
  const { data, error } = await supabase
    .from('consultation_history')
    .insert([consultationData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================
// 초간단 일지 관리 (v2)
// ============================================
export const createSimpleLog = async (logData) => {
  const { data, error } = await supabase
    .from('daily_simple_logs')
    .insert([logData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSimpleLog = async (logId, updates) => {
  const { data, error } = await supabase
    .from('daily_simple_logs')
    .update(updates)
    .eq('id', logId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSimpleLogsByStudent = async (studentId, startDate, endDate) => {
  let query = supabase
    .from('daily_simple_logs')
    .select('*')
    .eq('student_id', studentId);

  if (startDate) {
    query = query.gte('log_date', startDate);
  }

  if (endDate) {
    query = query.lte('log_date', endDate);
  }

  const { data, error } = await query.order('log_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const getSimpleLogsByDate = async (date) => {
  const { data, error } = await supabase
    .from('daily_simple_logs')
    .select('*')
    .eq('log_date', date)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ============================================
// 자동 수집 데이터 관리 (v2)
// ============================================
export const createAutoData = async (autoData) => {
  const { data, error } = await supabase
    .from('auto_collected_data')
    .insert([autoData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAutoData = async (dataId, updates) => {
  const { data, error } = await supabase
    .from('auto_collected_data')
    .update(updates)
    .eq('id', dataId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAutoDataByStudent = async (studentId, startDate, endDate) => {
  let query = supabase
    .from('auto_collected_data')
    .select('*')
    .eq('student_id', studentId);

  if (startDate) {
    query = query.gte('data_date', startDate);
  }

  if (endDate) {
    query = query.lte('data_date', endDate);
  }

  const { data, error } = await query.order('data_date', { ascending: false });

  if (error) throw error;
  return data;
};

// ============================================
// AI 주간 평가 생성
// ============================================
export const generateWeeklyAIEvaluation = async (studentId, weekStart, weekEnd) => {
  const { data, error } = await supabase.rpc('generate_weekly_ai_evaluation', {
    p_student_id: studentId,
    p_week_start: weekStart,
    p_week_end: weekEnd
  });

  if (error) throw error;
  return data;
};

// ============================================
// 역할 및 권한 관리
// ============================================
export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

export const getCurrentUserRole = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  return await getUserRole(user.id);
};

export const updateUserRole = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_roles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createUserRole = async (userId, role, displayName, assignedStudentIds = []) => {
  const { data: defaultPerms } = await supabase.rpc('get_default_permissions', {
    p_role: role
  });

  const { data, error } = await supabase
    .from('user_roles')
    .insert([{
      user_id: userId,
      role: role,
      display_name: displayName,
      permissions: defaultPerms,
      assigned_student_ids: assignedStudentIds
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_permissions_view')
    .select('*')
    .order('user_created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const hasPermission = async (userId, permission) => {
  const { data, error } = await supabase.rpc('user_has_permission', {
    p_user_id: userId,
    p_permission: permission
  });

  if (error) throw error;
  return data;
};

export const canAccessStudent = async (userId, studentId) => {
  const { data, error } = await supabase.rpc('user_can_access_student', {
    p_user_id: userId,
    p_student_id: studentId
  });

  if (error) throw error;
  return data;
};

// ============================================
// 구독 및 크레딧 관리
// ============================================

// 사용자 구독 상태 확인
export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  return data;
};

// 구독 생성/업데이트
export const createOrUpdateSubscription = async (userId, planId, billingCycle, expiresAt) => {
  // 먼저 기존 구독 비활성화
  await supabase
    .from('user_subscriptions')
    .update({ is_active: false })
    .eq('user_id', userId);

  // 새 구독 생성
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert([{
      user_id: userId,
      plan_id: planId,
      billing_cycle: billingCycle,
      started_at: new Date().toISOString(),
      expires_at: expiresAt,
      is_active: true
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// AI 포인트 충전
export const addCredits = async (userId, amount, reason = 'subscription') => {
  // 현재 크레딧 조회
  const { data: currentCredits } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', userId)
    .single();

  if (currentCredits) {
    // 기존 레코드 업데이트
    const { data, error } = await supabase
      .from('user_credits')
      .update({
        credits: currentCredits.credits + amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // 크레딧 히스토리 기록
    await supabase.from('credit_history').insert([{
      user_id: userId,
      amount: amount,
      type: 'add',
      reason: reason,
      balance_after: currentCredits.credits + amount
    }]);

    return data;
  } else {
    // 새 레코드 생성
    const { data, error } = await supabase
      .from('user_credits')
      .insert([{
        user_id: userId,
        credits: amount
      }])
      .select()
      .single();

    if (error) throw error;

    // 크레딧 히스토리 기록
    await supabase.from('credit_history').insert([{
      user_id: userId,
      amount: amount,
      type: 'add',
      reason: reason,
      balance_after: amount
    }]);

    return data;
  }
};

// AI 포인트 차감 (특정 금액)
export const deductCredits = async (userId, amount, reason = 'ai_usage') => {
  const { data: currentCredits } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', userId)
    .single();

  if (!currentCredits || currentCredits.credits < amount) {
    return { success: false, error: 'insufficient_credits' };
  }

  const newBalance = currentCredits.credits - amount;

  const { data, error } = await supabase
    .from('user_credits')
    .update({
      credits: newBalance,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // 크레딧 히스토리 기록
  await supabase.from('credit_history').insert([{
    user_id: userId,
    amount: -amount,
    type: 'deduct',
    reason: reason,
    balance_after: newBalance
  }]);

  return { success: true, data, remaining: newBalance };
};

// 크레딧 히스토리 조회
export const getCreditHistory = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('credit_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// 사용자가 서비스 이용 가능한지 확인 (구독 + 크레딧)
export const canUseService = async (userId, requiredCredits = 0) => {
  // 구독 상태 확인
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return {
      canUse: false,
      reason: 'no_subscription',
      message: '구독이 필요합니다.'
    };
  }

  // 구독 만료 확인
  if (new Date(subscription.expires_at) < new Date()) {
    return {
      canUse: false,
      reason: 'subscription_expired',
      message: '구독이 만료되었습니다.'
    };
  }

  // 크레딧 확인 (필요한 경우)
  if (requiredCredits > 0) {
    const credits = await getUserCredits(userId);
    if (!credits || credits.credits < requiredCredits) {
      return {
        canUse: false,
        reason: 'insufficient_credits',
        message: '크레딧이 부족합니다.',
        currentCredits: credits?.credits || 0,
        requiredCredits
      };
    }
  }

  return {
    canUse: true,
    subscription,
    message: '서비스 이용 가능'
  };
};

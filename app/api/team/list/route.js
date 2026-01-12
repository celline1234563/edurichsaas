import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ROLE_NAMES = {
  instructor: '강사',
  staff: '직원',
  parttime: '알바'
}

export async function GET(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 팀 멤버 목록 조회
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_user_id', userId)
      .in('status', ['pending', 'active'])
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch team members:', error)
      return NextResponse.json(
        { success: false, message: '팀원 목록 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 역할별 집계
    const summary = {
      instructor: { count: 0, cost: 0 },
      staff: { count: 0, cost: 0 },
      parttime: { count: 0, cost: 0 }
    }

    let totalMonthlyCost = 0

    members.forEach(member => {
      if (summary[member.role]) {
        summary[member.role].count++
        summary[member.role].cost += member.monthly_price
        totalMonthlyCost += member.monthly_price
      }
    })

    // 멤버 데이터 포맷팅
    const formattedMembers = members.map(member => ({
      id: member.id,
      email: member.member_email,
      name: member.member_name,
      role: member.role,
      roleName: ROLE_NAMES[member.role] || member.role,
      monthlyPrice: member.monthly_price,
      status: member.status,
      addedAt: member.added_at,
      inviteAcceptedAt: member.invite_accepted_at
    }))

    return NextResponse.json({
      success: true,
      data: {
        members: formattedMembers,
        summary: {
          instructor: {
            name: '강사',
            count: summary.instructor.count,
            cost: summary.instructor.cost
          },
          staff: {
            name: '직원',
            count: summary.staff.count,
            cost: summary.staff.cost
          },
          parttime: {
            name: '알바',
            count: summary.parttime.count,
            cost: summary.parttime.cost
          }
        },
        totalMembers: members.length,
        totalMonthlyCost
      }
    })
  } catch (error) {
    console.error('List team members error:', error)
    return NextResponse.json(
      { success: false, message: '팀원 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

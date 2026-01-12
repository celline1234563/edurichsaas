import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { memberId, userId } = await request.json()

    if (!memberId || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 팀 멤버 조회 및 소유자 확인
    const { data: teamMember, error: findError } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', memberId)
      .eq('owner_user_id', userId)
      .single()

    if (findError || !teamMember) {
      return NextResponse.json(
        { success: false, message: '팀원을 찾을 수 없거나 권한이 없습니다.' },
        { status: 404 }
      )
    }

    if (teamMember.status === 'inactive') {
      return NextResponse.json(
        { success: false, message: '이미 비활성화된 팀원입니다.' },
        { status: 400 }
      )
    }

    // 팀 멤버 비활성화 (다음 결제에서 제외)
    const { error: updateError } = await supabase
      .from('team_members')
      .update({
        status: 'inactive',
        removed_at: new Date().toISOString()
      })
      .eq('id', memberId)

    if (updateError) {
      console.error('Failed to remove team member:', updateError)
      return NextResponse.json(
        { success: false, message: '팀원 삭제에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '팀원이 삭제되었습니다. 다음 결제부터 비용이 차감됩니다.',
      data: {
        memberId,
        memberEmail: teamMember.member_email,
        removedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Remove team member error:', error)
    return NextResponse.json(
      { success: false, message: '팀원 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

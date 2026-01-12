import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { inviteToken, userId } = await request.json()

    if (!inviteToken || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 초대 토큰으로 팀 멤버 조회
    const { data: teamMember, error: findError } = await supabase
      .from('team_members')
      .select('*')
      .eq('invite_token', inviteToken)
      .eq('status', 'pending')
      .single()

    if (findError || !teamMember) {
      return NextResponse.json(
        { success: false, message: '유효하지 않거나 이미 사용된 초대입니다.' },
        { status: 404 }
      )
    }

    // 팀 멤버 상태 업데이트
    const { data: updatedMember, error: updateError } = await supabase
      .from('team_members')
      .update({
        member_user_id: userId,
        status: 'active',
        invite_accepted_at: new Date().toISOString()
      })
      .eq('id', teamMember.id)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to accept invitation:', updateError)
      return NextResponse.json(
        { success: false, message: '초대 수락에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '초대가 수락되었습니다.',
      data: {
        teamMemberId: updatedMember.id,
        role: updatedMember.role,
        ownerUserId: updatedMember.owner_user_id
      }
    })
  } catch (error) {
    console.error('Accept invitation error:', error)
    return NextResponse.json(
      { success: false, message: '초대 수락 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'

// 토스페이먼츠 클라이언트 키
const TOSS_CLIENT_KEY = 'test_ck_yZqmkKeP8gpnEQad79Pn3bQRxB9l'

// 팀원 역할별 가격
const TEAM_ROLE_PRICES = {
  instructor: { name: '강사', price: 13000 },
  staff: { name: '직원', price: 8000 },
  parttime: { name: '알바', price: 4000 }
}

export default function PaymentPage() {
  const isMobile = useIsMobile()
  const [paymentType, setPaymentType] = useState('subscription') // subscription, recharge, or team
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [userData, setUserData] = useState(null)
  const [sdkReady, setSdkReady] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [subscriptionChecking, setSubscriptionChecking] = useState(false)

  // 팀원 추가 관련 상태
  const [teamMembers, setTeamMembers] = useState([]) // 기존 팀원 목록
  const [teamMembersCost, setTeamMembersCost] = useState(0)
  const [newMember, setNewMember] = useState({ email: '', name: '', role: 'instructor' })
  const [teamLoading, setTeamLoading] = useState(false)
  const [subscriptionInfo, setSubscriptionInfo] = useState(null)

  // 구독 결제 시 함께 추가할 팀원 목록 (신규 구독용)
  const [pendingTeamMembers, setPendingTeamMembers] = useState([])
  const [showTeamSection, setShowTeamSection] = useState(false)

  const paymentRef = useRef(null)

  // 구독 플랜
  const plans = [
    { id: 'starter', name: 'Starter', monthlyPrice: 30000, yearlyPrice: 230000, aiPoints: 1500 },
    { id: 'growth', name: 'Growth', monthlyPrice: 99000, yearlyPrice: 790000, aiPoints: 5500 },
    { id: 'pro', name: 'Pro', monthlyPrice: 249000, yearlyPrice: 1990000, aiPoints: 15000 },
    { id: 'enterprise', name: 'Enterprise', monthlyPrice: 599000, yearlyPrice: 4800000, aiPoints: 40000 }
  ]

  // 포인트 충전 패키지
  const pointPackages = [
    { id: 'basic', name: '베이직 패키지', price: 33000, points: 10000, bonus: null, pricePerPoint: 3.3 },
    { id: 'standard', name: '스탠다드 패키지', price: 55000, points: 18000, bonus: '20%', pricePerPoint: 3.06, recommended: true },
    { id: 'premium', name: '프리미엄 패키지', price: 110000, points: 40000, bonus: '33%', pricePerPoint: 2.75 }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          alert('결제를 진행하려면 먼저 로그인이 필요합니다.')
          const params = new URLSearchParams(window.location.search)
          sessionStorage.setItem('pendingPayment', JSON.stringify(Object.fromEntries(params)))
          window.location.href = '/login'
          return
        }

        const data = await res.json()
        setUserData(data.user)
        setIsLoggedIn(true)
        setAuthChecking(false)

        const params = new URLSearchParams(window.location.search)
        const type = params.get('type') || 'subscription'
        setPaymentType(type)

        if (type === 'subscription') {
          const plan = params.get('plan')
          const cycle = params.get('cycle')
          if (plan) {
            const planData = plans.find(p => p.id === plan)
            setSelectedPlan(planData)
          }
          if (cycle) setBillingCycle(cycle)
        } else if (type === 'recharge' || type === 'team') {
          // 포인트 충전/팀원 추가는 구독 고객만 가능 - 구독 상태 확인
          setSubscriptionChecking(true)
          try {
            const subRes = await fetch(`/api/subscription/status?userId=${data.user.id}`)
            if (subRes.ok) {
              const subData = await subRes.json()
              if (subData.hasSubscription) {
                setHasSubscription(true)
                setSubscriptionInfo(subData.subscription)

                if (type === 'recharge') {
                  const pkg = params.get('package')
                  if (pkg) {
                    const pkgData = pointPackages.find(p => p.id === pkg)
                    setSelectedPackage(pkgData)
                  }
                } else if (type === 'team') {
                  // 기존 팀원 목록 조회
                  try {
                    const teamRes = await fetch(`/api/team/list?userId=${data.user.id}`)
                    if (teamRes.ok) {
                      const teamData = await teamRes.json()
                      if (teamData.success) {
                        setTeamMembers(teamData.data.members)
                        setTeamMembersCost(teamData.data.totalMonthlyCost)
                      }
                    }
                  } catch (teamErr) {
                    console.error('팀원 목록 조회 실패:', teamErr)
                  }
                }
              }
            }
          } catch (err) {
            console.error('구독 상태 확인 실패:', err)
          }
          setSubscriptionChecking(false)
        }
      } catch {
        alert('인증 확인 중 오류가 발생했습니다.')
        window.location.href = '/login'
      }
    }
    checkAuth()
  }, [])

  // 토스페이먼츠 SDK 로드 및 payment 인스턴스 초기화
  useEffect(() => {
    // team 타입은 SDK 불필요 (기존 빌링키로 서버에서 결제)
    if (paymentType === 'team') return
    const hasSelection = paymentType === 'subscription' ? selectedPlan : selectedPackage
    if (!isLoggedIn || !hasSelection || authChecking) return

    const loadTossPayments = async () => {
      if (!window.TossPayments) {
        const script = document.createElement('script')
        script.src = 'https://js.tosspayments.com/v2/standard'
        script.async = true
        script.onload = initializePayment
        document.head.appendChild(script)
      } else {
        initializePayment()
      }
    }

    const initializePayment = async () => {
      try {
        const customerKey = userData?.id || `customer_${Date.now()}`
        const tossPayments = window.TossPayments(TOSS_CLIENT_KEY)
        const payment = tossPayments.payment({ customerKey })
        paymentRef.current = payment
        setSdkReady(true)
      } catch (error) {
        console.error('토스페이먼츠 SDK 초기화 실패:', error)
        alert(`결제 SDK 초기화 실패: ${error.message || error}`)
      }
    }

    loadTossPayments()
  }, [isLoggedIn, selectedPlan, selectedPackage, authChecking, userData, paymentType])

  const getPrice = () => {
    if (paymentType === 'recharge') {
      return selectedPackage?.price || 0
    }
    if (!selectedPlan) return 0
    return billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice
  }

  // 팀원 비용 포함한 총 결제금액 (구독 결제용)
  const getTeamMembersCost = () => {
    return pendingTeamMembers.reduce((sum, m) => sum + (TEAM_ROLE_PRICES[m.role]?.price || 0), 0)
  }

  const getTotalPrice = () => {
    const basePrice = getPrice()
    if (paymentType === 'subscription') {
      return basePrice + getTeamMembersCost()
    }
    return basePrice
  }

  // 정기결제 (빌링)
  const handleBillingPayment = async () => {
    if (!paymentRef.current || !sdkReady) {
      alert('결제 SDK가 준비되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      // 팀원 정보가 있으면 sessionStorage에 저장
      if (pendingTeamMembers.length > 0) {
        sessionStorage.setItem('pendingTeamMembers', JSON.stringify(pendingTeamMembers))
      } else {
        sessionStorage.removeItem('pendingTeamMembers')
      }

      await paymentRef.current.requestBillingAuth({
        method: 'CARD',
        successUrl: `${window.location.origin}/payment/billing-success?plan=${selectedPlan.id}&cycle=${billingCycle}`,
        failUrl: `${window.location.origin}/payment/fail?type=subscription&plan=${selectedPlan.id}&cycle=${billingCycle}`,
        customerEmail: userData?.email,
        customerName: userData?.name || userData?.academyName || '고객',
      })
    } catch (error) {
      console.error('카드 등록 요청 실패:', error)
      alert(`카드 등록 요청에 실패했습니다: ${error.message}`)
      setIsLoading(false)
    }
  }

  // 일반결제 (포인트 충전)
  const handleRechargePayment = async () => {
    if (!paymentRef.current || !sdkReady) {
      alert('결제 SDK가 준비되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      const orderId = `RECHARGE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      await paymentRef.current.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: selectedPackage.price },
        orderId,
        orderName: `AI 포인트 ${selectedPackage.points.toLocaleString()}P 충전`,
        successUrl: `${window.location.origin}/payment/success?type=recharge&package=${selectedPackage.id}&points=${selectedPackage.points}`,
        failUrl: `${window.location.origin}/payment/fail?type=recharge&package=${selectedPackage.id}`,
        customerEmail: userData?.email,
        customerName: userData?.name || userData?.academyName || '고객',
      })
    } catch (error) {
      console.error('결제 요청 실패:', error)
      alert(`결제 요청에 실패했습니다: ${error.message}`)
      setIsLoading(false)
    }
  }

  // 팀원 초대 (일할 결제 포함)
  const handleTeamInvite = async () => {
    if (!newMember.email || !newMember.role) {
      alert('이메일과 역할을 입력해주세요.')
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newMember.email)) {
      alert('올바른 이메일 형식을 입력해주세요.')
      return
    }

    setTeamLoading(true)
    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          memberEmail: newMember.email,
          memberName: newMember.name || '',
          role: newMember.role
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.message || '팀원 초대에 실패했습니다.')
        return
      }

      alert(`팀원이 추가되었습니다.\n\n일할 계산: ${result.data.proratedAmount.toLocaleString()}원\n(${result.data.daysRemaining}일분)`)

      // 팀원 목록 새로고침
      const teamRes = await fetch(`/api/team/list?userId=${userData.id}`)
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        if (teamData.success) {
          setTeamMembers(teamData.data.members)
          setTeamMembersCost(teamData.data.totalMonthlyCost)
        }
      }

      // 입력 필드 초기화
      setNewMember({ email: '', name: '', role: 'instructor' })
    } catch (error) {
      console.error('팀원 초대 오류:', error)
      alert('팀원 초대 중 오류가 발생했습니다.')
    } finally {
      setTeamLoading(false)
    }
  }

  // 팀원 삭제
  const handleTeamRemove = async (memberId, memberName) => {
    if (!confirm(`${memberName || '해당 팀원'}을(를) 삭제하시겠습니까?\n다음 결제부터 해당 팀원 비용이 제외됩니다.`)) {
      return
    }

    try {
      const response = await fetch('/api/team/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.message || '팀원 삭제에 실패했습니다.')
        return
      }

      // 팀원 목록 새로고침
      const teamRes = await fetch(`/api/team/list?userId=${userData.id}`)
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        if (teamData.success) {
          setTeamMembers(teamData.data.members)
          setTeamMembersCost(teamData.data.totalMonthlyCost)
        }
      }
    } catch (error) {
      console.error('팀원 삭제 오류:', error)
      alert('팀원 삭제 중 오류가 발생했습니다.')
    }
  }

  // 일할 계산 예상 금액
  const calculateProratedAmount = (monthlyPrice) => {
    if (!subscriptionInfo?.next_payment_date) return monthlyPrice
    const nextPayment = new Date(subscriptionInfo.next_payment_date)
    const today = new Date()
    const daysRemaining = Math.max(1, Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24)))
    return Math.ceil((monthlyPrice / 30) * daysRemaining)
  }

  const handlePayment = () => {
    if (paymentType === 'subscription') {
      handleBillingPayment()
    } else if (paymentType === 'recharge') {
      handleRechargePayment()
    }
    // team 타입은 별도 handleTeamInvite 사용
  }

  if (authChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '64px'
      }}>
        <div style={{ color: '#ffffff', fontSize: '18px' }}>인증 확인 중...</div>
      </div>
    )
  }

  const hasSelection = paymentType === 'subscription' ? selectedPlan : (paymentType === 'recharge' ? selectedPackage : hasSubscription)

  // 페이지 타이틀
  const getPageTitle = () => {
    switch (paymentType) {
      case 'subscription': return '구독 결제'
      case 'recharge': return 'AI 포인트 충전'
      case 'team': return '팀원 추가'
      default: return '결제'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      padding: isMobile ? '88px 16px 24px' : '104px 20px 40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '24px' : '40px', textAlign: 'center' }}>
          <Link href="/" style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#ffffff',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            EduRichBrain
          </Link>
          <h1 style={{ fontSize: isMobile ? '24px' : '36px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            {getPageTitle()}
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
            토스페이먼츠로 안전하게 결제하세요
          </p>
        </div>

        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
          gap: isMobile ? '24px' : '32px',
          alignItems: 'start'
        }}>
          {/* 결제 영역 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '24px 20px' : '40px',
            boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
          }}>
            {paymentType === 'team' ? (
              // 팀원 추가 UI
              subscriptionChecking ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    구독 상태 확인 중...
                  </div>
                </div>
              ) : !hasSubscription ? (
                // 구독이 없는 경우
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                    구독이 필요합니다
                  </h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px', lineHeight: '1.6' }}>
                    팀원 추가는 구독 중인 고객만 이용할 수 있습니다.<br/>
                    먼저 구독 플랜을 선택해주세요.
                  </p>
                  <Link
                    href="/pricing"
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    구독 플랜 보기
                  </Link>
                </div>
              ) : (
                <>
                  {/* 현재 팀원 현황 */}
                  {teamMembers.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                        현재 팀원 ({teamMembers.length}명)
                      </h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            style={{
                              padding: '16px',
                              background: 'rgba(30, 41, 59, 0.5)',
                              border: '1px solid rgba(51, 65, 85, 0.5)',
                              borderRadius: '12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                                {member.name || member.email}
                              </div>
                              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                                {member.roleName} · {member.monthlyPrice.toLocaleString()}원/월
                                {member.status === 'pending' && (
                                  <span style={{ marginLeft: '8px', color: '#fbbf24' }}>초대 대기중</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleTeamRemove(member.id, member.name || member.email)}
                              style={{
                                padding: '8px 12px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: '#ef4444',
                                fontSize: '13px',
                                cursor: 'pointer'
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                      <div style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>월 추가 비용</span>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}>
                          +{teamMembersCost.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 팀원 추가 폼 */}
                  <div style={{
                    padding: '24px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '16px'
                  }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
                      팀원 추가
                    </h2>

                    {/* 역할 선택 */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        역할
                      </label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {Object.entries(TEAM_ROLE_PRICES).map(([roleKey, roleData]) => (
                          <button
                            key={roleKey}
                            onClick={() => setNewMember(prev => ({ ...prev, role: roleKey }))}
                            style={{
                              flex: '1',
                              minWidth: '100px',
                              padding: '12px',
                              background: newMember.role === roleKey
                                ? 'rgba(59, 130, 246, 0.3)'
                                : 'rgba(30, 41, 59, 0.5)',
                              border: newMember.role === roleKey
                                ? '2px solid #3b82f6'
                                : '1px solid rgba(51, 65, 85, 0.5)',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                              {roleData.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                              {roleData.price.toLocaleString()}원/월
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 이메일 입력 */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        이메일 *
                      </label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="팀원 이메일 주소"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* 이름 입력 */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                        이름 (선택)
                      </label>
                      <input
                        type="text"
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="팀원 이름"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '10px',
                          color: '#ffffff',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* 일할 계산 안내 */}
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(251, 191, 36, 0.15)',
                      borderRadius: '10px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontSize: '13px', color: '#fbbf24', fontWeight: '600', marginBottom: '4px' }}>
                        일할 계산 안내
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                        다음 결제일까지 남은 일수만큼 일할 계산되어 즉시 결제됩니다.<br/>
                        예상 결제금액: <strong style={{ color: '#ffffff' }}>
                          {calculateProratedAmount(TEAM_ROLE_PRICES[newMember.role]?.price || 0).toLocaleString()}원
                        </strong>
                      </div>
                    </div>

                    {/* 추가 버튼 */}
                    <button
                      onClick={handleTeamInvite}
                      disabled={teamLoading || !newMember.email}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: (teamLoading || !newMember.email)
                          ? 'rgba(59, 130, 246, 0.5)'
                          : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (teamLoading || !newMember.email) ? 'not-allowed' : 'pointer',
                        boxShadow: (teamLoading || !newMember.email) ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)'
                      }}
                    >
                      {teamLoading ? '처리 중...' : `${TEAM_ROLE_PRICES[newMember.role]?.name || '팀원'} 추가하기`}
                    </button>
                  </div>
                </>
              )
            ) : paymentType === 'recharge' ? (
              // 포인트 충전 UI
              subscriptionChecking ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    구독 상태 확인 중...
                  </div>
                </div>
              ) : !hasSubscription ? (
                // 구독이 없는 경우
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                    구독이 필요합니다
                  </h2>
                  <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px', lineHeight: '1.6' }}>
                    포인트 충전은 구독 중인 고객만 이용할 수 있습니다.<br/>
                    먼저 구독 플랜을 선택해주세요.
                  </p>
                  <Link
                    href="/pricing"
                    style={{
                      display: 'inline-block',
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none'
                    }}
                  >
                    구독 플랜 보기
                  </Link>
                </div>
              ) : (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '24px' }}>
                  충전할 패키지 선택
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {pointPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      style={{
                        padding: '20px',
                        background: selectedPackage?.id === pkg.id
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(30, 41, 59, 0.5)',
                        border: selectedPackage?.id === pkg.id
                          ? '2px solid #3b82f6'
                          : '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative'
                      }}
                    >
                      {pkg.recommended && (
                        <span style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#3b82f6',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '20px'
                        }}>
                          추천
                        </span>
                      )}
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                        {pkg.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                            {pkg.price.toLocaleString()}원
                          </span>
                          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginLeft: '8px' }}>
                            VAT 포함
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                            {pkg.points.toLocaleString()}P
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            포인트당 {pkg.pricePerPoint}원
                          </div>
                        </div>
                      </div>
                      {pkg.bonus && (
                        <div style={{
                          marginTop: '12px',
                          padding: '8px 12px',
                          background: 'rgba(251, 191, 36, 0.15)',
                          borderRadius: '8px',
                          display: 'inline-block'
                        }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#fbbf24' }}>
                            🎁 {pkg.bonus} 보너스
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* 결제 버튼 */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading || !sdkReady || !selectedPackage}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: (isLoading || !sdkReady || !selectedPackage)
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (isLoading || !sdkReady || !selectedPackage) ? 'not-allowed' : 'pointer',
                    boxShadow: (isLoading || !sdkReady || !selectedPackage) ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                  }}
                >
                  {isLoading ? '결제 진행 중...' : !sdkReady ? 'SDK 로딩 중...' : !selectedPackage ? '패키지를 선택하세요' : `${selectedPackage.price.toLocaleString()}원 결제하기`}
                </button>
              </>
              )
            ) : (
              // 구독 결제 UI (기존)
              hasSelection ? (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                    정기결제 카드 등록
                  </h2>
                  <div style={{
                    padding: '20px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px' }}>💳</span>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                          신용/체크카드 자동결제
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          카드 등록 후 매월 자동으로 결제됩니다
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>
                      • 첫 결제: 카드 등록 직후 진행<br/>
                      • 다음 결제: 매월 같은 날 자동 결제<br/>
                      • 언제든 구독 취소 가능
                    </div>
                  </div>

                  {/* 팀원 추가 섹션 */}
                  <div style={{
                    marginBottom: '24px',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => setShowTeamSection(!showTeamSection)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>👥</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>
                            팀원 함께 추가하기
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            강사, 직원, 알바를 추가하면 함께 결제됩니다
                          </div>
                        </div>
                      </div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          transform: showTeamSection ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      >
                        <path d="M6 9l6 6 6-6" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {showTeamSection && (
                      <div style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.4)' }}>
                        {/* 추가된 팀원 목록 */}
                        {pendingTeamMembers.length > 0 && (
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                              추가할 팀원 ({pendingTeamMembers.length}명)
                            </div>
                            {pendingTeamMembers.map((member, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: '12px',
                                  background: 'rgba(30, 41, 59, 0.5)',
                                  border: '1px solid rgba(51, 65, 85, 0.5)',
                                  borderRadius: '8px',
                                  marginBottom: '8px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <div>
                                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#ffffff' }}>
                                    {member.name || member.email}
                                  </div>
                                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                    {TEAM_ROLE_PRICES[member.role]?.name} · +{TEAM_ROLE_PRICES[member.role]?.price.toLocaleString()}원/월
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setPendingTeamMembers(prev => prev.filter((_, i) => i !== index))
                                  }}
                                  style={{
                                    padding: '6px 10px',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#ef4444',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 팀원 추가 폼 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* 역할 선택 */}
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {Object.entries(TEAM_ROLE_PRICES).map(([roleKey, roleData]) => (
                              <button
                                key={roleKey}
                                onClick={() => setNewMember(prev => ({ ...prev, role: roleKey }))}
                                style={{
                                  flex: '1',
                                  padding: '10px 8px',
                                  background: newMember.role === roleKey
                                    ? 'rgba(59, 130, 246, 0.3)'
                                    : 'rgba(30, 41, 59, 0.5)',
                                  border: newMember.role === roleKey
                                    ? '2px solid #3b82f6'
                                    : '1px solid rgba(51, 65, 85, 0.5)',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  textAlign: 'center'
                                }}
                              >
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                                  {roleData.name}
                                </div>
                                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                  {roleData.price.toLocaleString()}원
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* 이메일 & 이름 입력 */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="email"
                              value={newMember.email}
                              onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="이메일 *"
                              style={{
                                flex: '2',
                                padding: '10px 12px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(51, 65, 85, 0.5)',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '13px',
                                outline: 'none'
                              }}
                            />
                            <input
                              type="text"
                              value={newMember.name}
                              onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="이름"
                              style={{
                                flex: '1',
                                padding: '10px 12px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(51, 65, 85, 0.5)',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontSize: '13px',
                                outline: 'none'
                              }}
                            />
                          </div>

                          {/* 추가 버튼 */}
                          <button
                            onClick={() => {
                              if (!newMember.email) {
                                alert('이메일을 입력해주세요.')
                                return
                              }
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                              if (!emailRegex.test(newMember.email)) {
                                alert('올바른 이메일 형식을 입력해주세요.')
                                return
                              }
                              if (pendingTeamMembers.some(m => m.email === newMember.email)) {
                                alert('이미 추가된 이메일입니다.')
                                return
                              }
                              setPendingTeamMembers(prev => [...prev, { ...newMember }])
                              setNewMember({ email: '', name: '', role: 'instructor' })
                            }}
                            style={{
                              padding: '10px',
                              background: 'rgba(251, 191, 36, 0.2)',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '8px',
                              color: '#fbbf24',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            + 팀원 추가
                          </button>
                        </div>

                        {/* 팀원 비용 안내 */}
                        {pendingTeamMembers.length > 0 && (
                          <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                              팀원 추가 비용 (월)
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#3b82f6' }}>
                              +{pendingTeamMembers.reduce((sum, m) => sum + (TEAM_ROLE_PRICES[m.role]?.price || 0), 0).toLocaleString()}원
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isLoading || !sdkReady}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: (isLoading || !sdkReady)
                        ? 'rgba(59, 130, 246, 0.5)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: (isLoading || !sdkReady) ? 'not-allowed' : 'pointer',
                      boxShadow: (isLoading || !sdkReady) ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                      marginBottom: '12px'
                    }}
                  >
                    {isLoading ? '카드 등록 중...' : !sdkReady ? 'SDK 로딩 중...' : `카드 등록 후 ${getTotalPrice().toLocaleString()}원 결제`}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.5"/>
                    </svg>
                    토스페이먼츠 보안 결제
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  <p style={{ marginBottom: '16px', fontSize: '16px' }}>선택된 플랜이 없습니다</p>
                  <Link href="/pricing" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                    요금제 페이지로 이동 →
                  </Link>
                </div>
              )
            )}
          </div>

          {/* 주문 요약 사이드바 */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: '40px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '24px' }}>
                  주문 요약
                </h2>

                {paymentType === 'team' && hasSubscription ? (
                  <>
                    <div style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                        팀원 관리
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
                        현재 {teamMembers.length}명의 팀원
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>강사</span>
                          <span>{teamMembers.filter(m => m.role === 'instructor').length}명</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>직원</span>
                          <span>{teamMembers.filter(m => m.role === 'staff').length}명</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>알바</span>
                          <span>{teamMembers.filter(m => m.role === 'parttime').length}명</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                      <span>월 추가 비용</span>
                      <span style={{ color: '#3b82f6' }}>+{teamMembersCost.toLocaleString()}원</span>
                    </div>
                  </>
                ) : paymentType === 'recharge' && hasSubscription && selectedPackage ? (
                  <>
                    <div style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                        {selectedPackage.name}
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
                        AI 포인트 충전
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>
                        {selectedPackage.points.toLocaleString()}P
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                      <span>총 결제금액</span>
                      <span style={{ color: '#3b82f6' }}>{selectedPackage.price.toLocaleString()}원</span>
                    </div>
                  </>
                ) : paymentType === 'subscription' && selectedPlan ? (
                  <>
                    <div style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                        {selectedPlan.name}
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
                        {billingCycle === 'monthly' ? '월간 구독' : '연간 구독'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#60a5fa"/>
                        </svg>
                        매월 {selectedPlan.aiPoints.toLocaleString()} AI 포인트
                      </div>
                    </div>

                    {/* 결제 상세 내역 */}
                    <div style={{
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: '2'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{selectedPlan.name} {billingCycle === 'monthly' ? '월간' : '연간'}</span>
                        <span>{getPrice().toLocaleString()}원</span>
                      </div>
                      {pendingTeamMembers.length > 0 && (
                        <>
                          {pendingTeamMembers.map((member, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                              <span>+ {TEAM_ROLE_PRICES[member.role]?.name} ({member.name || member.email.split('@')[0]})</span>
                              <span>+{TEAM_ROLE_PRICES[member.role]?.price.toLocaleString()}원</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <div style={{
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}>
                      <span>총 결제금액</span>
                      <span style={{ color: '#3b82f6' }}>{getTotalPrice().toLocaleString()}원</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    <p>선택된 상품이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

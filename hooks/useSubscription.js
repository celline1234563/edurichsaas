'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useSubscription() {
  const { data: session, status } = useSession()
  const [subscription, setSubscription] = useState(null)
  const [credits, setCredits] = useState(0)
  const [canUseService, setCanUseService] = useState(false)
  const [serviceStatus, setServiceStatus] = useState('loading')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSubscriptionStatus = useCallback(async () => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      setLoading(false)
      setServiceStatus('unauthenticated')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/subscription')
      const data = await response.json()

      if (data.success) {
        setSubscription(data.data.subscription)
        setCredits(data.data.credits)
        setCanUseService(data.data.canUseService)
        setServiceStatus(data.data.serviceStatus)
      } else {
        setError(data.message)
        setServiceStatus(data.error)
      }
    } catch (err) {
      setError('구독 상태를 불러오는데 실패했습니다.')
      setServiceStatus('error')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [fetchSubscriptionStatus])

  const deductCredits = async (amount, reason) => {
    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason })
      })
      const data = await response.json()

      if (data.success) {
        setCredits(data.data.remaining)
        return { success: true, remaining: data.data.remaining }
      } else {
        return { success: false, error: data.error, message: data.message }
      }
    } catch (err) {
      return { success: false, error: 'network_error', message: '네트워크 오류가 발생했습니다.' }
    }
  }

  const refreshStatus = () => {
    fetchSubscriptionStatus()
  }

  return {
    session,
    subscription,
    credits,
    canUseService,
    serviceStatus,
    loading,
    error,
    deductCredits,
    refreshStatus,
    isAuthenticated: status === 'authenticated'
  }
}

// AI 기능별 크레딧 소모량 정의
export const CREDIT_COSTS = {
  BLOG_GENERATION: 50,
  CONSULTATION_REPORT: 70,
  MARKETING_CAMPAIGN: 30,
  AI_CHATBOT_10_TURNS: 35,
  SCHOOL_ANALYSIS: 300,
  NAESIN_ANALYSIS: 350,
  CURRICULUM_CONSULTING: 500,
  STUDENT_REPORT: 100
}

export default useSubscription

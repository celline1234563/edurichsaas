'use client'

import { useState, useEffect } from 'react'

export function useTrial() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage에서 유저 정보 가져오기
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const incrementTurn = (module, action) => {
    if (!user) return { success: false, message: '로그인이 필요합니다' }

    if (user.subscriptionType !== 'trial') {
      // 구독 사용자는 무제한
      return {
        success: true,
        isSubscribed: true,
        turnsRemaining: -1
      }
    }

    const currentTurns = user.trialTurnsUsed || 0
    const limit = user.trialTurnsLimit || 3

    if (currentTurns >= limit) {
      // 체험 턴 초과
      return {
        success: false,
        turnsRemaining: 0,
        isSubscribed: false,
        message: '체험 사용이 종료되었습니다. 구독을 시작해주세요.'
      }
    }

    // 턴 증가
    const newUser = {
      ...user,
      trialTurnsUsed: currentTurns + 1
    }

    // localStorage 업데이트
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)

    // 사용 로그 저장 (분석용)
    const logs = JSON.parse(localStorage.getItem('trialLogs') || '[]')
    logs.push({
      module,
      action,
      timestamp: new Date().toISOString(),
      turnNumber: currentTurns + 1
    })
    localStorage.setItem('trialLogs', JSON.stringify(logs))

    return {
      success: true,
      turnsRemaining: limit - (currentTurns + 1),
      isSubscribed: false
    }
  }

  const checkTrialStatus = () => {
    if (!user) return null

    const turnsRemaining = user.subscriptionType === 'trial'
      ? Math.max(0, (user.trialTurnsLimit || 3) - (user.trialTurnsUsed || 0))
      : -1

    return {
      isSubscribed: user.subscriptionType !== 'trial',
      subscriptionType: user.subscriptionType,
      turnsRemaining,
      trialTurnsUsed: user.trialTurnsUsed || 0,
      trialTurnsLimit: user.trialTurnsLimit || 3
    }
  }

  const resetTrial = () => {
    // 체험 리셋 (테스트용)
    if (user) {
      const resetUser = {
        ...user,
        trialTurnsUsed: 0
      }
      localStorage.setItem('user', JSON.stringify(resetUser))
      setUser(resetUser)
      localStorage.removeItem('trialLogs')
    }
  }

  const upgradeToSubscription = (planType) => {
    // 구독으로 업그레이드
    if (user) {
      const subscribedUser = {
        ...user,
        subscriptionType: planType,
        subscriptionStartDate: new Date().toISOString()
      }
      localStorage.setItem('user', JSON.stringify(subscribedUser))
      setUser(subscribedUser)

      return true
    }
    return false
  }

  return {
    user,
    loading,
    incrementTurn,
    checkTrialStatus,
    resetTrial,
    upgradeToSubscription
  }
}
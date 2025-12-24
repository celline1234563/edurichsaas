import { Suspense } from 'react'
import OnboardingClient from './OnboardingClient'

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>로딩중...</div>}>
      <OnboardingClient />
    </Suspense>
  )
}

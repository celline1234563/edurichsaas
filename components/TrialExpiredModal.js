'use client'

import Link from 'next/link'

export default function TrialExpiredModal({ isOpen, onClose, turnsUsed = 3 }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass rounded-2xl p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-blue-50 mb-3">
            무료 체험이 종료되었습니다
          </h3>
          <p className="text-slate-400 mb-4">
            {turnsUsed}번의 AI 기능을 모두 사용하셨습니다.
            <br />
            구독하시고 무제한으로 이용해보세요!
          </p>

          {/* Benefits */}
          <div className="bg-blue-900/20 rounded-lg p-4 text-left mb-6">
            <p className="text-sm font-medium text-blue-200 mb-2">구독 시 혜택:</p>
            <ul className="space-y-1 text-sm text-slate-300">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                무제한 AI 기능 사용
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                6개 모듈 전체 이용
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                우선 고객 지원
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                신규 기능 우선 제공
              </li>
            </ul>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-3 mb-6">
            <p className="text-sm font-medium text-blue-200">
              🎁 지금 구독하면 첫 달 <span className="text-lg font-bold">50% 할인</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-center transition"
          >
            구독 시작하기
          </Link>

          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-lg glass hover:bg-blue-900/30 text-slate-400 font-medium transition"
          >
            나중에 하기
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-500 text-center mt-6">
          언제든 구독을 취소할 수 있습니다
        </p>
      </div>
    </div>
  )
}
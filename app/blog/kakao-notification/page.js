'use client'

import Link from 'next/link'
import Flowchart from './Flowchart'
import { PhoneMockupDisplay } from './KakaoPhoneMockup'
import { MESSAGE_TYPES, COMPARISON_DATA, FAQ_DATA } from './constants'

export default function KakaoNotificationBlogPage() {
  return (
    <div className="min-h-screen font-sans text-slate-100 bg-[#111827]">

      {/* Top Navigation Bar */}
      <nav className="fixed w-full z-50 bg-[#111827]/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Back Button / Brand */}
          <div className="flex items-center gap-4">
            <Link href="/blog" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">E</div>
              <span className="font-bold text-lg tracking-tight text-white">EduRichBrain Blog</span>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors border border-gray-700">
              <span>홈으로</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image Background */}
      <div className="relative w-full h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.hankyung.com/photo/202511/02.41917781.1.jpg"
            alt="Smartphone with messaging apps"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-[#111827]/30"></div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 text-center max-w-5xl px-4 mt-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/blog" className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium text-blue-300 hover:bg-white/20 transition-colors">
              ← 목록으로
            </Link>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
              EduRichBrain
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-xl break-keep">
            학부모님들께 우리 아이의 학습현황을<br className="hidden md:block" /> 가장 빠르게 주는 방법 : 카카오톡 알림
          </h1>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-300 font-medium">
            <span>EduRichBrain</span>
            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
            <span>2025년 12월 16일</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-[1000px] mx-auto px-4 pb-20 -mt-32 relative z-20">
        <div className="bg-[#1F2937] rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">

          {/* Card Header/Intro */}
          <div className="p-8 md:p-12 border-b border-gray-700 bg-gradient-to-b from-gray-800 to-[#1F2937]">
            <h2 className="text-3xl font-bold text-white mb-4">학부모님들께 우리 아이의 학습현황을 가장 빠르게 주는 방법 : 카카오톡 알림</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              학원 운영의 모든 알림을 카카오톡으로 자동 발송 —<br />
              학부모는 안심하고, 원장님은 업무에서 해방됩니다.
            </p>

            <div className="prose prose-invert max-w-none bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold text-blue-300 mb-3">왜 '학원 알림톡'이 필수일까요?</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                많은 원장님들이 여전히 <strong>학원 문자(LMS/SMS)</strong>를 통해 공지사항을 전달하고 계십니다.
                하지만 스팸 문자로 오인받아 확인되지 않거나, 발송 비용(건당 30~50원)이 만만치 않은 것이 현실입니다.
              </p>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base mt-4">
                <strong>학원 카카오톡 알림</strong>은 대한민국 국민 대부분이 사용하는 카카오톡을 통해 발송되므로
                도달률이 월등히 높습니다. 또한, 학원의 로고와 이름을 명확히 보여주는 프로필을 통해
                학부모님께 더 큰 신뢰감을 줄 수 있습니다. 이제 <strong>학원 알림톡</strong>은 선택이 아닌 필수입니다.
              </p>
            </div>
          </div>

          {/* Problems Section */}
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-red-400">#</span> 원장님들의 현실적인 고민
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                "상담 예약했는데 노쇼 발생 🤯",
                "등하원 문자 일일이 발송 ⏰",
                "수강료 납부 안내 전화 민망함 😓",
                "학습 리포트 발송 번거로움 📉",
                "단체 문자 비용 부담 💸"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                  <span className="text-gray-300 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-gray-300">
                "아직도 등하원 체크를 위해 엑셀을 켜고, <strong>학원 문자</strong> 사이트에 접속하시나요?
                반복되는 행정 업무만 줄여도 원장님은 교육 퀄리티 향상에 집중할 수 있습니다."
              </p>
            </div>
          </div>

          {/* Solution Section */}
          <div className="p-8 md:p-12 bg-[#111827]/50 border-y border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">해결책: 에듀 알림 채널 구조</h3>
            <Flowchart />
            <div className="mt-8 text-center max-w-2xl mx-auto">
              <p className="text-gray-400 text-sm mb-4">
                에듀리치브레인 시스템에서 설정만 하면, <strong>에듀 알림 채널</strong>을 통해 자동으로 발송됩니다.
                별도의 문자 사이트 접속 없이, 학원 관리 프로그램 내에서 모든 것이 이루어집니다.
              </p>
            </div>
          </div>

          {/* Visual Gallery: Mockups */}
          <div className="p-8 md:p-12 bg-gray-800/30">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-2">학부모가 받아보는 실제 화면</h3>
              <p className="text-gray-400">상담부터 결제, 리포트까지. <strong>학원 카카오톡</strong>으로 깔끔하게 전달됩니다.</p>
            </div>

            <div className="relative w-full overflow-x-auto pb-8 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex gap-8 min-w-max px-4 mx-auto justify-center">
                <div className="snap-center shrink-0 flex flex-col items-center">
                  <PhoneMockupDisplay type="consultation" studentName="김민준" time="오전 9:30" />
                  <p className="mt-4 font-bold text-blue-300">📌 상담 예약 알림</p>
                  <p className="text-xs text-gray-500 mt-1">노쇼 방지를 위한 필수 알림</p>
                </div>
                <div className="snap-center shrink-0 flex flex-col items-center">
                  <PhoneMockupDisplay type="attendance" studentName="김민준" time="오후 3:40" />
                  <p className="mt-4 font-bold text-blue-300">🏫 등·하원 알림</p>
                  <p className="text-xs text-gray-500 mt-1">학부모님이 가장 안심하는 기능</p>
                </div>
                <div className="snap-center shrink-0 flex flex-col items-center">
                  <PhoneMockupDisplay type="payment" studentName="김민준" time="오전 10:00" />
                  <p className="mt-4 font-bold text-blue-300">💳 수강료 납부 안내</p>
                  <p className="text-xs text-gray-500 mt-1">미납률을 획기적으로 줄여줍니다</p>
                </div>
                <div className="snap-center shrink-0 flex flex-col items-center">
                  <PhoneMockupDisplay type="report" studentName="김민준" time="오후 6:00" />
                  <p className="mt-4 font-bold text-blue-300">📊 학습 리포트</p>
                  <p className="text-xs text-gray-500 mt-1">학원의 전문성을 보여주는 리포트</p>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              * 이미지를 좌우로 스크롤하여 다양한 <strong>학원 알림톡</strong> 예시를 확인해보세요.
            </p>
          </div>

          {/* Message Types List */}
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-8">발송 가능한 알림톡 유형 상세</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {MESSAGE_TYPES.map((type, idx) => (
                <div key={idx} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                  <h4 className="font-bold text-blue-400 mb-4 text-lg border-b border-gray-700 pb-2">{type.category}</h4>
                  <ul className="space-y-3">
                    {type.items.map((item, i) => (
                      <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm group gap-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                          <span className="text-gray-200 font-medium">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs bg-gray-900 px-2 py-1 rounded border border-gray-700">{item.timing}</span>
                          <span className="text-blue-400 text-xs font-bold">{item.effect}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Effects Section */}
          <div className="p-8 md:p-12 bg-blue-900/20 border-y border-blue-900/30">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">도입 기대 효과</h3>
            <div className="overflow-x-auto rounded-xl border border-blue-800/50">
              <table className="w-full text-left border-collapse">
                <thead className="bg-blue-900/40 text-blue-200">
                  <tr>
                    <th className="p-4 font-semibold">항목</th>
                    <th className="p-4 font-semibold text-center opacity-60">Before (일반 문자)</th>
                    <th className="p-4 font-semibold text-center text-yellow-400">After (에듀알림)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-800/30 bg-blue-900/10">
                  {COMPARISON_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-800/20 transition-colors">
                      <td className="p-4 font-medium text-gray-200">{row.category}</td>
                      <td className="p-4 text-center text-gray-500 line-through decoration-gray-600">{row.before}</td>
                      <td className="p-4 text-center font-bold text-blue-400">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <p className="text-blue-200 font-medium">
                "<strong>학원 문자</strong> 대비 비용은 줄이고, 효과는 높이세요. <br className="md:hidden" />
                스마트한 학원 운영의 첫걸음입니다."
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="p-8 md:p-12 bg-[#1F2937]">
            <h3 className="text-2xl font-bold text-white mb-6">자주 묻는 질문</h3>
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h4 className="text-xl font-bold text-blue-400 mb-4">Q. {faq.question}</h4>
                <p className="text-gray-300 leading-relaxed mb-6">{faq.answer}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {faq.comparison.map((comp, cIdx) => (
                    <div key={cIdx} className="bg-gray-900/60 rounded-lg p-4 flex flex-col gap-2 border border-gray-700">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{comp.label}</span>
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-500 w-1/2 pr-2 border-r border-gray-700">
                          <span className="block text-xs mb-1">문자 (LMS)</span>
                          {comp.sms}
                        </div>
                        <div className="text-blue-300 w-1/2 pl-3 font-medium">
                          <span className="block text-xs mb-1 text-yellow-500">알림톡</span>
                          {comp.kakao}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="p-8 md:p-16 bg-gradient-to-br from-blue-900 to-slate-900 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">스마트한 학원 운영의 시작</h2>
              <p className="text-blue-200 mb-10 max-w-lg mx-auto">
                지금 바로 에듀리치브레인 데모를 체험해보고,<br />
                <strong>학원 알림톡</strong>으로 변화된 학원 운영을 경험하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 group"
                >
                  예시 데모 써보기
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <button className="bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 3.13-9 7 0 2.49 1.66 4.7 4.26 5.95-.19.7-.69 2.53-.78 2.92-.12.53.19.53.4.35.26-.22 3.07-2.09 3.59-2.45.49.07 1 .11 1.53.11 4.97 0 9-3.13 9-7s-4.03-7-9-7z" /></svg>
                  카톡 채널 친구추가
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-8 px-4">
          <Link href="/blog" className="px-6 py-3 rounded-lg bg-[#1F2937] hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700">
            목록으로
          </Link>
          <button className="px-6 py-3 rounded-lg bg-[#1F2937] hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            공유하기
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <button className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </button>
      </div>

    </div>
  );
}

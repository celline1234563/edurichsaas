'use client'

const Box = ({ title, subtitle, colorClass, icon }) => (
  <div className={`w-full max-w-sm p-6 rounded-xl shadow-lg border-2 ${colorClass} flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300 relative bg-slate-800 text-white`}>
    {icon && <div className="text-4xl mb-2">{icon}</div>}
    <h3 className="text-xl font-bold mb-1">{title}</h3>
    <p className="text-sm opacity-80 font-medium text-slate-300">{subtitle}</p>
  </div>
);

const ArrowDown = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-16 relative z-0">
    <div className="w-0.5 h-full bg-slate-600"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700 px-3 py-1 rounded-full border border-slate-600 text-xs font-semibold text-slate-300 whitespace-nowrap">
      {label}
    </div>
    <div className="w-3 h-3 border-r-2 border-b-2 border-slate-600 rotate-45 transform mt-[-6px] bg-slate-900"></div>
  </div>
);

export default function Flowchart() {
  return (
    <div className="bg-slate-900 p-8 md:p-12 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-700">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <h3 className="text-white text-3xl font-bold mb-2 z-10">서비스 채널 연동 구조</h3>
      <p className="text-gray-400 mb-12 z-10 text-center">에듀리치브레인과 카카오톡 채널의 유기적인 운영 관계</p>

      <div className="w-full flex flex-col items-center z-10 space-y-2">

        {/* Step 1 */}
        <Box
          title="마케팅 다이어트"
          subtitle="사업자 · 서비스 개발 및 운영 총괄"
          colorClass="border-blue-500 text-blue-100"
          icon="🏢"
        />

        <ArrowDown label="개발 및 운영" />

        {/* Step 2 */}
        <Box
          title="에듀리치브레인"
          subtitle="학원 경영 자동화 플랫폼 (AI SAAS)"
          colorClass="border-blue-400 text-blue-100"
          icon="🧠"
        />

        <ArrowDown label="알림톡 발송 기능 연동" />

        {/* Step 3 */}
        <Box
          title="에듀 알림 채널"
          subtitle="학부모 대상 알림톡 발송 전용 채널"
          colorClass="border-yellow-400 text-yellow-100"
          icon="💬"
        />

      </div>
    </div>
  );
}

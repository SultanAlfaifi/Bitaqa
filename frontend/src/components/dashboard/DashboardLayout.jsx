import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const tabs = [
  {
    id: 'profile', label: 'الملف الشخصي', short: 'الملف',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600',
    bg: 'bg-indigo-50', accent: 'text-indigo-600',
  },
  {
    id: 'skills', label: 'المهارات', short: 'المهارات',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50', accent: 'text-violet-600',
  },
  {
    id: 'projects', label: 'المشاريع', short: 'المشاريع',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50', accent: 'text-sky-600',
  },
  {
    id: 'links', label: 'روابط التواصل', short: 'الروابط',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.757-4.9a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50', accent: 'text-pink-600',
  },
  {
    id: 'settings', label: 'الإعدادات', short: 'الإعدادات',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    color: 'from-gray-500 to-gray-600',
    bg: 'bg-gray-100', accent: 'text-gray-600',
  },
]

export default function DashboardLayout({ activeTab, onTabChange, children, username, displayName, avatarUrl }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const activeTabData = tabs.find(t => t.id === activeTab)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = (displayName || username || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

      {/* ── Top bar (mobile only) ── */}
      <header className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold gradient-text">بِطاقة</Link>
          <div className="flex items-center gap-2">
            {username && (
              <Link to={`/p/${username}`} target="_blank"
                className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                عرض بطاقتي
              </Link>
            )}
            <button onClick={handleLogout}
              className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">

        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-l border-gray-100 sticky top-0 h-screen shadow-sm shadow-gray-100/50">

          {/* Logo */}
          <div className="px-6 h-16 flex items-center border-b border-gray-50">
            <Link to="/" className="text-2xl font-black gradient-text tracking-tight">بِطاقة</Link>
          </div>

          {/* Mini profile */}
          <div className="px-4 py-5 border-b border-gray-50">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/60">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 ring-2 ring-white shadow flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">{initials}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName || username || 'مستخدم'}</p>
                <p className="text-xs text-gray-400 font-mono truncate">@{username}</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {tabs.map(tab => {
              const active = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-right
                    ${active
                      ? `bg-gradient-to-l ${tab.color} text-white shadow-md`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}>
                  <span className={active ? 'text-white' : tab.accent}>
                    {tab.icon(active)}
                  </span>
                  {tab.label}
                  {active && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                  )}
                </button>
              )
            })}

            <div className="pt-3 border-t border-gray-100 mt-3 space-y-0.5">
              <Link to="/dashboard/analytics"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150">
                <span className="text-amber-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
                الإحصائيات
              </Link>
              {username && (
                <Link to={`/p/${username}`} target="_blank"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150">
                  <span className="text-indigo-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </span>
                  معاينة البطاقة
                </Link>
              )}
            </div>
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-gray-100">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">

          {/* Page header */}
          <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white/60 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeTabData?.color} flex items-center justify-center shadow-sm`}>
                <span className="text-white">{activeTabData?.icon(true)}</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">{activeTabData?.label}</h1>
            </div>
          </div>

          {/* Tab content */}
          <div className="px-4 lg:px-8 py-6">
            <div key={activeTab} className="page-enter max-w-3xl">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-30 safe-area-bottom">
        <div className="flex items-center">
          {tabs.map(tab => {
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors duration-150
                  ${active ? tab.accent : 'text-gray-400'}`}>
                {tab.icon(active)}
                <span className="text-[10px] font-medium">{tab.short}</span>
                {active && <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${tab.color}`} />}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

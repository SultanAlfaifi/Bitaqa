import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Tooltip, ResponsiveContainer, Area, AreaChart,
  CartesianGrid, XAxis, YAxis,
} from 'recharts'
import * as analyticsService from '../services/analyticsService'

const periods = [
  { label: '٧ أيام', value: 7 },
  { label: '١٤ يوم', value: 14 },
  { label: '٣٠ يوم', value: 30 },
]

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-indigo-100 rounded-2xl shadow-xl shadow-indigo-100/40 px-4 py-3 text-sm">
      <p className="text-gray-400 text-xs mb-1.5 font-medium">
        {new Date(label).toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
      <p className="font-bold text-gray-900 text-base">
        {payload[0].value.toLocaleString('ar-SA')}
        <span className="font-normal text-gray-400 text-xs mr-1">زيارة</span>
      </p>
    </div>
  )
}

/* ── Stat Card ── */
function StatCard({ label, value, subValue, subLabel, gradient, icon, loading, delay = '0ms' }) {
  if (loading) return (
    <div className="card p-5">
      <div className="skeleton h-5 w-5 rounded-lg mb-4" />
      <div className="skeleton h-8 w-24 mb-2" />
      <div className="skeleton h-3.5 w-32" />
    </div>
  )
  return (
    <div
      className="card p-5 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: delay }}
    >
      {/* Background gradient blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${gradient}`} />

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md mb-4`}>
        {icon}
      </div>

      <p className="text-3xl font-bold text-gray-900 tabular-nums">
        {value ?? <span className="text-gray-300">—</span>}
      </p>
      <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>

      {subValue != null && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-xs text-gray-400">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-green-400">
            <path fillRule="evenodd" d="M8 12a.75.75 0 01-.53-.22l-3-3a.75.75 0 111.06-1.06l1.72 1.72V4.75a.75.75 0 011.5 0v4.69l1.72-1.72a.75.75 0 111.06 1.06l-3 3A.75.75 0 018 12z" clipRule="evenodd" />
          </svg>
          <span>{subValue}</span>
          <span className="text-gray-300">{subLabel}</span>
        </div>
      )}
    </div>
  )
}

/* ── Peak Day badge ── */
function PeakBadge({ daily }) {
  if (!daily.length) return null
  const peak = daily.reduce((a, b) => (a.views > b.views ? a : b))
  if (!peak.views) return null
  const date = new Date(peak.date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-amber-500">
        <path d="M8 .5a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.873 6.625a.75.75 0 01.416-1.28l4.21-.611L7.327.918A.75.75 0 018 .5z" />
      </svg>
      أفضل يوم: {peak.views.toLocaleString('ar-SA')} زيارة · {date}
    </span>
  )
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null)
  const [daily, setDaily] = useState([])
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    analyticsService.getSummary()
      .then(({ data }) => setSummary(data))
      .catch(() => setError('تعذّر تحميل الإحصائيات'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setChartLoading(true)
    analyticsService.getDailyViews(days)
      .then(({ data }) => setDaily(data.dailyViews || []))
      .catch(() => {})
      .finally(() => setChartLoading(false))
  }, [days])

  const totalInPeriod = daily.reduce((s, d) => s + (d.views || 0), 0)
  const avg = daily.length ? Math.round(totalInPeriod / daily.length) : 0

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <header className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0520 0%, #130a2e 40%, #1a0d3d 70%, #0f0825 100%)' }}>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #a5b4fc 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Aurora blurs */}
        <div className="absolute top-0 left-1/4 w-64 h-32 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent)' }} />
        <div className="absolute bottom-0 right-1/3 w-48 h-24 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(ellipse, #6366f1, transparent)' }} />

        <div className="relative max-w-5xl mx-auto px-5 pt-5 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link to="/dashboard"
              className="flex items-center gap-1.5 text-indigo-300 hover:text-white transition-colors text-sm font-medium group">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              لوحة التحكم
            </Link>
            <span className="text-indigo-700">/</span>
            <span className="text-white font-semibold text-sm">الإحصائيات</span>
          </div>

          {/* Title row */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">إحصائيات البطاقة</h1>
              </div>
              <p className="text-indigo-300/80 text-sm">تتبّع زيارات بطاقتك المهنية ومدى وصولها</p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="text-xs text-white/70 font-medium">مباشر</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-6 space-y-5 page-enter">

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard loading={loading}
            label="إجمالي الزيارات"
            value={summary?.totalViews != null ? summary.totalViews.toLocaleString('ar-SA') : null}
            gradient="from-indigo-500 to-violet-600"
            delay="0ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard loading={loading}
            label="آخر ٧ أيام"
            value={summary?.viewsLast7Days != null ? summary.viewsLast7Days.toLocaleString('ar-SA') : null}
            gradient="from-pink-500 to-rose-600"
            delay="60ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            }
          />
          <StatCard loading={loading}
            label="آخر ٣٠ يوم"
            value={summary?.viewsLast30Days != null ? summary.viewsLast30Days.toLocaleString('ar-SA') : null}
            gradient="from-sky-500 to-cyan-600"
            delay="120ms"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
          />
        </div>

        {/* ── Chart card ── */}
        <div className="card p-6">
          {/* Card header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-900">الزيارات اليومية</h3>
              <div className="flex flex-wrap items-center gap-2">
                {!chartLoading && daily.length > 0 && (
                  <>
                    <PeakBadge daily={daily} />
                    <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1 font-medium">
                      متوسط {avg.toLocaleString('ar-SA')} زيارة/يوم
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Period selector */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
              {periods.map(p => (
                <button key={p.value} onClick={() => setDays(p.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    days === p.value
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          {chartLoading ? (
            <div className="skeleton h-56 w-full rounded-xl" />
          ) : daily.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center mb-4 border border-indigo-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth={1.4} className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">لا توجد بيانات بعد</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                شارك رابط بطاقتك مع الآخرين لتبدأ في تتبع الزيارات هنا
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'inherit' }}
                    tickFormatter={v => {
                      const d = new Date(v)
                      return `${d.getDate()}/${d.getMonth() + 1}`
                    }}
                    axisLine={false} tickLine={false}
                    interval={days <= 7 ? 0 : days <= 14 ? 1 : 3}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'inherit' }}
                    allowDecimals={false} axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e0e7ff', strokeWidth: 1.5 }} />
                  <Area
                    type="monotone" dataKey="views"
                    stroke="#6366f1" strokeWidth={2.5}
                    fill="url(#viewsGrad)" dot={false}
                    activeDot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Summary row */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-indigo-500 rounded-full inline-block" />
                  زيارات فريدة لكل ساعة لكل IP
                </div>
                <span>آخر تحديث: الآن</span>
              </div>
            </>
          )}
        </div>

        {/* ── Tips card ── */}
        <div className="card p-5 bg-gradient-to-l from-indigo-50/60 to-violet-50/40 border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-600">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">نصيحة لزيادة الزيارات</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                أضف رابط بطاقتك في توقيع بريدك الإلكتروني، ملفك الشخصي على LinkedIn، وبيو حساباتك الاجتماعية لزيادة الوصول.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

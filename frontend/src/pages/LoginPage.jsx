import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

/* ── Dark purple panel — same as hero ── */
function AuthPanel({ title, subtitle, card }) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between h-full p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d0520 0%, #130a2e 45%, #1a0d3d 75%, #0f0825 100%)' }}
    >
      {/* Aurora orbs */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-60px',
        width: '380px', height: '380px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '45%', left: '30%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
        filter: 'blur(35px)', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div className="relative z-10">
        <span className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Cairo, sans-serif' }}>
          بِطاقة
        </span>
      </div>

      {/* Center content */}
      <div className="relative z-10 space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {title}
          </h2>
          <p className="text-purple-200 text-base leading-relaxed opacity-80" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {subtitle}
          </p>
        </div>

        {/* Mini profile card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '20px',
          maxWidth: '280px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '13px',
              fontFamily: 'Cairo, sans-serif',
            }}>سا</div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '13px', fontFamily: 'Cairo, sans-serif' }}>سارة المطيري</div>
              <div style={{ color: '#c4b5fd', fontSize: '11px', fontFamily: 'Cairo, sans-serif' }}>مطورة ويب · الرياض</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {['React', 'TypeScript', 'Node.js'].map(s => (
              <span key={s} style={{
                fontSize: '11px', padding: '2px 10px', borderRadius: '20px',
                background: 'rgba(139,92,246,0.3)', color: '#ddd6fe',
                border: '1px solid rgba(139,92,246,0.4)',
              }}>{s}</span>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>bitaqa.app/p/sara</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10" style={{ color: 'rgba(196,181,253,0.6)', fontSize: '13px', fontFamily: 'Cairo, sans-serif' }}>
        مجاني تماماً — لا حاجة لبطاقة ائتمانية
      </div>
    </div>
  )
}

/* ── Main ── */
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      if (status === 401 || status === 400) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else if (status >= 500 || !err.response) {
        setError('حدث خطأ في الخادم، يرجى المحاولة لاحقاً')
      } else {
        setError(err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthPanel
        title={<>حضورك المهني<br />في رابط واحد</>}
        subtitle="أنشئ بطاقتك الرقمية واعرض مهاراتك ومشاريعك للعالم بأسلوب احترافي"
      />

      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-12 bg-white min-h-screen">
        <div className="w-full max-w-sm" style={{ animation: 'fadeInUp 0.5s ease both' }}>

          {/* Back to home */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-600 transition-colors duration-200">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              الرئيسية
            </Link>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-bold" style={{ color: '#6d28d9', fontFamily: 'Cairo, sans-serif' }}>بِطاقة</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">أهلاً بعودتك 👋</h1>
            <p className="text-gray-400 text-sm">سجّل دخولك للوصول إلى بطاقتك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required autoComplete="email"
                placeholder="example@mail.com"
                className="input"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} required autoComplete="current-password"
                  placeholder="••••••••"
                  className="input pl-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600"
                style={{ animation: 'fadeInUp 0.3s ease both' }}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold text-sm transition-all duration-200"
              style={{
                background: loading ? '#7c3aed' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(109,40,217,0.4)',
                transform: loading ? 'none' : undefined,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الدخول...
                </>
              ) : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="font-semibold transition-colors duration-200" style={{ color: '#7c3aed' }}
                onMouseEnter={e => e.target.style.color = '#5b21b6'}
                onMouseLeave={e => e.target.style.color = '#7c3aed'}>
                إنشاء حساب مجاني
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

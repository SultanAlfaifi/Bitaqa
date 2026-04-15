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

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

/* ── Dark purple panel — same as hero ── */
function AuthPanel() {
  const features = [
    'بطاقة شخصية احترافية',
    'رابط مخصص باسمك',
    'إحصائيات الزيارات',
    'مجاني تماماً',
  ]

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
            ابنِ هويتك
            <br />المهنية اليوم
          </h2>
          <p className="text-purple-200 text-base leading-relaxed opacity-80" style={{ fontFamily: 'Cairo, sans-serif' }}>
            انضم وأنشئ بطاقتك الاحترافية في أقل من ٥ دقائق
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          {features.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-3"
              style={{ animation: `fadeInUp 0.4s ease ${0.1 * i}s both` }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'rgba(139,92,246,0.3)',
                border: '1px solid rgba(139,92,246,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#c4b5fd', flexShrink: 0,
              }}>
                <CheckIcon />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontFamily: 'Cairo, sans-serif' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10" style={{ color: 'rgba(196,181,253,0.6)', fontSize: '13px', fontFamily: 'Cairo, sans-serif' }}>
        انضم اليوم — لا بطاقة ائتمانية مطلوبة
      </div>
    </div>
  )
}

function StrengthBar({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length
  const colors = ['#f87171', '#fb923c', '#facc15', '#4ade80']
  const labels = ['', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية']
  const textColors = ['', '#ef4444', '#f97316', '#ca8a04', '#16a34a']
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            height: '3px', flex: 1, borderRadius: '9999px',
            background: i < score ? colors[score - 1] : '#e5e7eb',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      {score > 0 && (
        <p style={{ fontSize: '12px', color: textColors[score] }}>{labels[score]}</p>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('كلمتا المرور غير متطابقتين'); return }
    if (form.password.length < 8) { setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل'); return }
    setLoading(true)
    try {
      await register(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message || ''
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exists')) {
        setError('هذا البريد الإلكتروني مسجّل مسبقاً')
      } else if (status >= 500 || !err.response) {
        setError('حدث خطأ في الخادم، يرجى المحاولة لاحقاً')
      } else {
        setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthPanel />

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">إنشاء حساب جديد ✨</h1>
            <p className="text-gray-400 text-sm">ابدأ مجاناً — لا حاجة لبطاقة ائتمانية</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required autoComplete="email" placeholder="example@mail.com" className="input" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} required autoComplete="new-password"
                  placeholder="٨ أحرف على الأقل" className="input pl-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <StrengthBar password={form.password} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} required autoComplete="new-password"
                  placeholder="••••••••" className="input pl-10" />
                {form.confirmPassword && (
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold ${
                    form.password === form.confirmPassword ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {form.password === form.confirmPassword ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </div>

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
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الإنشاء...
                </>
              ) : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-semibold transition-colors duration-200" style={{ color: '#7c3aed' }}
                onMouseEnter={e => e.target.style.color = '#5b21b6'}
                onMouseLeave={e => e.target.style.color = '#7c3aed'}>
                تسجيل الدخول
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

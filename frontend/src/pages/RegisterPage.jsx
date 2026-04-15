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

function AuthPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-violet-400/20 rounded-full" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className="relative">
        <span className="text-3xl font-bold text-white tracking-tight">بِطاقة</span>
      </div>

      <div className="relative space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            ابنِ هويتك
            <br />المهنية اليوم
          </h2>
          <p className="text-indigo-200 text-base leading-relaxed">
            انضم وأنشئ بطاقتك الاحترافية
            في أقل من ٥ دقائق
          </p>
        </div>

        <div className="space-y-3">
          {[
            'بطاقة شخصية احترافية',
            'رابط مخصص باسمك',
            'إحصائيات الزيارات',
            'مجاني تماماً',
          ].map(item => (
            <div key={item} className="flex items-center gap-3 text-white">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckIcon />
              </div>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative text-indigo-300 text-sm">
        انضم اليوم — لا بطاقة ائتمانية مطلوبة
      </div>
    </div>
  )
}

function StrengthBar({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  const labels = ['', 'ضعيفة', 'متوسطة', 'جيدة', 'قوية']
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-gray-200'}`} />
        ))}
      </div>
      {score > 0 && <p className={`text-xs ${score < 2 ? 'text-red-500' : score < 3 ? 'text-yellow-600' : 'text-green-600'}`}>{labels[score]}</p>}
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
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthPanel />

      <div className="flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm page-enter">

          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-bold text-indigo-600">بِطاقة</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">إنشاء حساب جديد</h1>
            <p className="text-gray-500 text-sm">ابدأ مجاناً — لا حاجة لبطاقة ائتمانية</p>
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
                  <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${form.password === form.confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                    {form.password === form.confirmPassword ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </div>

            {error && (
              <div className="scale-in flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الإنشاء...
                </>
              ) : 'إنشاء الحساب'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

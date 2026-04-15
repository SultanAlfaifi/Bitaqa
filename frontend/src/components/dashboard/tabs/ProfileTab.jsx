import { useState, useEffect } from 'react'
import * as profileService from '../../../services/profileService'

function Field({ label, hint, icon, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
          {icon && <span className="text-gray-400">{icon}</span>}
          {label}
        </label>
        {hint && <span className="text-xs text-gray-400 tabular-nums">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function AvatarPreview({ url, displayName }) {
  const [valid, setValid] = useState(false)
  useEffect(() => {
    if (!url) { setValid(false); return }
    const img = new Image()
    img.onload = () => setValid(true)
    img.onerror = () => setValid(false)
    img.src = url
  }, [url])

  const initials = (displayName || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-50 to-violet-50/60 rounded-2xl border border-indigo-100/60">
      {valid ? (
        <img src={url} alt="avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md" />
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-300 to-violet-400 ring-2 ring-white shadow-md flex items-center justify-center">
          <span className="text-white text-xl font-bold">{initials}</span>
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-gray-800">{valid ? 'معاينة الصورة' : 'الصورة الافتراضية'}</p>
        <p className="text-xs text-gray-500 mt-0.5">{valid ? 'ستظهر هكذا على بطاقتك' : 'أدخل رابط صورة صالح للمعاينة'}</p>
      </div>
    </div>
  )
}

export default function ProfileTab({ onProfileLoaded }) {
  const [form, setForm] = useState({
    displayName: '', bio: '', avatarUrl: '',
    specialization: '', location: '', websiteUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    profileService.getMyProfile()
      .then(({ data }) => {
        setForm({
          displayName: data.displayName || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          specialization: data.specialization || '',
          location: data.location || '',
          websiteUrl: data.websiteUrl || '',
        })
        if (onProfileLoaded) onProfileLoaded(data)
      })
      .catch(() => setStatus('error'))
      .finally(() => setLoading(false))
  }, [])

  const h = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus(null)
    setSaving(true)
    try {
      await profileService.updateProfile(form)
      if (onProfileLoaded) onProfileLoaded({ ...form, username: '' })
      setStatus('success')
      setTimeout(() => setStatus(null), 3500)
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {[160, 120, 100, 140].map((w, i) => (
          <div key={i} className="space-y-2">
            <div className={`skeleton h-4 w-${w < 130 ? '24' : '32'} rounded`} style={{ width: w }} />
            <div className="skeleton h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Section: Identity ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-600">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-800">الهوية الشخصية</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="الاسم الكامل">
            <input type="text" name="displayName" value={form.displayName} onChange={h}
              maxLength={100} placeholder="مثال: سلطان العمري" className="input" autoFocus />
          </Field>
          <Field label="التخصص أو المسمى الوظيفي">
            <input type="text" name="specialization" value={form.specialization} onChange={h}
              maxLength={100} placeholder="مثال: مطوّر ويب متكامل" className="input" />
          </Field>
          <Field label="الموقع الجغرافي">
            <div className="relative">
              <svg viewBox="0 0 20 20" fill="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <input type="text" name="location" value={form.location} onChange={h}
                maxLength={100} placeholder="الرياض، المملكة العربية السعودية" className="input pr-9" />
            </div>
          </Field>
          <Field label="الموقع الشخصي">
            <div className="relative">
              <svg viewBox="0 0 20 20" fill="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              <input type="url" name="websiteUrl" value={form.websiteUrl} onChange={h}
                placeholder="https://yoursite.com" className="input pr-9" />
            </div>
          </Field>
        </div>
      </div>

      {/* ── Section: Avatar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-violet-600">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-800">الصورة الشخصية</h3>
        </div>
        <div className="p-6 space-y-4">
          <AvatarPreview url={form.avatarUrl} displayName={form.displayName} />
          <Field label="رابط الصورة" hint="يدعم JPG، PNG، WebP">
            <input type="url" name="avatarUrl" value={form.avatarUrl} onChange={h}
              placeholder="https://example.com/photo.jpg" className="input" />
          </Field>
        </div>
      </div>

      {/* ── Section: Bio ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-sky-600">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-800">النبذة التعريفية</h3>
          <span className="mr-auto text-xs text-gray-400 tabular-nums">{form.bio.length} / 500</span>
        </div>
        <div className="p-6">
          <textarea name="bio" value={form.bio} onChange={h}
            maxLength={500} rows={4}
            placeholder="اكتب نبذة مختصرة تعرّف بنفسك وخبراتك وما تقدمه للعالم..."
            className="input resize-none leading-relaxed" />
        </div>
      </div>

      {/* Status */}
      {status === 'success' && (
        <div className="scale-in flex items-center gap-3 rounded-2xl bg-green-50 border border-green-100 px-5 py-3.5 text-sm text-green-700 font-medium">
          <div className="w-7 h-7 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          تم حفظ التغييرات بنجاح ✓
        </div>
      )}
      {status === 'error' && (
        <div className="scale-in flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 text-sm text-red-600 font-medium">
          <div className="w-7 h-7 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          حدث خطأ أثناء الحفظ، حاول مجدداً
        </div>
      )}

      {/* Save */}
      <div className="flex justify-end pb-6">
        <button type="submit" disabled={saving} className="btn-primary px-8">
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جارٍ الحفظ...
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              حفظ التغييرات
            </>
          )}
        </button>
      </div>
    </form>
  )
}

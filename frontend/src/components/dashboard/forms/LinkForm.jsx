import { useState } from 'react'

const PLATFORMS = [
  {
    value: 'GITHUB',
    label: 'GitHub',
    gradient: 'from-gray-700 to-gray-900',
    path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  },
  {
    value: 'LINKEDIN',
    label: 'LinkedIn',
    gradient: 'from-blue-600 to-blue-700',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    value: 'TWITTER',
    label: 'X / Twitter',
    gradient: 'from-gray-800 to-black',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    value: 'INSTAGRAM',
    label: 'Instagram',
    gradient: 'from-pink-500 to-orange-400',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    value: 'YOUTUBE',
    label: 'YouTube',
    gradient: 'from-red-500 to-red-700',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    value: 'FACEBOOK',
    label: 'Facebook',
    gradient: 'from-blue-500 to-blue-800',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    value: 'WHATSAPP',
    label: 'WhatsApp',
    gradient: 'from-green-500 to-emerald-600',
    path: 'M19.05 4.91A9.816 9.816 0 0012.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.49 1.01 2.66.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.2 1.13.17 1.56.11.48-.08 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18s-.22-.15-.47-.27z',
  },
  {
    value: 'OTHER',
    label: 'أخرى',
    gradient: 'from-indigo-400 to-violet-500',
    path: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.757-4.9a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    isStroke: true,
  },
]

const DOMAIN_MAP = [
  { pattern: /github\.com/i,              platform: 'GITHUB'    },
  { pattern: /linkedin\.com/i,            platform: 'LINKEDIN'  },
  { pattern: /(twitter|x)\.com/i,         platform: 'TWITTER'   },
  { pattern: /instagram\.com/i,           platform: 'INSTAGRAM' },
  { pattern: /youtube\.com|youtu\.be/i,   platform: 'YOUTUBE'   },
  { pattern: /facebook\.com|fb\.com/i,    platform: 'FACEBOOK'  },
  { pattern: /wa\.me|whatsapp\.com/i,     platform: 'WHATSAPP'  },
]

function detectPlatform(url) {
  if (!url) return null
  for (const { pattern, platform } of DOMAIN_MAP) {
    if (pattern.test(url)) return platform
  }
  return null
}

export default function LinkForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    platform: 'GITHUB',
    url: '',
    label: '',
    ...initial,
  })
  const [detected, setDetected] = useState(false)

  const selected = PLATFORMS.find(p => p.value === form.platform) || PLATFORMS[0]

  const handleUrlChange = (e) => {
    const url = e.target.value
    const found = detectPlatform(url)
    if (found) {
      setForm(f => ({ ...f, url, platform: found }))
      setDetected(true)
      setTimeout(() => setDetected(false), 2000)
    } else {
      setForm(f => ({ ...f, url }))
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-pink-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-l from-pink-50 to-rose-50/60 border-b border-pink-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-pink-600">
            {initial
              ? <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              : <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            }
          </svg>
        </div>
        <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">
          {initial ? 'تعديل الرابط' : 'إضافة رابط جديد'}
        </span>
      </div>

      <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5 space-y-5">

        {/* Platform selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">المنصة</label>
          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map(p => {
              const active = form.platform === p.value
              return (
                <button key={p.value} type="button"
                  onClick={() => setForm({ ...form, platform: p.value, label: p.value === 'OTHER' ? form.label : '' })}
                  className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border-2 transition-all duration-150
                    ${active
                      ? 'border-transparent shadow-md scale-[1.03]'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}
                  style={active ? { background: `linear-gradient(135deg, var(--tw-gradient-stops))` } : {}}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${p.gradient} shadow-sm`}>
                    <svg viewBox="0 0 24 24"
                      fill={p.isStroke ? 'none' : 'currentColor'}
                      stroke={p.isStroke ? 'currentColor' : 'none'}
                      strokeWidth={p.isStroke ? 2 : 0}
                      className="w-4 h-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d={p.path} />
                    </svg>
                  </div>
                  <span className={`text-[10px] font-bold leading-tight text-center
                    ${active ? 'text-indigo-700' : 'text-gray-500'}`}>
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">الرابط</label>
            {detected && (
              <span className="scale-in flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                تم التعرف على المنصة
              </span>
            )}
          </div>
          <div className="relative">
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-gradient-to-br ${selected.gradient} flex items-center justify-center shrink-0 transition-all duration-300`}>
              <svg viewBox="0 0 24 24"
                fill={selected.isStroke ? 'none' : 'currentColor'}
                stroke={selected.isStroke ? 'currentColor' : 'none'}
                strokeWidth={selected.isStroke ? 2 : 0}
                className="w-3 h-3 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d={selected.path} />
              </svg>
            </div>
            <input
              type="url"
              value={form.url}
              onChange={handleUrlChange}
              required
              placeholder="الصق الرابط هنا وسنتعرف على المنصة تلقائياً..."
              className="input pr-11"
              dir="ltr"
            />
          </div>
          <p className="text-xs text-gray-400">يتم التعرف تلقائياً على: GitHub، LinkedIn، X، Instagram، YouTube، Facebook</p>
        </div>

        {/* Custom label for OTHER */}
        {form.platform === 'OTHER' && (
          <div className="space-y-1.5 scale-in">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">اسم الرابط</label>
            <input
              type="text"
              value={form.label}
              onChange={e => setForm({ ...form, label: e.target.value })}
              maxLength={50}
              placeholder="مثال: موقعي الشخصي"
              className="input"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">إلغاء</button>
          <button type="submit" disabled={loading || !form.url.trim()} className="btn-primary flex-1">
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  حفظ
                </>
              )
            }
          </button>
        </div>
      </form>
    </div>
  )
}

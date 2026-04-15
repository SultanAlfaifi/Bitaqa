import { useState } from 'react'

export default function ProjectForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    projectUrl: '',
    imageUrl: '',
    ...initial,
  })
  const [imgError, setImgError] = useState(false)
  const h = e => { setForm({ ...form, [e.target.name]: e.target.value }); if (e.target.name === 'imageUrl') setImgError(false) }

  return (
    <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-l from-sky-50 to-blue-50/60 border-b border-sky-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-sky-100 flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-sky-600">
            {initial
              ? <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              : <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            }
          </svg>
        </div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">
          {initial ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        </span>
      </div>

      <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5 space-y-4">

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            اسم المشروع <span className="text-red-400">*</span>
          </label>
          <input type="text" name="title" value={form.title} onChange={h}
            required maxLength={100}
            placeholder="مثال: منصة بِطاقة، تطبيق توصيل..."
            className="input" autoFocus />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">الوصف</label>
            <span className="text-xs text-gray-400 tabular-nums">{form.description.length} / 500</span>
          </div>
          <textarea name="description" value={form.description} onChange={h}
            maxLength={500} rows={3}
            placeholder="اشرح ما يفعله المشروع بجملة أو جملتين..."
            className="input resize-none leading-relaxed" />
        </div>

        {/* Two columns: URL + Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">رابط المشروع</label>
            <div className="relative">
              <svg viewBox="0 0 20 20" fill="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              <input type="url" name="projectUrl" value={form.projectUrl} onChange={h}
                placeholder="https://..." className="input pr-9" dir="ltr" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">رابط الصورة</label>
            <div className="relative">
              <svg viewBox="0 0 20 20" fill="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={h}
                placeholder="https://..." className="input pr-9" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Image preview */}
        {form.imageUrl && !imgError && (
          <div className="fade-in rounded-xl overflow-hidden border border-gray-100 h-28 bg-gray-50">
            <img src={form.imageUrl} alt="preview"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">إلغاء</button>
          <button type="submit" disabled={loading || !form.title.trim()} className="btn-primary flex-1">
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

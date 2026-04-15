import { useState } from 'react'

const levels = [
  {
    value: 'BEGINNER',
    label: 'مبتدئ',
    desc: 'أساسيات ومعرفة عامة',
    color: 'border-gray-300 bg-gray-50 text-gray-700',
    activeColor: 'border-gray-500 bg-gray-100 text-gray-800 ring-2 ring-gray-300',
    dot: 'bg-gray-400',
  },
  {
    value: 'INTERMEDIATE',
    label: 'متوسط',
    desc: 'خبرة عملية جيدة',
    color: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    activeColor: 'border-indigo-500 bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300',
    dot: 'bg-indigo-400',
  },
  {
    value: 'EXPERT',
    label: 'خبير',
    desc: 'إتقان وخبرة متقدمة',
    color: 'border-violet-200 bg-violet-50 text-violet-700',
    activeColor: 'border-violet-500 bg-gradient-to-br from-indigo-600 to-violet-600 text-white ring-2 ring-violet-300',
    dot: 'bg-violet-500',
  },
]

export default function SkillForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: '',
    level: 'INTERMEDIATE',
    ...initial,
  })

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-l from-indigo-50 to-violet-50/60 border-b border-indigo-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-indigo-600">
            {initial
              ? <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              : <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            }
          </svg>
        </div>
        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
          {initial ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}
        </span>
      </div>

      <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="p-5 space-y-5">

        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">اسم المهارة</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            maxLength={50}
            placeholder="مثال: React، Python، Figma..."
            className="input"
            autoFocus
          />
        </div>

        {/* Level selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">مستوى الإتقان</label>
          <div className="grid grid-cols-3 gap-2">
            {levels.map(lvl => {
              const active = form.level === lvl.value
              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setForm({ ...form, level: lvl.value })}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer
                    ${active ? lvl.activeColor : `${lvl.color} hover:opacity-80`}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-current opacity-70' : lvl.dot}`} />
                  <span className="text-sm font-bold">{lvl.label}</span>
                  <span className={`text-[10px] font-medium text-center leading-tight ${active && lvl.value === 'EXPERT' ? 'text-white/80' : 'opacity-60'}`}>
                    {lvl.desc}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onCancel}
            className="btn-secondary flex-1">
            إلغاء
          </button>
          <button type="submit" disabled={loading || !form.name.trim()}
            className="btn-primary flex-1">
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

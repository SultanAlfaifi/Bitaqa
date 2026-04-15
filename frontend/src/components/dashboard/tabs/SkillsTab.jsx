import { useState, useEffect } from 'react'
import * as skillService from '../../../services/skillService'
import SkillForm from '../forms/SkillForm'
import ConfirmDialog from '../../common/ConfirmDialog'

const LEVELS = [
  { key: 'BEGINNER',     label: 'مبتدئ',  color: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200', dot: 'bg-gray-400',    header: 'bg-gray-50 border-gray-200 text-gray-600' },
  { key: 'INTERMEDIATE', label: 'متوسط',  color: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200', dot: 'bg-indigo-400', header: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { key: 'EXPERT',       label: 'خبير',   color: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm', dot: 'bg-violet-500', header: 'bg-violet-50 border-violet-200 text-violet-700' },
]

function SkillChip({ skill, onEdit, onDelete }) {
  const lvl = LEVELS.find(l => l.key === skill.level) || LEVELS[0]
  return (
    <div className={`group flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full ${lvl.color} transition-all duration-150 cursor-default`}>
      <span className="text-sm font-semibold">{skill.name}</span>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button onClick={() => onEdit(skill)}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors
            ${skill.level === 'EXPERT' ? 'hover:bg-white/20 text-white/80' : 'hover:bg-black/10 text-current'}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button onClick={() => onDelete(skill.id)}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors
            ${skill.level === 'EXPERT' ? 'hover:bg-red-400/40 text-red-200' : 'hover:bg-red-100 text-red-400'}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function SkillsTab() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editSkill, setEditSkill] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    skillService.getSkills()
      .then(({ data }) => setSkills(data))
      .catch(() => setError('تعذّر تحميل المهارات'))
      .finally(() => setLoading(false))
  }, [])

  const closeForm = () => { setShowForm(false); setEditSkill(null) }

  const handleSave = async (form) => {
    setFormLoading(true)
    try {
      if (editSkill) {
        const { data } = await skillService.updateSkill(editSkill.id, form)
        setSkills(skills.map(s => s.id === editSkill.id ? data : s))
      } else {
        const { data } = await skillService.addSkill(form)
        setSkills([...skills, data])
      }
      closeForm()
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await skillService.deleteSkill(deleteId)
      setSkills(skills.filter(s => s.id !== deleteId))
      setDeleteId(null)
    } catch { setError('تعذّر الحذف') }
    finally { setDeleteLoading(false) }
  }

  if (loading) return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="skeleton h-10 w-full rounded-full" />)}
    </div>
  )

  const grouped = LEVELS.map(lvl => ({
    ...lvl,
    items: skills.filter(s => s.level === lvl.key),
  })).filter(g => g.items.length > 0 || showForm || editSkill)

  return (
    <div className="space-y-4">

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1 rtl:space-x-reverse">
            {LEVELS.map(l => (
              <div key={l.key} className={`w-3 h-3 rounded-full ${l.dot} ring-2 ring-white`} />
            ))}
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900">{skills.length}</span>
            <span className="text-sm text-gray-400"> / 30 مهارة</span>
          </div>
          {/* Progress bar */}
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${(skills.length / 30) * 100}%` }} />
          </div>
        </div>
        {!showForm && !editSkill && skills.length < 30 && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            إضافة مهارة
          </button>
        )}
      </div>

      {error && (
        <div className="scale-in text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-5 py-3">{error}</div>
      )}

      {/* Add form */}
      {(showForm || editSkill) && (
        <div className="scale-in">
          <SkillForm
            initial={editSkill || undefined}
            onSave={handleSave}
            onCancel={closeForm}
            loading={formLoading}
          />
        </div>
      )}

      {/* Empty state */}
      {skills.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#sg)" strokeWidth={1.5} className="w-8 h-8">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">ابدأ بإضافة مهاراتك</p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">أبرز مهاراتك التقنية والمهنية لتجعل بطاقتك أكثر تأثيراً</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            أضف أول مهارة
          </button>
        </div>
      )}

      {/* Skills grouped by level */}
      {skills.length > 0 && !editSkill && (
        <div className="space-y-3">
          {LEVELS.map(lvl => {
            const items = skills.filter(s => s.level === lvl.key)
            if (!items.length) return null
            return (
              <div key={lvl.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-3 border-b flex items-center gap-2 ${lvl.header}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${lvl.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">{lvl.label}</span>
                  <span className="text-xs opacity-60 font-medium">{items.length}</span>
                </div>
                <div className="p-5 flex flex-wrap gap-2">
                  {items.map(skill => (
                    <SkillChip key={skill.id} skill={skill}
                      onEdit={s => { setEditSkill(s); setShowForm(false) }}
                      onDelete={id => setDeleteId(id)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit inline */}
      {editSkill && !showForm && (
        <div className="scale-in">
          <SkillForm initial={editSkill} onSave={handleSave} onCancel={closeForm} loading={formLoading} />
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="حذف المهارة"
        message="هل تريد حذف هذه المهارة نهائيًا؟"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  )
}

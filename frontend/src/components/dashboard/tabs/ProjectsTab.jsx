import { useState, useEffect } from 'react'
import * as projectService from '../../../services/projectService'
import ProjectForm from '../forms/ProjectForm'
import ConfirmDialog from '../../common/ConfirmDialog'

function ProjectCard({ project, onEdit, onDelete, index }) {
  return (
    <div className="item-enter group relative bg-white border border-gray-100 rounded-2xl overflow-hidden
                    hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5
                    transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}>

      {/* Image / Placeholder */}
      {project.imageUrl ? (
        <div className="h-40 overflow-hidden bg-gray-100">
          <img src={project.imageUrl} alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-50/50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-10 h-10 text-indigo-200 relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1.5">{project.title}</h4>
        {project.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{project.description}</p>
        )}
        {project.projectUrl && (
          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold
                       transition-colors duration-150 group/link">
            عرض المشروع
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}
              className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-150">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 3.5H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V9m-5.5-5.5l7 0m0 0v7" />
            </svg>
          </a>
        )}
      </div>

      {/* Action buttons — appear on hover */}
      <div className="absolute top-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        <button onClick={() => onEdit(project)}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button onClick={() => onDelete(project.id)}
          className="w-8 h-8 rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-red-500 hover:border-red-200 transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    projectService.getProjects()
      .then(({ data }) => setProjects(data))
      .catch(() => setError('تعذّر تحميل المشاريع'))
      .finally(() => setLoading(false))
  }, [])

  const closeForm = () => { setShowForm(false); setEditProject(null) }

  const handleSave = async (form) => {
    setFormLoading(true)
    try {
      if (editProject) {
        const { data } = await projectService.updateProject(editProject.id, form)
        setProjects(projects.map(p => p.id === editProject.id ? data : p))
      } else {
        const { data } = await projectService.addProject(form)
        setProjects([...projects, data])
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
      await projectService.deleteProject(deleteId)
      setProjects(projects.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } catch { setError('تعذّر الحذف') }
    finally { setDeleteLoading(false) }
  }

  if (loading) return (
    <div className="grid grid-cols-2 gap-3">
      {[1,2,3,4].map(i => <div key={i} className="skeleton h-52 w-full rounded-2xl" />)}
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">{projects.length}</span>
          <span className="text-sm text-gray-400">/ 20 مشروع</span>
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(projects.length / 20) * 100}%` }} />
          </div>
        </div>
        {!showForm && !editProject && projects.length < 20 && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            إضافة مشروع
          </button>
        )}
      </div>

      {error && (
        <div className="scale-in text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-5 py-3">{error}</div>
      )}

      {(showForm || editProject) && (
        <div className="scale-in">
          <ProjectForm
            initial={editProject || undefined}
            onSave={handleSave}
            onCancel={closeForm}
            loading={formLoading}
          />
        </div>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#pg)" strokeWidth={1.5} className="w-8 h-8">
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">اعرض مشاريعك هنا</p>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">أضف مشاريعك وأعمالك لإثراء ملفك المهني</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">أضف أول مشروع</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project, i) =>
            editProject?.id === project.id ? (
              <div key={project.id} className="sm:col-span-2 scale-in">
                <ProjectForm initial={project} onSave={handleSave} onCancel={closeForm} loading={formLoading} />
              </div>
            ) : (
              <ProjectCard key={project.id} project={project} index={i}
                onEdit={p => { setEditProject(p); setShowForm(false) }}
                onDelete={id => setDeleteId(id)} />
            )
          )}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="حذف المشروع"
        message="هل تريد حذف هذا المشروع نهائيًا؟"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  )
}

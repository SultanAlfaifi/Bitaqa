import { useState, useEffect } from 'react'
import * as linkService from '../../../services/linkService'
import LinkForm from '../forms/LinkForm'
import ConfirmDialog from '../../common/ConfirmDialog'

const PLATFORM_META = {
  GITHUB:    { label: 'GitHub',      gradient: 'from-gray-700 to-gray-900',     text: 'text-white', ring: 'ring-gray-700/20' },
  LINKEDIN:  { label: 'LinkedIn',    gradient: 'from-blue-600 to-blue-700',     text: 'text-white', ring: 'ring-blue-600/20' },
  TWITTER:   { label: 'Twitter / X', gradient: 'from-gray-800 to-black',        text: 'text-white', ring: 'ring-gray-800/20' },
  INSTAGRAM: { label: 'Instagram',   gradient: 'from-pink-500 to-orange-400',   text: 'text-white', ring: 'ring-pink-500/20' },
  YOUTUBE:   { label: 'YouTube',     gradient: 'from-red-500 to-red-700',       text: 'text-white', ring: 'ring-red-500/20' },
  FACEBOOK:  { label: 'Facebook',    gradient: 'from-blue-500 to-blue-800',     text: 'text-white', ring: 'ring-blue-500/20' },
  OTHER:     { label: 'أخرى',        gradient: 'from-indigo-500 to-violet-600', text: 'text-white', ring: 'ring-indigo-500/20' },
}

const PLATFORM_PATHS = {
  GITHUB:    'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  LINKEDIN:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  TWITTER:   'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  INSTAGRAM: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  YOUTUBE:   'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  FACEBOOK:  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  OTHER:     'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.757-4.9a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
}

function LinkCard({ link, onEdit, onDelete, index }) {
  const meta = PLATFORM_META[link.platform] || PLATFORM_META.OTHER
  const path = PLATFORM_PATHS[link.platform]
  const isOther = link.platform === 'OTHER'

  return (
    <div className="item-enter group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100
                    hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/60 transition-all duration-200"
      style={{ animationDelay: `${index * 50}ms` }}>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0
                       shadow-sm ring-4 ${meta.ring}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
          {isOther
            ? <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            : <path d={path} />}
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{link.label || meta.label}</p>
        <a href={link.url} target="_blank" rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-indigo-600 truncate block transition-colors max-w-xs">
          {link.url}
        </a>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
        <button onClick={() => onEdit(link)}
          className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 flex items-center justify-center transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button onClick={() => onDelete(link.id)}
          className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 flex items-center justify-center transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function LinksTab() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editLink, setEditLink] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    linkService.getLinks()
      .then(({ data }) => setLinks(data))
      .catch(() => setError('تعذّر تحميل الروابط'))
      .finally(() => setLoading(false))
  }, [])

  const closeForm = () => { setShowForm(false); setEditLink(null) }

  const handleSave = async (form) => {
    setFormLoading(true)
    try {
      if (editLink) {
        const { data } = await linkService.updateLink(editLink.id, form)
        setLinks(links.map(l => l.id === editLink.id ? data : l))
      } else {
        const { data } = await linkService.addLink(form)
        setLinks([...links, data])
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
      await linkService.deleteLink(deleteId)
      setLinks(links.filter(l => l.id !== deleteId))
      setDeleteId(null)
    } catch { setError('تعذّر الحذف') }
    finally { setDeleteLoading(false) }
  }

  if (loading) return (
    <div className="space-y-3">
      {[1,2].map(i => <div key={i} className="skeleton h-20 w-full rounded-2xl" />)}
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-gray-900">{links.length}</span>
          <span className="text-sm text-gray-400"> / 10 روابط</span>
        </div>
        {!showForm && !editLink && links.length < 10 && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            إضافة رابط
          </button>
        )}
      </div>

      {error && (
        <div className="scale-in text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-5 py-3">{error}</div>
      )}

      {(showForm || editLink) && (
        <div className="scale-in">
          <LinkForm initial={editLink || undefined} onSave={handleSave} onCancel={closeForm} loading={formLoading} />
        </div>
      )}

      {links.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <div className="flex justify-center gap-2 mb-5">
            {['GITHUB','LINKEDIN','TWITTER'].map(p => {
              const meta = PLATFORM_META[p]
              return (
                <div key={p} className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-sm opacity-60`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path d={PLATFORM_PATHS[p]} />
                  </svg>
                </div>
              )
            })}
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">أضف روابط تواصلك</p>
          <p className="text-sm text-gray-400 mb-6">اربط بطاقتك بحساباتك على منصات التواصل</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">أضف أول رابط</button>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) =>
            editLink?.id === link.id ? (
              <div key={link.id} className="scale-in">
                <LinkForm initial={link} onSave={handleSave} onCancel={closeForm} loading={formLoading} />
              </div>
            ) : (
              <LinkCard key={link.id} link={link} index={i}
                onEdit={l => { setEditLink(l); setShowForm(false) }}
                onDelete={id => setDeleteId(id)} />
            )
          )}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="حذف الرابط"
        message="هل تريد حذف هذا الرابط نهائيًا؟"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleteLoading} />
    </div>
  )
}

import { useEffect } from 'react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  /* close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = e => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm fade-in" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm scale-in overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-red-400 to-rose-500" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{title || 'تأكيد الحذف'}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {message || 'هل أنت متأكد من هذا الإجراء؟ لا يمكن التراجع عنه.'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} disabled={loading}
              className="btn-secondary">
              إلغاء
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="btn-danger">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الحذف...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  حذف
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

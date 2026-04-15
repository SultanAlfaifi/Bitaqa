import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as profileService from '../../services/profileService'

export default function SettingsPanel() {
  const [username, setUsername] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [visibility, setVisibility] = useState('PUBLIC')
  const [loading, setLoading] = useState(true)
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [visibilityLoading, setVisibilityLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState(null)
  const [visibilityStatus, setVisibilityStatus] = useState(null)
  const [usernameError, setUsernameError] = useState('')

  useEffect(() => {
    profileService.getMyProfile()
      .then(({ data }) => {
        setUsername(data.username)
        setNewUsername(data.username)
        setVisibility(data.visibility)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleUsernameSubmit = async e => {
    e.preventDefault()
    if (newUsername === username) return
    setUsernameError('')
    setUsernameStatus(null)
    setUsernameLoading(true)
    try {
      await profileService.updateUsername(newUsername)
      setUsername(newUsername)
      setUsernameStatus('success')
      setTimeout(() => setUsernameStatus(null), 3000)
    } catch (err) {
      setUsernameError(err.response?.data?.message || 'اسم المستخدم غير متاح أو غير صالح')
    } finally {
      setUsernameLoading(false)
    }
  }

  const handleVisibilityToggle = async () => {
    const next = visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC'
    setVisibilityStatus(null)
    setVisibilityLoading(true)
    try {
      await profileService.updateVisibility(next)
      setVisibility(next)
      setVisibilityStatus('success')
      setTimeout(() => setVisibilityStatus(null), 3000)
    } catch {
      setVisibilityStatus('error')
    } finally {
      setVisibilityLoading(false)
    }
  }

  if (loading) return (
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="skeleton h-5 w-36 rounded" />
          <div className="skeleton h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )

  const isPublic = visibility === 'PUBLIC'

  return (
    <div className="space-y-4">

      {/* ── Username ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-600">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">اسم المستخدم</h3>
            <p className="text-xs text-gray-400 mt-0.5">يظهر في رابط بطاقتك العامة</p>
          </div>
        </div>
        <div className="p-6 space-y-4">

          {/* Link preview */}
          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400 shrink-0">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-indigo-500 font-mono">bitaqa.app/p/</span>
            <span className="text-xs text-indigo-700 font-mono font-bold">{username}</span>
            <Link to={`/p/${username}`} target="_blank"
              className="mr-auto text-xs text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1">
              فتح
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 3.5H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V9m-5.5-5.5l7 0m0 0v7" />
              </svg>
            </Link>
          </div>

          <form onSubmit={handleUsernameSubmit} className="space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-mono select-none">@</span>
                <input
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  pattern="^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$"
                  required
                  className="input pr-9 font-mono"
                  placeholder="your-username"
                />
              </div>
              <button type="submit"
                disabled={usernameLoading || newUsername === username || !newUsername}
                className="btn-primary shrink-0">
                {usernameLoading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'حفظ'}
              </button>
            </div>
            <p className="text-xs text-gray-400">3-30 حرف · أحرف إنجليزية صغيرة وأرقام وشرطة (-) فقط</p>

            {usernameError && (
              <div className="scale-in flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {usernameError}
              </div>
            )}
            {usernameStatus === 'success' && (
              <div className="scale-in flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-green-500">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                تم تغيير اسم المستخدم بنجاح
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Visibility ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isPublic ? 'bg-green-50' : 'bg-gray-100'}`}>
            {isPublic ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">حالة الملف الشخصي</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isPublic ? 'بطاقتك مرئية للجميع' : 'بطاقتك مخفية عن الجميع'}
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
            isPublic
              ? 'bg-green-50/60 border-green-200/60'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                isPublic ? 'bg-green-100' : 'bg-gray-200'
              }`}>
                {isPublic ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-bold transition-colors duration-300 ${isPublic ? 'text-green-800' : 'text-gray-600'}`}>
                  {isPublic ? 'عام — مرئي للجميع' : 'خاص — مخفي'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isPublic
                    ? 'يمكن لأي شخص رؤية بطاقتك عبر الرابط'
                    : 'لا يمكن لأحد رؤية بطاقتك حالياً'}
                </p>
              </div>
            </div>

            <button
              onClick={handleVisibilityToggle}
              disabled={visibilityLoading}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none disabled:opacity-60 ${
                isPublic ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`} />
              {visibilityLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </span>
              )}
            </button>
          </div>

          {visibilityStatus === 'success' && (
            <div className="mt-3 scale-in flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-green-500">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              تم تحديث حالة الملف الشخصي
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

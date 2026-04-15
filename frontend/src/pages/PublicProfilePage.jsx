import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as profileService from '../services/profileService'

/* ─────────────────────────────────────────────
   Social Meta
───────────────────────────────────────────── */
const SOCIAL_META = {
  GITHUB:    { label:'GitHub',    color:'#c9d1d9', path:'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
  LINKEDIN:  { label:'LinkedIn',  color:'#58a6ff', path:'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  TWITTER:   { label:'X',         color:'#e7e9ea', path:'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  INSTAGRAM: { label:'Instagram', color:'#f77737', path:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  YOUTUBE:   { label:'YouTube',   color:'#ff4444', path:'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  FACEBOOK:  { label:'Facebook',  color:'#4a9eff', path:'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  WHATSAPP:  { label:'WhatsApp',  color:'#25d366', path:'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
  OTHER:     { label:'رابط',      color:'#a78bfa', isStroke:true, path:'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.1-1.1m-.757-4.9a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
}

/* ─────────────────────────────────────────────
   Skill config
───────────────────────────────────────────── */
const LEVEL = {
  EXPERT:       { ar:'خبير',   dot:'bg-violet-500', chip:'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-sm shadow-indigo-200' },
  INTERMEDIATE: { ar:'متوسط',  dot:'bg-indigo-400', chip:'bg-indigo-50 text-indigo-700 border-indigo-200' },
  BEGINNER:     { ar:'مبتدئ',  dot:'bg-slate-300',  chip:'bg-gray-50 text-gray-600 border-gray-200' },
}

/* ─────────────────────────────────────────────
   useReveal
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Social icon button (fixed sizes)
───────────────────────────────────────────── */
function SocialBtn({ link }) {
  const m = SOCIAL_META[link.platform] || SOCIAL_META.OTHER
  const [hovered, setHovered] = useState(false)
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer"
      title={link.label || m.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-center justify-center w-12 h-12 rounded-2xl
                 border border-white/15 bg-white/8 hover:bg-white/15 hover:border-white/30
                 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5
                 hover:shadow-lg hover:shadow-black/30">
      <svg
        viewBox="0 0 24 24"
        fill={m.isStroke ? 'none' : 'currentColor'}
        stroke={m.isStroke ? 'currentColor' : 'none'}
        strokeWidth={m.isStroke ? 2 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: 20, height: 20, color: hovered ? m.color : 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
      >
        <path d={m.path} />
      </svg>
      {/* tooltip */}
      <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-[11px]
                       font-medium px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                       pointer-events-none transition-opacity duration-150 z-20 border border-white/10 shadow-xl">
        {link.label || m.label}
      </span>
    </a>
  )
}

/* ─────────────────────────────────────────────
   Project row card
───────────────────────────────────────────── */
const PROJ_COLORS = [
  ['#6366f1','#8b5cf6'],['#0ea5e9','#6366f1'],['#8b5cf6','#ec4899'],
  ['#10b981','#6366f1'],['#f59e0b','#ef4444'],['#06b6d4','#6366f1'],
]

function ProjectRow({ proj, index }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [hovered,   setHovered]   = useState(false)
  const [c1, c2] = PROJ_COLORS[index % PROJ_COLORS.length]
  const letter   = (proj.title || '?')[0].toUpperCase()

  return (
    <div style={{
      display:'flex', gap:14, alignItems:'flex-start', padding:14,
      borderRadius:16, border:'1px solid #f0ebff', background:'#fafaff',
      transition:'box-shadow 0.2s, transform 0.2s',
      boxShadow: hovered ? '0 6px 20px rgba(99,102,241,0.13)' : 'none',
      transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* thumbnail — always visible */}
      <div style={{
        width:72, height:72, borderRadius:14, flexShrink:0, overflow:'hidden',
        position:'relative', background:`linear-gradient(135deg,${c1},${c2})`
      }}>
        {proj.imageUrl && !imgFailed ? (
          <img src={proj.imageUrl} alt={proj.title}
            onError={() => setImgFailed(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <>
            <div style={{ position:'absolute', top:-10, right:-10, width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.18)' }} />
            <div style={{ position:'absolute', bottom:-8, left:-8, width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.12)' }} />
            <span style={{
              position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:26, fontWeight:900, color:'rgba(255,255,255,0.9)', lineHeight:1, userSelect:'none'
            }}>{letter}</span>
          </>
        )}
      </div>

      {/* text */}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:14, fontWeight:700, color:'#111827', margin:0, lineHeight:1.4 }}>{proj.title}</p>
        {proj.description && (
          <p style={{
            fontSize:12, color:'#6b7280', margin:'5px 0 0', lineHeight:1.65,
            overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'
          }}>{proj.description}</p>
        )}
        {proj.projectUrl && (
          <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" style={{
            display:'inline-flex', alignItems:'center', gap:4, marginTop:8,
            fontSize:12, fontWeight:700, color:'#6366f1', textDecoration:'none'
          }}>
            عرض المشروع
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" style={{ width:10, height:10 }}>
              <path d="M2 10L10 2M10 2H4M10 2v6" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Not Found
───────────────────────────────────────────── */
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center page-enter">
        <div className="w-20 h-20 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9 text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">الملف غير موجود</h1>
        <p className="text-gray-400 text-sm mb-7">هذا الملف الشخصي غير موجود أو غير متاح للعرض</p>
        <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
          أنشئ بطاقتك ←
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-80 animate-pulse" style={{ background: 'linear-gradient(160deg,#1e1547,#2d1f6e)' }} />
      <div className="max-w-2xl mx-auto px-6 -mt-14 space-y-5 pb-12">
        <div className="w-28 h-28 rounded-full bg-white/20 animate-pulse" />
        <div className="space-y-3">
          <div className="h-7 w-48 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function PublicProfilePage() {
  const { username } = useParams()
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [imgErr,   setImgErr]   = useState(false)

  useEffect(() => {
    setLoading(true); setNotFound(false); setImgErr(false)
    profileService.getPublicProfile(username)
      .then(({ data }) => setProfile(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  if (loading)  return <ProfileSkeleton />
  if (notFound) return <NotFound />
  if (!profile) return null

  const initials = (profile.displayName || profile.username || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const experts       = profile.skills?.filter(s => s.level === 'EXPERT')       ?? []
  const intermediates = profile.skills?.filter(s => s.level === 'INTERMEDIATE') ?? []
  const beginners     = profile.skills?.filter(s => s.level === 'BEGINNER')     ?? []

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">

      {/* ╔══════════════════════════════════════════╗
          ║  HERO — dark purple (matching LandingPage)║
          ╚══════════════════════════════════════════╝ */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0520 0%, #130a2e 45%, #1a0d3d 75%, #0f0825 100%)' }}>

        {/* aurora orbs — same as landing page */}
        <div className="absolute pointer-events-none"
          style={{ top:'-20%', right:'-5%', width:520, height:520, borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none"
          style={{ bottom:'-30%', left:'-8%', width:440, height:440, borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none"
          style={{ top:'40%', left:'30%', width:360, height:360, borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(79,70,229,0.2) 0%, transparent 70%)' }} />

        <div className="relative max-w-2xl mx-auto px-6 pt-14 pb-14 page-enter">

          {/* view count badge */}
          {profile.viewCount > 0 && (
            <div className="absolute top-5 left-6 flex items-center gap-1.5 text-white/60 text-xs font-medium
                            px-3 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm">
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width:14, height:14 }}>
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {profile.viewCount.toLocaleString('ar-SA')} مشاهدة
            </div>
          )}

          {/* ── avatar + identity ── */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 text-center sm:text-right">

            {/* avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-600 opacity-80 blur-[3px]" />
              {profile.avatarUrl && !imgErr ? (
                <img src={profile.avatarUrl} alt={profile.displayName}
                  onError={() => setImgErr(true)}
                  className="relative w-32 h-32 rounded-full object-cover ring-[3px] ring-white/20" />
              ) : (
                <div className="relative w-32 h-32 rounded-full ring-[3px] ring-white/20
                                bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-extrabold tracking-tight">{initials}</span>
                </div>
              )}
              {/* online dot */}
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-[3px] border-[#1e1547]">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              </span>
            </div>

            {/* text */}
            <div className="flex-1 min-w-0">
              <h1 className="font-extrabold leading-tight tracking-tight text-white"
                style={{ fontSize: 'clamp(1.75rem, 5vw, 2.6rem)' }}>
                {profile.displayName || profile.username}
              </h1>

              {profile.specialization && (
                <p className="mt-1.5 text-base font-semibold"
                  style={{ background:'linear-gradient(90deg,#a5b4fc,#c4b5fd)',
                           WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  {profile.specialization}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3">
                <span className="font-mono text-white/30 text-sm">@{profile.username}</span>
                {profile.location && (
                  <span className="flex items-center gap-1.5 text-white/50 text-sm">
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width:14, height:14, color:'rgba(167,139,250,0.7)', flexShrink:0 }}>
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {profile.location}
                  </span>
                )}
                {profile.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-100 text-sm transition-colors">
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width:14, height:14, flexShrink:0 }}>
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    {profile.websiteUrl.replace(/^https?:\/\//,'').replace(/\/$/,'')}
                  </a>
                )}
              </div>

              {/* stats */}
              {(profile.skills?.length > 0 || profile.projects?.length > 0 || profile.viewCount > 0) && (
                <div className="inline-flex items-stretch mt-5 rounded-2xl overflow-hidden border border-white/12 bg-white/8 backdrop-blur-sm">
                  {profile.skills?.length > 0 && (
                    <div className="flex flex-col items-center justify-center px-5 py-2.5 border-l border-white/10 first:border-0">
                      <span className="text-xl font-extrabold text-white leading-none">{profile.skills.length}</span>
                      <span className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">مهارة</span>
                    </div>
                  )}
                  {profile.projects?.length > 0 && (
                    <div className="flex flex-col items-center justify-center px-5 py-2.5 border-l border-white/10">
                      <span className="text-xl font-extrabold text-white leading-none">{profile.projects.length}</span>
                      <span className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">مشروع</span>
                    </div>
                  )}
                  {profile.viewCount > 0 && (
                    <div className="flex flex-col items-center justify-center px-5 py-2.5 border-l border-white/10">
                      <span className="text-xl font-extrabold text-white leading-none">{profile.viewCount.toLocaleString('ar-SA')}</span>
                      <span className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">زيارة</span>
                    </div>
                  )}
                </div>
              )}

              {/* social icons */}
              {profile.socialLinks?.length > 0 && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 mt-5">
                  {profile.socialLinks.map((link, i) => (
                    <div key={link.id} style={{ animationDelay:`${i * 50}ms` }} className="item-enter">
                      <SocialBtn link={link} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ╔══════════════════════════════════════════╗
          ║  BODY                                    ║
          ╚══════════════════════════════════════════╝ */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20 pt-8" style={{ display:'flex', flexDirection:'column', gap:16 }}>

        {/* ── Bio ── */}
        {profile.bio && (
          <div style={{
            background:'linear-gradient(135deg,#fafaff 0%,#f3f0ff 100%)',
            borderRadius:20, padding:'24px 26px',
            border:'1px solid #e9e3ff'
          }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <svg viewBox="0 0 32 32" fill="none" style={{ width:36, height:36, flexShrink:0, marginTop:2 }}>
                <rect width="32" height="32" rx="10" fill="url(#bioGrad)" />
                <defs>
                  <linearGradient id="bioGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path d="M10 12h12M10 16h8M10 20h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:8 }}>نبذة عني</p>
                <p style={{ fontSize:15, color:'#4b5563', lineHeight:1.85, margin:0 }}>{profile.bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {profile.skills?.length > 0 && (
          <div style={{
            background:'#fff', borderRadius:20, padding:'24px 26px',
            border:'1px solid #ede9fe',
            boxShadow:'0 1px 12px rgba(99,102,241,0.06)'
          }}>
            {/* header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <svg viewBox="0 0 32 32" fill="none" style={{ width:32, height:32, flexShrink:0 }}>
                  <rect width="32" height="32" rx="9" fill="url(#skillGrad)" />
                  <defs>
                    <linearGradient id="skillGrad" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <path d="M16 8l1.8 5.5h5.8l-4.7 3.4 1.8 5.5L16 19l-4.7 3.4 1.8-5.5L8.4 13.5h5.8z" fill="white" />
                </svg>
                <span style={{ fontSize:14, fontWeight:700, color:'#1f2937' }}>المهارات</span>
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'#9ca3af', background:'#f9fafb', border:'1px solid #f3f4f6', padding:'2px 10px', borderRadius:20 }}>{profile.skills.length}</span>
            </div>

            {[['EXPERT', experts], ['INTERMEDIATE', intermediates], ['BEGINNER', beginners]].map(([level, skills]) => {
              if (!skills.length) return null
              const dotColors = { EXPERT:'#8b5cf6', INTERMEDIATE:'#6366f1', BEGINNER:'#d1d5db' }
              const labelColors = { EXPERT:'#7c3aed', INTERMEDIATE:'#4f46e5', BEGINNER:'#9ca3af' }
              const chipStyles = {
                EXPERT: { background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', border:'none', boxShadow:'0 2px 8px rgba(99,102,241,0.3)' },
                INTERMEDIATE: { background:'#eef2ff', color:'#4f46e5', border:'1px solid #c7d2fe' },
                BEGINNER: { background:'#f9fafb', color:'#6b7280', border:'1px solid #e5e7eb' },
              }
              return (
                <div key={level} style={{ marginBottom: level === 'BEGINNER' ? 0 : 14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:dotColors[level], display:'inline-block', flexShrink:0 }} />
                    <span style={{ fontSize:10, fontWeight:700, color:labelColors[level], textTransform:'uppercase', letterSpacing:'0.13em' }}>
                      {level === 'EXPERT' ? 'خبير' : level === 'INTERMEDIATE' ? 'متوسط' : 'مبتدئ'}
                    </span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, paddingRight:12 }}>
                    {skills.map(sk => (
                      <span key={sk.id} style={{
                        padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600,
                        cursor:'default', ...chipStyles[level]
                      }}>{sk.name}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Projects ── */}
        {profile.projects?.length > 0 && (
          <div style={{
            background:'#fff', borderRadius:20, padding:'24px 26px',
            border:'1px solid #ede9fe',
            boxShadow:'0 1px 12px rgba(99,102,241,0.06)'
          }}>
            {/* header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <svg viewBox="0 0 32 32" fill="none" style={{ width:32, height:32, flexShrink:0 }}>
                  <rect width="32" height="32" rx="9" fill="url(#projGrad)" />
                  <defs>
                    <linearGradient id="projGrad" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <rect x="8" y="10" width="16" height="12" rx="2" stroke="white" strokeWidth="1.8" fill="none" />
                  <path d="M12 14l2.5 2.5L18 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize:14, fontWeight:700, color:'#1f2937' }}>المشاريع</span>
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'#9ca3af', background:'#f9fafb', border:'1px solid #f3f4f6', padding:'2px 10px', borderRadius:20 }}>{profile.projects.length}</span>
            </div>

            {/* project rows */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {profile.projects.map((proj, i) => (
                <ProjectRow key={proj.id} proj={proj} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <Reveal delay={170}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200/60">
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width:16, height:16, color:'white' }}>
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors">
                مدعوم بـ <span className="font-bold text-indigo-500 group-hover:text-indigo-700 transition-colors">بِطاقة</span>
              </span>
            </Link>

            <Link to="/register"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white
                         bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-200
                         hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200">
              أنشئ بطاقتك المجانية
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}
                className="rotate-180" style={{ width:14, height:14 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </Reveal>

      </div>
    </div>
  )
}

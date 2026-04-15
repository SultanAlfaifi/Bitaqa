import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ══════════════════════════════════════════════════════
   Scroll reveal hook — adds .visible when element enters view
══════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ══════════════════════════════════════════════════════
   Reveal wrappers
══════════════════════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0, dir = '' }) {
  const cls = dir === 'left' ? 'reveal-left' : dir === 'right' ? 'reveal-right' : 'reveal'
  return (
    <div className={`${cls} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Platform data — marquee bar
══════════════════════════════════════════════════════ */
const MARQUEE_PLATFORMS = [
  {
    name: 'GitHub',
    path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  },
  {
    name: 'LinkedIn',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    name: 'X / Twitter',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    name: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    name: 'YouTube',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'Facebook',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'WhatsApp',
    path: 'M19.05 4.91A9.816 9.816 0 0012.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.49 1.01 2.66.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.2 1.13.17 1.56.11.48-.08 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18s-.22-.15-.47-.27z',
  },
]

/* ══════════════════════════════════════════════════════
   Mockup Card
   → Save your photo to:  frontend/public/sultan.jpg
══════════════════════════════════════════════════════ */
function MockupCard() {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className="relative w-72 sm:w-[340px] mx-auto select-none">

      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/60 to-violet-600/60 rounded-3xl blur-3xl scale-105"
        style={{ animation: 'pulseDot 4s ease-in-out infinite' }} />

      {/* Badge — visits (top right, floating) */}
      <div className="float absolute -top-6 -right-6 z-20 bg-white rounded-2xl shadow-2xl shadow-indigo-200/60 border border-gray-100/80 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">٢٤٧ زيارة</p>
          <p className="text-xs text-emerald-500 font-semibold mt-0.5">↑ ١٨٪ هذا الأسبوع</p>
        </div>
      </div>

      {/* Badge — URL (bottom left, floating) */}
      <div className="float-delayed absolute -bottom-5 -left-6 z-20 bg-white rounded-2xl shadow-2xl shadow-indigo-200/60 border border-gray-100/80 px-4 py-2.5 flex items-center gap-2">
        <span className="pulse-dot w-2 h-2 bg-green-400 rounded-full shrink-0" />
        <span className="text-xs font-mono text-gray-400">bitaqa.app/p/<span className="text-indigo-600 font-bold">sultan</span></span>
      </div>

      {/* ── The card ── */}
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-300/30 border border-gray-100/80 z-10">

        {/* Cover — z-0 ensures avatar (z-10 below) renders on top */}
        <div className="h-24 bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 relative z-0 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 opacity-25"
            style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
          {/* No blur filters here — blur creates stacking context that hides avatar */}
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-violet-500/25 rounded-full" />
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-300/20 rounded-full" />
        </div>

        <div className="px-6 pb-6 relative z-10">
          {/* Avatar + public badge */}
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="w-[68px] h-[68px] rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-gradient-to-br from-indigo-400 to-violet-500 shrink-0">
              {imgOk ? (
                <img
                  src="/sultan.jpg"
                  alt="سلطان الفيفي"
                  onError={() => setImgOk(false)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">سف</span>
                </div>
              )}
            </div>
            <div className="mb-1 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-dot" />
              <span className="text-[10px] text-emerald-600 font-bold">عام</span>
            </div>
          </div>

          {/* Name & title */}
          <h3 className="text-[17px] font-bold text-gray-900 leading-tight">سلطان الفيفي</h3>
          <p className="text-xs text-indigo-600 font-semibold mt-0.5">مطوّر ويب وتطبيقات</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-rose-400 shrink-0">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            المملكة العربية السعودية
          </p>

          {/* Social icons */}
          <div className="flex gap-2 mt-4">
            {[
              { c: '#14171a', l: 'X' },
              { c: '#0077b5', l: 'in' },
              { c: '#24292e', l: 'GH' },
            ].map(({ c, l }) => (
              <div key={l} className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: c }}>
                <span className="text-white text-[9px] font-black">{l}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="border-t border-gray-100 mt-4 pt-3">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">المهارات</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                ['React', 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'],
                ['TypeScript', 'bg-indigo-50 text-indigo-700'],
                ['Tailwind', 'bg-sky-50 text-sky-700'],
                ['Figma', 'bg-gray-100 text-gray-600'],
              ].map(([n, s]) => (
                <span key={n} className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${s}`}>{n}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Feature card
══════════════════════════════════════════════════════ */
const FEATURE_STYLES = {
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'hover:border-indigo-200', shadow: 'hover:shadow-indigo-100/60' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'hover:border-violet-200', shadow: 'hover:shadow-violet-100/60' },
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     border: 'hover:border-sky-200',    shadow: 'hover:shadow-sky-100/60'    },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'hover:border-emerald-200',shadow: 'hover:shadow-emerald-100/60'},
}

function FeatureCard({ icon, title, desc, accent, delay, dir }) {
  const s = FEATURE_STYLES[accent]
  return (
    <Reveal delay={delay} dir={dir}>
      <div className={`group h-full bg-white rounded-2xl border border-gray-100 p-7 ${s.border} hover:shadow-xl ${s.shadow} hover:-translate-y-1.5 transition-all duration-300`}>
        <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          <span className={s.text}>{icon}</span>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </Reveal>
  )
}

/* ══════════════════════════════════════════════════════
   Main
══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  useReveal()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir="rtl">

      {/* ══ NAVBAR ══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-all duration-300
        ${scrolled
          ? 'bg-white/95 border-gray-100 shadow-sm shadow-gray-100/80'
          : 'bg-white/8 border-white/10'
        }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className={`text-xl font-black tracking-tight transition-colors duration-300
            ${scrolled ? 'bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent' : 'text-white'}`}>
            بِطاقة
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard"
                className={`text-sm font-bold px-5 py-2 rounded-full border transition-all duration-200
                  ${scrolled
                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                  }`}>
                لوحة التحكم ←
              </Link>
            ) : (
              <>
                <Link to="/login"
                  className={`text-sm px-4 py-2 rounded-full transition-all duration-200
                    ${scrolled
                      ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}>
                  تسجيل الدخول
                </Link>
                <Link to="/register"
                  className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-lg
                    ${scrolled
                      ? 'bg-gradient-to-l from-indigo-600 to-violet-600 text-white shadow-indigo-200 hover:opacity-90'
                      : 'bg-white text-indigo-900 shadow-black/20 hover:bg-indigo-50'
                    }`}>
                  ابدأ مجاناً
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO — full viewport height, no bottom fade ══ */}
      <section
        className="relative flex items-center min-h-[100dvh] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0520 0%, #130a2e 45%, #1a0d3d 75%, #0f0825 100%)' }}
      >
        {/* Aurora blurs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.35) 0%, transparent 65%)' }} />
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(79,70,229,0.2) 0%, transparent 70%)' }} />
        </div>

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.055]"
          style={{ backgroundImage: 'radial-gradient(rgba(165,180,252,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-6xl mx-auto px-6 w-full pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[calc(100dvh-144px)]">

            {/* ── Text ── */}
            <div className="flex flex-col justify-center">
              {/* Pill badge */}
              <div className="hero-word inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/30 rounded-full px-4 py-1.5 text-xs text-indigo-300 font-semibold mb-8 w-fit"
                style={{ animationDelay: '0ms' }}>
                <span className="pulse-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                بطاقتك المهنية الرقمية
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(2.6rem,5.5vw,4.2rem)] font-black leading-[1.06] mb-6">
                <span className="hero-word block text-white" style={{ animationDelay: '80ms' }}>
                  حضورك المهني
                </span>
                <span className="hero-word block" style={{
                  animationDelay: '200ms',
                  background: 'linear-gradient(to left, #818cf8, #a78bfa, #c084fc)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>
                  في رابط واحد
                </span>
              </h1>

              <p className="hero-word text-base sm:text-lg text-indigo-200/55 leading-relaxed mb-10 max-w-md"
                style={{ animationDelay: '340ms' }}>
                بطاقة تعريفية احترافية تجمع مهاراتك، مشاريعك، وروابط تواصلك — وترسم حضورك الرقمي بأسلوب لا يُنسى.
              </p>

              {/* CTAs */}
              <div className="hero-word flex flex-wrap items-center gap-4 mb-12" style={{ animationDelay: '460ms' }}>
                <Link to="/register"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30"
                  style={{ background: 'linear-gradient(to left, #6366f1, #8b5cf6)' }}>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">ابدأ مجاناً — الآن</span>
                  <span className="relative group-hover:-translate-x-1 transition-transform duration-150">←</span>
                </Link>
                <Link to="/login" className="group text-sm text-indigo-300/70 hover:text-white transition-colors duration-150 flex items-center gap-1.5">
                  لدي حساب
                  <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                </Link>
              </div>

              {/* Stats bar */}
              <div className="hero-word grid grid-cols-3 divide-x divide-x-reverse divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm"
                style={{ animationDelay: '580ms' }}>
                {[
                  { val: '٣', sub: 'خطوات فقط' },
                  { val: '< ٥ دقائق', sub: 'وبطاقتك جاهزة' },
                  { val: '١٠٠٪ مجاني', sub: 'للأبد' },
                ].map((s, i) => (
                  <div key={i} className="px-3 py-5 text-center">
                    <p className="text-lg font-black text-white leading-none mb-1">{s.val}</p>
                    <p className="text-[11px] text-indigo-300/50">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Mockup ── */}
            <div className="hero-word flex justify-center items-center py-10 lg:py-0" style={{ animationDelay: '260ms' }}>
              <MockupCard />
            </div>
          </div>
        </div>
        {/* NO bottom fade — clean cut */}
      </section>

      {/* ══ PLATFORMS MARQUEE ══ */}
      <section className="py-16 bg-white border-b border-gray-100">
        <Reveal>
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.22em] mb-10">
            يدعم جميع منصات التواصل
          </p>
        </Reveal>

        {/* ── Ticker ──
             MATH FIX: with CSS flex gap, 14 items have 13 gaps → -50% ≠ start of clone.
             Solution: use px padding per item (not gap on container) so each item's
             total box = content + padding, and 50% = exactly 7 items = start of clone ✓  */}
        <div className="relative overflow-hidden" dir="ltr">
          {/* Left fade — rgba(255,255,255,0) instead of 'transparent' avoids grey artifact */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)' }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)' }} />

          {/* Track: 4 copies → ~3900px total, covers any screen width.
               padding per item (not gap) ensures -50% = exactly 2 copies = seamless loop */}
          <div className="flex items-center py-2"
            style={{ width: 'max-content', animation: 'ticker 36s linear infinite', willChange: 'transform' }}>
            {[
              ...MARQUEE_PLATFORMS,
              ...MARQUEE_PLATFORMS,
              ...MARQUEE_PLATFORMS,
              ...MARQUEE_PLATFORMS,
            ].map((p, i) => (
              <div key={i}
                className="flex items-center gap-2.5 px-5 shrink-0 cursor-default group">
                <svg viewBox="0 0 24 24" fill="currentColor"
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors duration-200 shrink-0">
                  <path d={p.path} />
                </svg>
                <span className="text-sm font-semibold text-gray-400 whitespace-nowrap group-hover:text-gray-700 transition-colors duration-200">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">الميزات</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">كل ما تحتاجه</h2>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">أدوات بسيطة وقوية لبناء حضور مهني يُبهر الجميع</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                delay: 0, accent: 'indigo', dir: 'right',
                title: 'بطاقة احترافية',
                desc: 'صفحة شخصية أنيقة تعكس هويتك المهنية بأسلوب عصري ومميز',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
              },
              {
                delay: 120, accent: 'violet', dir: '',
                title: 'مهارات ومشاريع',
                desc: 'اعرض مهاراتك وأعمالك بطريقة منظمة تُبرز قدراتك الحقيقية',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
              },
              {
                delay: 240, accent: 'sky', dir: '',
                title: 'إحصائيات ذكية',
                desc: 'تتبّع من يزور بطاقتك — يومياً وأسبوعياً وشهرياً بدقة',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
              },
              {
                delay: 360, accent: 'emerald', dir: 'left',
                title: 'رابط مخصص',
                desc: 'رابطك الخاص باسمك — شاركه في كل مكان بنقرة واحدة',
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>,
              },
            ].map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-28 px-6" style={{ background: 'linear-gradient(180deg,#fafafe 0%,#f0ecff 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-20">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">كيف تبدأ</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">ثلاث خطوات فقط</h2>
            <p className="text-gray-400 leading-relaxed">من التسجيل لنشر بطاقتك في أقل من ٥ دقائق</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-14 right-[20%] left-[20%] h-px"
              style={{ background: 'linear-gradient(to left, #bae6fd, #c4b5fd, #a5b4fc)' }} />

            {[
              { n: '١', title: 'سجّل حسابك', desc: 'بريدك الإلكتروني فقط — مجاني تماماً', grad: 'from-indigo-500 to-indigo-600', sh: 'shadow-indigo-200', delay: 0, dir: 'right' },
              { n: '٢', title: 'خصّص بطاقتك', desc: 'أضف مهاراتك ومشاريعك وروابطك بسهولة', grad: 'from-violet-500 to-violet-600', sh: 'shadow-violet-200', delay: 150, dir: '' },
              { n: '٣', title: 'شارك مع العالم', desc: 'انشر رابطك في LinkedIn وأي مكان تريده', grad: 'from-sky-500 to-blue-600', sh: 'shadow-sky-200', delay: 300, dir: 'left' },
            ].map((step) => (
              <Reveal key={step.n} delay={step.delay} dir={step.dir}>
                <div className="flex flex-col items-center text-center group">
                  <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${step.grad} flex items-center justify-center text-white text-5xl font-black mb-7 shadow-2xl ${step.sh} group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300`}>
                    {step.n}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl p-14 text-center text-white"
              style={{ background: 'linear-gradient(135deg, #0d0520 0%, #1e1060 50%, #0f0825 100%)' }}>
              {/* Glows */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full rounded-full"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.35) 0%, transparent 60%)' }} />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }} />
              </div>
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(rgba(165,180,252,1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/25 rounded-full px-4 py-1.5 text-xs text-indigo-300 font-semibold mb-6">
                  <span className="pulse-dot w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  مجاني للأبد — ابدأ الآن
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
                  جاهز تبني بطاقتك؟
                </h2>
                <p className="text-indigo-200/55 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  انضم وأنشئ بطاقتك المهنية في دقائق — لا حاجة لبطاقة ائتمانية
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link to="/register"
                    className="group inline-flex items-center gap-2 bg-white text-indigo-900 px-9 py-4 rounded-full text-sm font-bold hover:bg-indigo-50 transition-all duration-200 shadow-2xl hover:-translate-y-0.5">
                    أنشئ بطاقتك مجاناً
                    <span className="group-hover:-translate-x-1 transition-transform duration-150">←</span>
                  </Link>
                  <Link to="/login" className="text-sm text-indigo-300/60 hover:text-indigo-200 transition-colors">
                    تسجيل الدخول
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-gray-100 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-xl font-black bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            بِطاقة
          </Link>
          <p className="text-sm text-gray-400">بطاقتك المهنية الرقمية — مجاناً للأبد</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/login"   className="hover:text-indigo-600 transition-colors">تسجيل الدخول</Link>
            <Link to="/register" className="hover:text-indigo-600 transition-colors">إنشاء حساب</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

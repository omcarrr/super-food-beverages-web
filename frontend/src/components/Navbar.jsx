import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSection } from '../utils/scroll.js'

// Single-page sections on home — navbar scrolls to these and highlights
// whichever one is currently in view (scroll-spy).
const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'flavours', label: 'Flavours' },
  { id: 'find-store', label: 'Find Store' },
  { id: 'about', label: 'About' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()
  const pendingRef = useRef(null)
  const onHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll to a section: instant when already home, otherwise go home first
  // and scroll once the landing has mounted.
  const go = (id) => {
    setOpen(false)
    if (location.pathname === '/') {
      scrollToSection(id)
    } else {
      pendingRef.current = id
      navigate('/')
    }
  }

  useEffect(() => {
    if (location.pathname === '/' && pendingRef.current) {
      const id = pendingRef.current
      pendingRef.current = null
      const t = setTimeout(() => scrollToSection(id), 150)
      return () => clearTimeout(t)
    }
  }, [location.pathname])

  // Scroll-spy: highlight the section currently crossing the viewport middle.
  // Runs only on home; elsewhere no pill is highlighted.
  useEffect(() => {
    if (location.pathname !== '/') return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [location.pathname])

  const pill = (isActive) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'bg-ink text-cream' : 'text-ink hover:bg-ink/5'
    }`

  // Off home, no section pill is highlighted.
  const shownActive = onHome ? active : ''

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/90 shadow-[0_8px_30px_rgba(33,25,21,0.08)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        {/* Logo — original wordmark, no brand assets copied */}
        <button type="button" onClick={() => go('home')} className="flex items-center gap-2.5" aria-label="Super Foods and Beverages — back to top">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-2xl bg-ink text-lg font-extrabold text-cream"
          >
            S
          </span>
          <span className="leading-tight">
            <span className="block text-left text-base font-extrabold tracking-tight text-ink">
              SUPER
            </span>
            <span className="block text-[11px] font-semibold tracking-wide text-ink-soft">
              Foods &amp; Beverages
            </span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={shownActive === s.id ? 'true' : undefined}
              className={pill(shownActive === s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => go('get-in-touch')}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream shadow-[0_8px_20px_rgba(33,25,21,0.25)] transition-transform hover:-translate-y-0.5"
          >
            Request a flavour
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5 md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-ink/10 bg-cream px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                className={`${pill(shownActive === s.id)} text-left`}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => go('get-in-touch')}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-bold text-cream"
            >
              Request a flavour
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

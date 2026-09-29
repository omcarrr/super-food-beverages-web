import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { textOn } from '../data/flavours.js'
import BottleIllustration from './BottleIllustration.jsx'

const DURATION = 0.45
const EASE = 'power2.out'

/**
 * FlavourCard — bottle at rest; on hover (desktop) / tap (touch) a panel in
 * the flavour's brand color slides up from below (GSAP, power2.out, ~0.45s),
 * revealing name + tagline + CTA while the bottle lifts/scales. The CTA
 * calls `onRequestFlavour(slug)` — the page scrolls to the Get in Touch
 * form and pre-adds the flavour, no navigation.
 */
export default function FlavourCard({ flavour, onRequestFlavour }) {
  const cardRef = useRef(null)
  const panelRef = useRef(null)
  const bottleRef = useRef(null)
  const openRef = useRef(false)
  const [revealed, setRevealed] = useState(false)

  const fg = textOn(flavour.color)
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const dur = reduceMotion ? 0 : DURATION

  // Resting state: panel parked below the visible boundary, clipped by card.
  useLayoutEffect(() => {
    gsap.set(panelRef.current, { yPercent: 100 })
    gsap.set(bottleRef.current, { scale: 1, y: 0 })
  }, [])

  const show = () => {
    openRef.current = true
    setRevealed(true)
    gsap.to(panelRef.current, { yPercent: 0, duration: dur, ease: EASE })
    gsap.to(bottleRef.current, { scale: 1.05, y: -10, duration: dur, ease: EASE })
  }

  const hide = () => {
    openRef.current = false
    setRevealed(false)
    gsap.to(panelRef.current, { yPercent: 100, duration: dur, ease: EASE })
    gsap.to(bottleRef.current, { scale: 1, y: 0, duration: dur, ease: EASE })
  }

  // Tap elsewhere (or Escape) hides an open card — touch graceful fallback.
  useEffect(() => {
    if (!revealed) return
    const onDocClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) hide()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') hide()
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed])

  const isCoarsePointer = () =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches

  return (
    <article
      ref={cardRef}
      data-testid={`flavour-card-${flavour.slug}`}
      onMouseEnter={() => {
        if (!isCoarsePointer() && !openRef.current) show()
      }}
      onMouseLeave={() => {
        if (!isCoarsePointer() && openRef.current) hide()
      }}
      onClick={() => {
        // Touch devices: tap toggles the reveal instead of hover.
        if (isCoarsePointer()) {
          if (openRef.current) hide()
          else show()
        }
      }}
      onFocus={() => {
        if (!openRef.current) show()
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && openRef.current) hide()
      }}
      style={{ '--flavour': flavour.color }}
      className="group relative flex h-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl bg-white shadow-[0_20px_45px_rgba(33,25,21,0.10)] outline-none focus-visible:ring-2 focus-visible:ring-ink sm:h-[440px]"
      tabIndex={0}
      aria-label={`${flavour.name} — ${revealed ? 'details shown' : 'activate to show details'}`}
    >
      {/* collection badge */}
      <span className="absolute left-4 top-4 z-10 rounded-full bg-cream px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
        {flavour.collection === 'classic' ? 'Classic' : 'Exotic'}
      </span>

      {/* bottle stage with soft flavour-tinted halo */}
      <div
        aria-hidden="true"
        className="absolute h-64 w-64 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: flavour.color }}
      />
      <div ref={bottleRef} className="relative will-change-transform">
        <BottleIllustration color={flavour.color} label={flavour.name} />
      </div>

      {/* resting hint (desktop only; hidden on touch where tap is the cue) */}
      <p className="pointer-events-none absolute bottom-4 hidden text-xs font-semibold text-ink-soft/70 group-hover:hidden [@media(hover:hover)]:block">
        Hover to reveal
      </p>

      {/* sliding reveal panel — parked at translateY(100%), clipped by card */}
      <div
        ref={panelRef}
        aria-hidden={!revealed}
        className="absolute inset-x-0 bottom-0 z-20 flex min-h-[58%] flex-col justify-end rounded-t-3xl p-5 will-change-transform"
        style={{ backgroundColor: flavour.color, color: fg }}
      >
        <h3 className="text-2xl font-extrabold leading-tight tracking-tight">
          {flavour.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium leading-snug opacity-90">
          {flavour.tagline}
        </p>
        <button
          type="button"
          tabIndex={revealed ? 0 : -1}
          onClick={(e) => {
            e.stopPropagation()
            onRequestFlavour?.(flavour.slug)
          }}
          className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: fg, color: flavour.color }}
        >
          Request this flavour
        </button>
      </div>
    </article>
  )
}

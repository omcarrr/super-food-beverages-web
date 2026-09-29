import { useLayoutEffect, useRef } from 'react'
import BottleIllustration from '../BottleIllustration.jsx'
import { flavours, textOn } from '../../data/flavours.js'
import { revealOnEnter } from '../../animations/landingScroll.js'

/**
 * Fallback showcase used in two cases:
 * - Mobile viewports: full-bleed color-blocked stacked sections with a light
 *   fade/slide reveal each (no pin — cheaper on small GPUs, no scroll
 *   fighting on touch).
 * - `prefers-reduced-motion`: the same content as a plain static grid with
 *   zero animation setup (`animated=false` skips GSAP entirely).
 */
export default function StackedShowcase({ animated, onRequestFlavour }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animated) return
    const cleanup = revealOnEnter(scope.current, { y: 32 })
    return cleanup
  }, [animated])

  if (!animated) {
    return (
      <section id="flavours" aria-label="All flavours" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          All eight flavours
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {flavours.map((f) => {
            const fg = textOn(f.color)
            return (
              <article
                key={f.slug}
                className="flex items-center gap-5 rounded-3xl p-6"
                style={{ backgroundColor: f.color, color: fg }}
              >
                <BottleIllustration
                  color={f.color}
                  label={f.name}
                  className="h-36 w-auto shrink-0"
                />
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight">{f.name}</h3>
                  <p className="mt-1 text-sm font-medium leading-snug opacity-85">
                    {f.tagline}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section ref={scope} id="flavours" aria-label="All flavours" className="scroll-mt-20">
      {flavours.map((f, i) => {
        const fg = textOn(f.color)
        return (
          <div
            key={f.slug}
            data-reveal-group
            className="px-4 py-14 sm:px-6"
            style={{ backgroundColor: f.color, color: fg }}
          >
            <div data-reveal-item className="mx-auto flex max-w-md flex-col items-center text-center">
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                {String(i + 1).padStart(2, '0')} / {String(flavours.length).padStart(2, '0')}
              </p>
              <BottleIllustration
                color={f.color}
                label={f.name}
                className="mt-4 h-64 w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.30)]"
              />
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight">{f.name}</h2>
              <p className="mt-2 text-base font-medium opacity-85">{f.tagline}</p>
              <button
                type="button"
                onClick={() => onRequestFlavour?.(f.slug)}
                className="mt-5 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: fg, color: f.color }}
              >
                Request this flavour
              </button>
            </div>
          </div>
        )
      })}
    </section>
  )
}

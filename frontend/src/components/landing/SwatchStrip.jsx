import { useLayoutEffect, useRef } from 'react'
import { flavours } from '../../data/flavours.js'
import { revealOnEnter } from '../../animations/landingScroll.js'
import { scrollToSection } from '../../utils/scroll.js'

export default function SwatchStrip({ animate }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.07 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <div data-reveal-group>
        <h2 data-reveal-item className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Eight flavours, one promise
        </h2>
        <p data-reveal-item className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Every bottle leaves our line batch-checked and tamper-sealed — the
          same care, whatever you&apos;re sipping.
        </p>
        <div data-reveal-item className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {flavours.map((f) => (
            <span
              key={f.slug}
              title={f.name}
              className="h-12 w-12 rounded-2xl shadow-[0_10px_22px_rgba(33,25,21,0.16)] sm:h-14 sm:w-14"
              style={{ backgroundColor: f.color }}
            />
          ))}
        </div>
        <div data-reveal-item className="mt-9">
          <button
            type="button"
            onClick={() => scrollToSection('lineup')}
            className="inline-block rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream shadow-[0_12px_28px_rgba(33,25,21,0.28)] transition-transform hover:-translate-y-0.5"
          >
            Explore all flavours
          </button>
        </div>
      </div>
    </section>
  )
}

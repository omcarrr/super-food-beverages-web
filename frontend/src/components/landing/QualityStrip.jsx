import { useLayoutEffect, useRef } from 'react'
import { qualityPillars } from '../../data/flavours.js'
import { revealOnEnter } from '../../animations/landingScroll.js'

export default function QualityStrip({ animate }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.12 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} className="bg-cream-dark/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div data-reveal-group className="max-w-xl">
          <p data-reveal-item className="text-sm font-bold uppercase tracking-widest text-ink-soft">
            Why Super
          </p>
          <h2 data-reveal-item className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Made carefully, sip after sip
          </h2>
        </div>
        <div data-reveal-group className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {qualityPillars.map((q, i) => (
            <article
              key={q.title}
              data-reveal-item
              className="rounded-3xl bg-white p-6 shadow-[0_16px_36px_rgba(33,25,21,0.08)]"
            >
              <span
                aria-hidden="true"
                className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-sm font-extrabold text-cream"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
                {q.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{q.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

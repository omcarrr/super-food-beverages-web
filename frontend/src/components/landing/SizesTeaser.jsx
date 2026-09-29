import { useLayoutEffect, useRef } from 'react'
import BottleIllustration from '../BottleIllustration.jsx'
import { sizes } from '../../data/flavours.js'
import { revealOnEnter } from '../../animations/landingScroll.js'

// Visual scale ladder: bottle height grows from 200ml to 2L.
const HEIGHTS = ['h-16', 'h-20', 'h-24', 'h-28', 'h-36', 'h-44']

export default function SizesTeaser({ animate }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.08 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-24">
      <div data-reveal-group>
        <p data-reveal-item className="text-sm font-bold uppercase tracking-widest text-ink-soft">
          Sizes for every table
        </p>
        <h2 data-reveal-item className="mx-auto mt-2 max-w-lg text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          From a single sip to the family pack
        </h2>
        <div
          data-reveal-item
          className="mx-auto mt-10 flex max-w-3xl items-end justify-center gap-4 sm:gap-8"
        >
          {sizes.map((s, i) => (
            <figure key={s.value} className="flex flex-col items-center gap-2">
              <BottleIllustration
                color="#F07E1A"
                label={`Super ${s.value}`}
                className={`${HEIGHTS[i] ?? 'h-24'} w-auto`}
              />
              <figcaption className="text-center">
                <span className="block text-sm font-extrabold text-ink">{s.value}</span>
                <span className="hidden text-xs font-medium text-ink-soft sm:block">
                  {s.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

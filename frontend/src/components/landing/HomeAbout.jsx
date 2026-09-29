import { useLayoutEffect, useRef } from 'react'
import { distributionCities, flavours, sizes } from '../../data/flavours.js'
import { revealOnEnter } from '../../animations/landingScroll.js'

const STATS = [
  { value: String(flavours.length), label: 'Bold flavours' },
  { value: String(sizes.length), label: 'Bottle sizes' },
  { value: `${distributionCities.length}+`, label: 'Cities served' },
]

/**
 * Home about section — brand story, stats, and distribution reach
 * (FR-1.3), living on the single scrolling home page.
 */
export default function HomeAbout({ animate }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.1 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} id="about" className="scroll-mt-20 bg-cream-dark/60">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-14">
        <div data-reveal-group>
          <p data-reveal-item className="text-sm font-bold uppercase tracking-widest text-ink-soft">
            Our story
          </p>
          <h2 data-reveal-item className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Made for every Indian table
          </h2>
          <p data-reveal-item className="mt-4 text-base leading-relaxed text-ink-soft">
            Super Foods &amp; Beverages started with a simple craving — the
            taste of street-corner sodas, wedding-hall sherbets, and summer
            afternoons, bottled with the care of a modern food company. Every
            recipe is balanced for a genuinely crisp sip, batch-checked from
            mixing through bottling, and sealed tamper-evident.
          </p>
          <p data-reveal-item className="mt-3 text-base leading-relaxed text-ink-soft">
            From bold Masala Cola to delicate Rose, our eight flavours span
            classic favourites and regional gems — one promise across all of
            them: freshness, in every drop.
          </p>
        </div>

        <div data-reveal-group className="rounded-3xl bg-white p-6 shadow-[0_16px_36px_rgba(33,25,21,0.08)] sm:p-8">
          <div data-reveal-item className="grid grid-cols-3 gap-4 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
          <h3 data-reveal-item className="mt-8 text-sm font-bold uppercase tracking-widest text-ink-soft">
            Where to find us
          </h3>
          <div data-reveal-item className="mt-3 flex flex-wrap gap-2">
            {distributionCities.map((city) => (
              <span
                key={city}
                className="rounded-full bg-cream px-3.5 py-1.5 text-xs font-bold text-ink"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

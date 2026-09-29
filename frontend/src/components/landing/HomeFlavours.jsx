import { useLayoutEffect, useRef } from 'react'
import FlavourCard from '../FlavourCard.jsx'
import { flavours } from '../../data/flavours.js'
import { revealOnEnter } from '../../animations/landingScroll.js'
import { scrollToSection } from '../../utils/scroll.js'

/**
 * Home flavours section — the full interactive card lineup embedded in the
 * home scroll, right after the "one promise" strip.
 */
export default function HomeFlavours({ animate, onRequestFlavour }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.08 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} id="lineup" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div data-reveal-group className="max-w-xl">
        <p data-reveal-item className="text-sm font-bold uppercase tracking-widest text-ink-soft">
          The lineup
        </p>
        <h2 data-reveal-item className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Pick your favourite
        </h2>
        <p data-reveal-item className="mt-3 text-base leading-relaxed text-ink-soft">
          Hover a bottle — or tap it on mobile — to reveal its story, then
          request it for your shop or event.
        </p>
      </div>
      <div data-reveal-group className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {flavours.map((f) => (
          <div key={f.slug} data-reveal-item>
            <FlavourCard flavour={f} onRequestFlavour={onRequestFlavour} />
          </div>
        ))}
      </div>
      <div data-reveal-group className="mt-10 text-center">
        <button
          data-reveal-item
          type="button"
          onClick={() => scrollToSection('get-in-touch')}
          className="inline-block rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-[0_12px_28px_rgba(33,25,21,0.12)] transition-transform hover:-translate-y-0.5"
        >
          Request these flavours
        </button>
      </div>
    </section>
  )
}

import { useLayoutEffect, useRef } from 'react'
import StoreLocator from '../StoreLocator.jsx'
import { revealOnEnter } from '../../animations/landingScroll.js'

/** Home Find Store section — full locator embedded in the home scroll. */
export default function HomeFindStore({ animate, onRequestSupply }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.1 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} id="find-store" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <div data-reveal-group className="mx-auto max-w-2xl text-center">
        <p data-reveal-item className="text-sm font-bold uppercase tracking-widest text-ink-soft">
          Distribution
        </p>
        <h2 data-reveal-item className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Find Super near you
        </h2>
        <p data-reveal-item className="mt-3 text-base leading-relaxed text-ink-soft">
          Ten cities and counting — pick yours on the map to request supply.
        </p>
      </div>
      <div data-reveal-group className="mt-10">
        <div data-reveal-item>
          <StoreLocator onRequestSupply={onRequestSupply} />
        </div>
      </div>
    </section>
  )
}

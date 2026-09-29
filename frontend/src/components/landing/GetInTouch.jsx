import { useLayoutEffect, useRef } from 'react'
import RequestForm from '../RequestForm.jsx'
import { revealOnEnter } from '../../animations/landingScroll.js'

/**
 * Get-in-touch lead section — dark rounded card (echoes the reference mock's
 * dark card + dashed-field style, original implementation). Captures order
 * intent right below the flavour lineup, where desire is hottest.
 */
export default function GetInTouch({ animate, injectedFlavours, injectedCity, injectSignal }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = revealOnEnter(scope.current, { stagger: 0.12 })
    return cleanup
  }, [animate])

  return (
    <section ref={scope} id="get-in-touch" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-6 sm:px-6">
      <div data-reveal-group className="grid gap-10 rounded-[2rem] bg-ink p-7 text-cream sm:p-12 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <div data-reveal-item>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get in touch
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-cream/70">
            Want to stock Super drinks or order for an event? Drop your
            details — tell us which flavour, size, and quantity you need.
          </p>
          <ul className="mt-6 space-y-2 text-sm font-medium text-cream/70">
            <li>Phone: +91 00000 00000</li>
            <li>Email: hello@example.com</li>
          </ul>
          <p className="mt-8 border-t border-cream/15 pt-6 font-serif text-lg italic text-cream/80">
            Thank you for considering Super Foods &amp; Beverages.
          </p>
        </div>
        <div data-reveal-item>
          <RequestForm
            theme="dark"
            injectedFlavours={injectedFlavours}
            injectedCity={injectedCity}
            injectSignal={injectSignal}
          />
        </div>
      </div>
    </section>
  )
}

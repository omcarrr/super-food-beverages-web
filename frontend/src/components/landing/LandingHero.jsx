import { useLayoutEffect, useRef } from 'react'
import BottleIllustration from '../BottleIllustration.jsx'
import { playHeroIntro } from '../../animations/landingScroll.js'
import { scrollToSection } from '../../utils/scroll.js'

export default function LandingHero({ animate }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!animate) return
    const cleanup = playHeroIntro(scope.current)
    return cleanup
  }, [animate])

  return (
    <section ref={scope} id="home" className="relative scroll-mt-20 overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:gap-6 lg:pb-24">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <p
            data-hero-item
            className="text-sm font-bold uppercase tracking-widest text-ink-soft"
          >
            Super Foods &amp; Beverages
          </p>
          <h1
            data-hero-item
            className="mt-3 text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            Refreshment, the way India likes it.
          </h1>
          <p data-hero-item className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0">
            Har Boond Mein Taazgi — freshness, in every drop.
          </p>
          <div
            data-hero-item
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <button
              type="button"
              onClick={() => scrollToSection('flavours')}
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream shadow-[0_12px_28px_rgba(33,25,21,0.28)] transition-transform hover:-translate-y-0.5"
            >
              See the flavours
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('lineup')}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-[0_12px_28px_rgba(33,25,21,0.12)] transition-transform hover:-translate-y-0.5"
            >
              Explore all flavours
            </button>
          </div>
        </div>

        {/* Hero bottle — neutral cola tone, gentle idle float */}
        <div data-hero-bottle className="relative mx-auto w-fit">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-0 scale-110 rounded-full bg-ink/10 blur-3xl"
          />
          <div data-hero-float className="relative will-change-transform">
            <BottleIllustration
              color="#2A1810"
              label="Super Cola"
              className="h-72 w-auto drop-shadow-[0_28px_36px_rgba(33,25,21,0.30)] sm:h-96"
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="flex justify-center pb-8" aria-hidden="true">
        <div
          data-hero-chevron={animate ? true : undefined}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-[0_10px_24px_rgba(33,25,21,0.12)]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 7l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

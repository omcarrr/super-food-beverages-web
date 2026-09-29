import { useLayoutEffect, useRef } from 'react'
import BottleIllustration from '../BottleIllustration.jsx'
import { flavours, textOn } from '../../data/flavours.js'
import { createPinnedShowcase } from '../../animations/landingScroll.js'

/**
 * Desktop/tablet pinned scroll showcase. All 8 steps are stacked
 * absolutely-positioned layers driven by one scrubbed timeline (see
 * animations/landingScroll.js). `id="flavours"` anchors the hero CTA.
 */
export default function PinnedShowcase() {
  const wrap = useRef(null)
  const layers = useRef([])
  const bottles = useRef([])
  const texts = useRef([])
  const dots = useRef([])
  const bar = useRef(null)

  useLayoutEffect(() => {
    const cleanup = createPinnedShowcase(
      {
        wrap: wrap.current,
        layers: layers.current,
        bottles: bottles.current,
        texts: texts.current,
        dots: dots.current,
        bar: bar.current,
      },
      flavours.length,
    )
    return cleanup
  }, [])

  return (
    <section ref={wrap} id="flavours" className="relative overflow-hidden">
      {/* Crossfading brand-color background layers */}
      <div className="absolute inset-0" aria-hidden="true">
        {flavours.map((f, i) => (
          <div
            key={f.slug}
            ref={(el) => {
              layers.current[i] = el
            }}
            className="absolute inset-0 will-change-opacity"
            style={{ backgroundColor: f.color }}
          />
        ))}
      </div>

      {/* Pinned viewport */}
      <div className="relative flex h-screen flex-col items-center justify-center px-4 sm:px-6">
        <div className="grid w-full max-w-5xl items-center gap-6 md:grid-cols-2 md:gap-10">
          {/* Bottle stage */}
          <div className="relative mx-auto grid h-72 w-full max-w-xs place-items-center sm:h-96">
            {flavours.map((f, i) => (
              <div
                key={f.slug}
                ref={(el) => {
                  bottles.current[i] = el
                }}
                className="col-start-1 row-start-1 will-change-transform"
              >
                <BottleIllustration
                  color={f.color}
                  label={f.name}
                  className="h-64 w-auto drop-shadow-[0_28px_36px_rgba(0,0,0,0.30)] sm:h-80"
                />
              </div>
            ))}
          </div>

          {/* Copy stage */}
          <div className="relative grid min-h-44 text-center md:min-h-56 md:text-left">
            {flavours.map((f, i) => {
              const fg = textOn(f.color)
              return (
                <div
                  key={f.slug}
                  ref={(el) => {
                    texts.current[i] = el
                  }}
                  className="col-start-1 row-start-1 will-change-transform"
                  style={{ color: fg }}
                >
                  <p className="text-sm font-bold uppercase tracking-widest opacity-70">
                    {String(i + 1).padStart(2, '0')} / {String(flavours.length).padStart(2, '0')}
                    {' · '}
                    {f.collection === 'classic' ? 'Classic Favourite' : 'Exotic & Regional'}
                  </p>
                  <h2 className="mt-2 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
                    {f.name}
                  </h2>
                  <p className="mx-auto mt-3 max-w-sm text-base font-medium leading-relaxed opacity-85 sm:text-lg md:mx-0">
                    {f.tagline}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress: dots + thin bar */}
        <div className="absolute bottom-8 left-1/2 w-full max-w-md -translate-x-1/2 px-6">
          <div className="flex items-center justify-center gap-2.5" aria-hidden="true">
            {flavours.map((f, i) => (
              <span
                key={f.slug}
                ref={(el) => {
                  dots.current[i] = el
                }}
                className="h-2.5 w-2.5 rounded-full bg-white will-change-transform"
              />
            ))}
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/25" aria-hidden="true">
            <div ref={bar} className="h-full w-full rounded-full bg-white" />
          </div>
          <p className="sr-only">Scrolling showcase of all 8 flavours</p>
        </div>
      </div>
    </section>
  )
}

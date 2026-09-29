import gsap from 'gsap'

/**
 * landingScroll.js — all GSAP ScrollTrigger timeline logic for the landing
 * page (PLAN.md M2, ARCHITECTURE.md §3). Landing.jsx (and its section
 * components) own the markup and pass DOM nodes in; this module owns only
 * animation setup. Every function returns a cleanup callback that kills its
 * tweens/triggers — call it from the effect return so hot-reload and route
 * changes never leak duplicate triggers.
 *
 * Nothing in here touches reduced-motion policy: components simply don't
 * call these setups when `prefers-reduced-motion` is set, and render a
 * static fallback layout instead.
 */

/** Hero mount intro: copy staggers up, bottle settles in, idle loops start. */
export function playHeroIntro(scope) {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('[data-hero-item]', {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
    }).from(
      '[data-hero-bottle]',
      { y: 36, autoAlpha: 0, scale: 0.94, duration: 1.1 },
      '-=0.6',
    )
    // Barely-there idle float — premium products don't jiggle.
    gsap.to('[data-hero-float]', {
      y: -10,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
    // Soft scroll-cue pulse.
    gsap.to('[data-hero-chevron]', {
      y: 8,
      autoAlpha: 0.35,
      duration: 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, scope)
  return () => ctx.revert()
}

/**
 * Pinned flavour sequence (desktop/tablet).
 *
 * One scrubbed timeline drives everything so the whole section feels like a
 * single continuous gesture:
 * - Background: stacked full-bleed color layers crossfade via opacity
 *   (chosen over background-color tweens — opacity crossfades never pass
 *   through muddy intermediate mixes and only composite layers, no repaints).
 * - Bottles/texts: stacked absolutely-positioned steps; each transition
 *   animates the outgoing step up-and-out while the incoming step rises from
 *   below (consistent direction, scale + slight rotation + fade).
 * - Progress: 8 dots (white, opacity/scale only — legible on every brand
 *   color) plus a thin bar tweened across the full timeline length.
 *
 * Pin distance: ~1 viewport-height of scroll per flavour step
 * (`stepCount * window.innerHeight`), so each flavour gets comfortable
 * reading time without dragging.
 */
export function createPinnedShowcase(nodes, stepCount) {
  const { wrap, layers, bottles, texts, dots, bar } = nodes
  const ctx = gsap.context(() => {
    // Resting states (step 0 visible).
    gsap.set(layers, { autoAlpha: 0 })
    gsap.set(layers[0], { autoAlpha: 1 })
    gsap.set(bottles, { autoAlpha: 0, y: 90, scale: 0.86, rotation: 5 })
    gsap.set(bottles[0], { autoAlpha: 1, y: 0, scale: 1, rotation: 0 })
    gsap.set(texts, { autoAlpha: 0, y: 34 })
    gsap.set(texts[0], { autoAlpha: 1, y: 0 })
    gsap.set(dots, { scale: 0.8, opacity: 0.35 })
    gsap.set(dots[0], { scale: 1.2, opacity: 1 })
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => `+=${window.innerHeight * stepCount}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Progress bar spans the whole journey (linear — it mirrors scroll).
    tl.to(bar, { scaleX: 1, ease: 'none', duration: stepCount }, 0)

    // One transition segment per step boundary; each target is tweened
    // exactly once per direction so scrubbing back and forth stays exact.
    for (let i = 1; i < stepCount; i++) {
      const pos = i
      tl.to(
        bottles[i - 1],
        { autoAlpha: 0, y: -90, scale: 0.92, rotation: -4, duration: 0.7 },
        pos,
      )
      tl.fromTo(
        bottles[i],
        { autoAlpha: 0, y: 90, scale: 0.86, rotation: 5 },
        { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.7 },
        pos,
      )
      tl.to(layers[i], { autoAlpha: 1, duration: 0.7 }, pos)
      tl.to(texts[i - 1], { autoAlpha: 0, y: -26, duration: 0.5 }, pos)
      tl.fromTo(
        texts[i],
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        pos + 0.12,
      )
      tl.to(dots[i - 1], { scale: 0.8, opacity: 0.35, duration: 0.4 }, pos)
      tl.to(dots[i], { scale: 1.2, opacity: 1, duration: 0.4 }, pos)
    }
  }, wrap)
  return () => ctx.revert()
}

/**
 * Lightweight fade/slide-in for below-the-fold sections (swatches, quality
 * cards, sizes). Uses `toggleActions: 'play none none reverse'` — plays once
 * on enter, reverses if scrolled back past — never pinned or scrubbed, so
 * these sections stay calm and cheap.
 *
 * Markup contract: one or more `[data-reveal-group]` containers; each
 * animates its `[data-reveal-item]` children with a stagger (or itself if
 * it has no item children).
 */
export function revealOnEnter(scope, options = {}) {
  const { stagger = 0.1, y = 28, start = 'top 85%' } = options
  const ctx = gsap.context(() => {
    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]')
      gsap.from(items.length ? items : group, {
        y,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger,
        scrollTrigger: {
          trigger: group,
          start,
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, scope)
  return () => ctx.revert()
}

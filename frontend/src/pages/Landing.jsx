import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToSection } from '../utils/scroll.js'
import LandingHero from '../components/landing/LandingHero.jsx'
import PinnedShowcase from '../components/landing/PinnedShowcase.jsx'
import StackedShowcase from '../components/landing/StackedShowcase.jsx'
import SwatchStrip from '../components/landing/SwatchStrip.jsx'
import HomeFlavours from '../components/landing/HomeFlavours.jsx'
import GetInTouch from '../components/landing/GetInTouch.jsx'
import QualityStrip from '../components/landing/QualityStrip.jsx'
import SizesTeaser from '../components/landing/SizesTeaser.jsx'
import HomeAbout from '../components/landing/HomeAbout.jsx'
import HomeFindStore from '../components/landing/HomeFindStore.jsx'
import FinalCta from '../components/landing/FinalCta.jsx'

function currentMode() {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'reduced'
  }
  return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'
}

/**
 * Landing (/) — long-scroll animated flavour showcase (PLAN.md M2).
 * Animation logic lives in `src/animations/landingScroll.js`; this file only
 * composes sections and picks the experience tier:
 * - desktop/tablet → full pinned + scrubbed sequence
 * - mobile → stacked color-blocked sections with light reveals (no pin)
 * - reduced-motion → fully static content, no GSAP setup at all
 */
export default function Landing() {
  const [mode, setMode] = useState(currentMode)
  const animated = mode !== 'reduced'

  // Lead intent collected from flavour cards / the store locator and fed
  // into the Get in Touch form (no page navigation). `n` bumps on every
  // new intent so the form merges it in.
  const [lead, setLead] = useState({ flavours: [], city: '', n: 0 })

  const requestFlavours = (slugs) => {
    setLead((l) => ({
      city: l.city,
      flavours: [...new Set([...l.flavours, ...slugs])],
      n: l.n + 1,
    }))
    scrollToSection('get-in-touch')
  }

  const requestSupplyIn = (city) => {
    setLead((l) => ({ flavours: l.flavours, city: l.city || city, n: l.n + 1 }))
    scrollToSection('get-in-touch')
  }

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMode(currentMode())
    mqMobile.addEventListener('change', update)
    mqReduce.addEventListener('change', update)
    return () => {
      mqMobile.removeEventListener('change', update)
      mqReduce.removeEventListener('change', update)
    }
  }, [])

  // Re-measure pin distances once webfonts settle (layout shifts otherwise).
  useEffect(() => {
    if (!animated || mode !== 'desktop' || !document.fonts) return
    let alive = true
    document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh()
    })
    return () => {
      alive = false
    }
  }, [animated, mode])

  // Deep links (e.g. /#about after navbar navigation from another page).
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const t = setTimeout(() => scrollToSection(hash), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main>
      <LandingHero animate={animated} />

      {mode === 'desktop' ? (
        <PinnedShowcase key="pinned" />
      ) : (
        <StackedShowcase
          key="stacked"
          animated={animated}
          onRequestFlavour={(slug) => requestFlavours([slug])}
        />
      )}

      <SwatchStrip animate={animated} />
      <HomeFlavours
        animate={animated}
        onRequestFlavour={(slug) => requestFlavours([slug])}
      />
      <GetInTouch
        animate={animated}
        injectedFlavours={lead.flavours}
        injectedCity={lead.city}
        injectSignal={lead.n}
      />
      <SizesTeaser animate={animated} />
      <HomeAbout animate={animated} />
      <HomeFindStore animate={animated} onRequestSupply={requestSupplyIn} />
      <QualityStrip animate={animated} />
      <FinalCta />
    </main>
  )
}

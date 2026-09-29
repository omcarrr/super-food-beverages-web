import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const HUB_R = 62
const NODE_R = 210
const LABEL_R = 262
const SIZE = 640
const C = SIZE / 2
const HUB_FILL = '#2E6B34'

const polar = (radius, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: C + radius * Math.cos(rad), y: C + radius * Math.sin(rad) }
}

/**
 * DistributionMap — original hub-and-spoke diagram of the cities served.
 * Center hub node, one spoke per city from `distributionCities`, labels
 * arranged radially. Self-contained GSAP draw-in (skipped for reduced
 * motion); parent owns selection state.
 */
export default function DistributionMap({ cities, selected, onSelect }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hub]', { scale: 0, transformOrigin: 'center', duration: 0.7, ease: 'power2.out' })
      gsap.from('[data-spoke]', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.25,
      })
      gsap.from('[data-node]', {
        scale: 0,
        transformOrigin: 'center',
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.35,
      })
      gsap.from('[data-city-label]', {
        opacity: 0,
        y: 8,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.06,
        delay: 0.5,
      })
    }, scope.current)
    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={scope}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="group"
      aria-label="Map of cities served, arranged around the distribution hub"
      className="h-auto w-full"
    >
      {/* spokes */}
      {cities.map((city, i) => {
        const p = polar(NODE_R, (i * 360) / cities.length)
        const active = selected === city
        return (
          <line
            key={`spoke-${city}`}
            data-spoke
            x1={C}
            y1={C}
            x2={p.x}
            y2={p.y}
            stroke={active ? HUB_FILL : '#211915'}
            strokeOpacity={active ? 0.9 : 0.18}
            strokeWidth={active ? 3 : 1.5}
          />
        )
      })}

      {/* hub */}
      <g data-hub style={{ transformBox: 'fill-box' }}>
        <circle cx={C} cy={C} r={HUB_R} fill={HUB_FILL} />
        <text x={C} y={C - 6} textAnchor="middle" fontSize="19" fontWeight="800" fill="#FFF8EC"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
          Distribution
        </text>
        <text x={C} y={C + 18} textAnchor="middle" fontSize="19" fontWeight="800" fill="#FFF8EC"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
          Hub
        </text>
      </g>

      {/* city nodes + labels */}
      {cities.map((city, i) => {
        const deg = (i * 360) / cities.length
        const p = polar(NODE_R, deg)
        const l = polar(LABEL_R, deg)
        const active = selected === city
        const anchor = l.x > C + 24 ? 'start' : l.x < C - 24 ? 'end' : 'middle'
        return (
          <g
            key={city}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`Show ${city}`}
            onClick={() => onSelect(city)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(city)
              }
            }}
            className="cursor-pointer outline-none"
          >
            <circle
              data-node
              cx={p.x}
              cy={p.y}
              r={active ? 12 : 8}
              fill={active ? HUB_FILL : '#211915'}
              opacity={active ? 1 : 0.75}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            {active && (
              <circle cx={p.x} cy={p.y} r={20} fill="none" stroke={HUB_FILL} strokeWidth="2" opacity="0.45" />
            )}
            <text
              data-city-label
              x={l.x}
              y={l.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={active ? 18 : 16}
              fontWeight={active ? 800 : 600}
              fill="#211915"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            >
              {city}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

import { useState } from 'react'
import DistributionMap from './DistributionMap.jsx'
import { distributionCities } from '../data/flavours.js'

/**
 * StoreLocator — interactive core shared by the home Find Store section and
 * the standalone /find-store page: hub-and-spoke map + selected-city panel
 * + city pills. Owns its selection state. `onRequestSupply(city)` routes
 * the city into the Get in Touch form instead of a separate page.
 */
export default function StoreLocator({ onRequestSupply }) {
  const [selected, setSelected] = useState(distributionCities[0])

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Map */}
      <div className="rounded-[2rem] bg-white p-4 shadow-[0_16px_36px_rgba(33,25,21,0.08)] sm:p-8">
        <DistributionMap
          cities={distributionCities}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {/* City panel */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-[2rem] bg-ink p-7 text-cream sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-cream/60">
            Selected city
          </p>
          <h3 className="mt-1 text-3xl font-extrabold tracking-tight">{selected}</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Super drinks move through local distributors here. Exact stockist
            addresses are confirmed when you request — tell us what you need
            and we&apos;ll connect you.
          </p>
          <button
            type="button"
            onClick={() => onRequestSupply?.(selected)}
            className="mt-6 inline-block w-full rounded-full bg-cream px-6 py-3.5 text-center text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            Request supply in {selected}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose a city">
          {distributionCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelected(city)}
              aria-pressed={selected === city}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                selected === city
                  ? 'bg-ink text-cream'
                  : 'bg-white text-ink shadow-[0_6px_16px_rgba(33,25,21,0.08)] hover:bg-cream-dark'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

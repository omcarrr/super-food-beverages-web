import { useEffect, useState } from 'react'
import BottleIllustration from './BottleIllustration.jsx'
import { textOn } from '../data/flavours.js'

/**
 * FlavourQtyModal — popup for one flavour, themed in the flavour's own
 * brand color (card = brand color, text = the higher-contrast neutral,
 * same pairing as the FlavourCard reveal panel).
 */
export default function FlavourQtyModal({ flavour, initialQty, onConfirm, onClose }) {
  const [qty, setQty] = useState(Math.max(1, initialQty || 1))
  const inOrder = (initialQty || 0) > 0
  const fg = textOn(flavour.color)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${flavour.name} quantity`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-sm rounded-[2rem] p-7 text-center shadow-2xl sm:p-8"
        style={{ backgroundColor: flavour.color, color: fg }}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-lg font-bold opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
        <div className="mx-auto -mt-4 w-fit">
          <BottleIllustration
            color={flavour.color}
            label={flavour.name}
            className="h-44 w-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.30)]"
          />
        </div>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{flavour.name}</h3>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed opacity-80">
          {flavour.description}
        </p>

        {/* stepper */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{ backgroundColor: `${fg}26`, color: fg }}
            className="grid h-11 w-11 place-items-center rounded-full text-xl font-extrabold"
          >
            −
          </button>
          <span aria-live="polite" className="min-w-16 text-center text-3xl font-extrabold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            style={{ backgroundColor: `${fg}26`, color: fg }}
            className="grid h-11 w-11 place-items-center rounded-full text-xl font-extrabold"
          >
            +
          </button>
        </div>
        <p className="mt-1 text-xs font-semibold opacity-70">
          bottles
        </p>

        <button
          type="button"
          onClick={() => onConfirm(qty)}
          style={{ backgroundColor: fg, color: flavour.color }}
          className="mt-5 w-full rounded-full py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5"
        >
          {inOrder ? `Update — ${qty} bottle${qty === 1 ? '' : 's'}` : `Add — ${qty} bottle${qty === 1 ? '' : 's'}`}
        </button>
        {inOrder && (
          <button
            type="button"
            onClick={() => onConfirm(0)}
            className="mt-2 w-full rounded-full py-3 text-sm font-bold opacity-80 hover:underline"
          >
            Remove from request
          </button>
        )}
      </div>
    </div>
  )
}

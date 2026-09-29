import { useState } from 'react'
import client from '../api/client.js'
import { flavours, sizes } from '../data/flavours.js'
import FlavourQtyModal from './FlavourQtyModal.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SIZES = sizes.map((s) => s.value)
const KNOWN = new Set(flavours.map((f) => f.slug))
const bySlug = (slug) => flavours.find((f) => f.slug === slug)

function validate(v, orderLine) {
  const errors = {}
  if (!v.name.trim() || v.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Please enter a valid email.'
  if ((v.phone.replace(/\D/g, '').length) < 7) errors.phone = 'Please enter a valid phone number.'
  if (v.flavours.length === 0) errors.flavours = 'Please pick at least one flavour.'
  else if (!v.flavours.every((i) => KNOWN.has(i.slug) && Number.isInteger(i.qty) && i.qty >= 1)) {
    errors.flavours = 'Please set a valid quantity for each flavour.'
  }
  if (!SIZES.includes(v.size)) errors.size = 'Please pick a size.'
  if ((orderLine + v.message.trim()).length > 500) {
    errors.message = 'Order note is too long — please shorten it.'
  }
  return errors
}

/**
 * RequestForm — order-interest / stockist lead form (ARCHITECTURE.md,
 * API.md `POST /api/requests`). Each flavour carries its own bottle
 * quantity, set through the FlavourQtyModal popup; pills show the qty badge.
 *
 * The v1 API takes one `quantity` + one `size` per request, so the form
 * submits the slugs array, the total bottle count, the shared size, and an
 * itemized per-flavour breakdown folded into the message for the owner.
 * (A future API can accept true line-items — the UI already models them.)
 *
 * `injectedFlavours` / `injectedCity` + `injectSignal`: when the signal
 * bumps (flavour card / store locator click), new flavours merge in and the
 * popup opens for the latest one — without wiping what the user typed.
 */
export default function RequestForm({
  theme = 'light',
  injectedFlavours = [],
  injectedCity = '',
  injectSignal = 0,
}) {
  const dark = theme === 'dark'
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    flavours: [], // [{ slug, qty }]
    size: '',
    city: '',
    message: '',
    website: '', // honeypot — must stay empty
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [lastSignal, setLastSignal] = useState(0)
  const [popupSlug, setPopupSlug] = useState(null)

  // Render-phase merge of externally injected intent (documented "adjust
  // state when props change" pattern — settles after one extra render).
  if (injectSignal !== 0 && injectSignal !== lastSignal) {
    setLastSignal(injectSignal)
    setValues((v) => {
      const have = new Set(v.flavours.map((i) => i.slug))
      const merged = [
        ...v.flavours,
        ...injectedFlavours.filter((s) => KNOWN.has(s) && !have.has(s)).map((slug) => ({ slug, qty: 1 })),
      ]
      const city = v.city || injectedCity
      if (merged.length === v.flavours.length && city === v.city) return v
      return { ...v, flavours: merged, city }
    })
    const latest = injectedFlavours[injectedFlavours.length - 1]
    if (latest && KNOWN.has(latest)) setPopupSlug(latest)
  }

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const confirmQty = (slug, qty) => {
    setValues((v) => ({
      ...v,
      flavours:
        qty <= 0
          ? v.flavours.filter((i) => i.slug !== slug)
          : v.flavours.some((i) => i.slug === slug)
            ? v.flavours.map((i) => (i.slug === slug ? { ...i, qty } : i))
            : [...v.flavours, { slug, qty }],
    }))
    setErrors((prev) => ({ ...prev, flavours: undefined }))
    setPopupSlug(null)
  }

  const total = values.flavours.reduce((n, i) => n + i.qty, 0)
  const orderLine =
    values.flavours.length === 0
      ? ''
      : `Order: ${values.flavours.map((i) => `${bySlug(i.slug)?.name ?? i.slug} × ${i.qty}`).join(', ')}${values.size ? ` (Size ${values.size})` : ''}. `

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values, orderLine)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setStatus('sending')
    try {
      await client.post('/api/requests', {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        flavours: values.flavours.map((i) => i.slug),
        size: values.size,
        quantity: total,
        city: values.city.trim(),
        message: (orderLine + values.message.trim()).slice(0, 500),
        website: values.website, // honeypot
      })
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const popupFlavour = popupSlug ? bySlug(popupSlug) : null
  const popupQty = values.flavours.find((i) => i.slug === popupSlug)?.qty ?? 1

  if (status === 'sent') {
    return (
      <div className={`rounded-3xl p-8 text-center ${dark ? 'bg-cream/10' : 'bg-white shadow-[0_16px_36px_rgba(33,25,21,0.08)]'}`}>
        <span
          aria-hidden="true"
          className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl font-extrabold ${dark ? 'bg-cream text-ink' : 'bg-ink text-cream'}`}
        >
          ✓
        </span>
        <h3 className={`mt-4 text-2xl font-extrabold tracking-tight ${dark ? 'text-cream' : 'text-ink'}`}>
          Request received
        </h3>
        <p className={`mx-auto mt-2 max-w-sm text-sm leading-relaxed ${dark ? 'text-cream/70' : 'text-ink-soft'}`}>
          Thanks {values.name.trim()} — we&apos;ve noted {total} bottle{total === 1 ? '' : 's'}
          ({orderLine.trim()}). We&apos;ll call you back shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({ name: '', email: '', phone: '', flavours: [], size: '', city: '', message: '', website: '' })
            setStatus('idle')
          }}
          className={`mt-6 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${dark ? 'bg-cream text-ink' : 'bg-ink text-cream'}`}
        >
          Make another request
        </button>
      </div>
    )
  }

  const labelCls = `block text-xs font-bold uppercase tracking-widest ${dark ? 'text-cream/60' : 'text-ink-soft'}`
  const inputCls = dark
    ? 'mt-1.5 w-full border-b border-dashed border-cream/30 bg-transparent pb-2.5 text-base font-semibold text-cream placeholder:text-cream/35 focus:border-cream focus:outline-none'
    : 'mt-1.5 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-base font-medium text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none'
  const errCls = `mt-1 text-xs font-semibold ${dark ? 'text-red-300' : 'text-red-700'}`
  const flavourPill = (on) =>
    dark
      ? `rounded-full border px-4 py-2 text-sm font-bold transition-colors ${on ? 'border-cream bg-cream text-ink' : 'border-cream/30 text-cream/70 hover:border-cream/60'}`
      : `rounded-full border px-4 py-2 text-sm font-bold transition-colors ${on ? 'border-ink bg-ink text-cream' : 'border-ink/15 text-ink hover:border-ink/40'}`

  const field = (name, label, node) => (
    <div>
      <label htmlFor={`req-${name}`} className={labelCls}>{label}</label>
      {node}
      {errors[name] && <p className={errCls}>{errors[name]}</p>}
    </div>
  )

  return (
    <>
      <form onSubmit={onSubmit} noValidate aria-label="Request flavours">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {field('name', 'Name', (
            <input id="req-name" type="text" autoComplete="name" placeholder="Your full name"
              value={values.name} onChange={set('name')} className={inputCls} />
          ))}
          {field('phone', 'Phone', (
            <input id="req-phone" type="tel" autoComplete="tel" placeholder="+91 …"
              value={values.phone} onChange={set('phone')} className={inputCls} />
          ))}
          {field('email', 'Email', (
            <input id="req-email" type="email" autoComplete="email" placeholder="you@example.com"
              value={values.email} onChange={set('email')} className={inputCls} />
          ))}
          {field('city', 'City', (
            <input id="req-city" type="text" autoComplete="address-level2" placeholder="Your city"
              value={values.city} onChange={set('city')} className={inputCls} />
          ))}
          <div className="sm:col-span-2">
            <span className={labelCls}>Flavours — tap one to set bottles</span>
            <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Flavours">
              {flavours.map((f) => {
                const line = values.flavours.find((i) => i.slug === f.slug)
                return (
                  <button
                    key={f.slug}
                    type="button"
                    aria-pressed={!!line}
                    onClick={() => setPopupSlug(f.slug)}
                    className={flavourPill(!!line)}
                  >
                    {f.name}
                    {line && (
                      <span className={`ml-1.5 rounded-full px-1.5 tabular-nums ${dark ? 'bg-ink/15' : 'bg-cream/25'}`}>
                        × {line.qty}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {errors.flavours && <p className={errCls}>{errors.flavours}</p>}
            {total > 0 && (
              <p className={`mt-2 text-sm font-bold ${dark ? 'text-cream/80' : 'text-ink'}`}>
                Total: {total} bottle{total === 1 ? '' : 's'}{values.size ? ` · ${values.size}` : ''}
              </p>
            )}
          </div>
          {field('size', 'Size — one size for the whole order', (
            <select id="req-size" value={values.size} onChange={set('size')}
              className={`${inputCls} ${dark ? '[&>option]:text-ink' : ''}`}>
              <option value="">Size…</option>
              {sizes.map((s) => (
                <option key={s.value} value={s.value}>{s.value} — {s.label}</option>
              ))}
            </select>
          ))}
          <div className="sm:col-span-2">
            {field('message', 'Message (optional)', (
              <textarea id="req-message" rows="3" maxLength="500" placeholder="Anything we should know?"
                value={values.message} onChange={set('message')} className={`${inputCls} resize-none`} />
            ))}
          </div>
        </div>

        {/* Honeypot — invisible to humans, must stay empty (API.md). */}
        <input
          type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true"
          value={values.website} onChange={set('website')}
          className="absolute h-0 w-0 opacity-0"
        />

        {status === 'failed' && (
          <div className={`mt-5 rounded-2xl p-4 text-sm font-medium ${dark ? 'bg-red-400/15 text-red-200' : 'bg-red-50 text-red-800'}`}>
            Couldn&apos;t send your request right now. Please try again — or reach us
            directly at <a href="tel:+910000000000" className="font-bold underline">+91 00000 00000</a> /{' '}
            <a href="mailto:hello@example.com" className="font-bold underline">hello@example.com</a>.
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className={`mt-6 w-full rounded-full py-4 text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:px-10 ${dark ? 'bg-cream text-ink' : 'bg-ink text-cream shadow-[0_12px_28px_rgba(33,25,21,0.28)]'}`}
        >
          {status === 'sending' ? 'Sending…' : total > 0 ? `Send request — ${total} bottle${total === 1 ? '' : 's'}` : 'Send request'}
        </button>
      </form>

      {popupFlavour && (
        <FlavourQtyModal
          key={popupFlavour.slug}
          flavour={popupFlavour}
          initialQty={popupQty}
          onConfirm={(qty) => confirmQty(popupFlavour.slug, qty)}
          onClose={() => setPopupSlug(null)}
        />
      )}
    </>
  )
}

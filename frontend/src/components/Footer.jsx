import { scrollToSection } from '../utils/scroll.js'

const EXPLORE = [
  { id: 'home', label: 'Home' },
  { id: 'flavours', label: 'All flavours' },
  { id: 'find-store', label: 'Find store' },
  { id: 'lineup', label: 'Pick your favourite' },
  { id: 'about', label: 'Our story' },
  { id: 'get-in-touch', label: 'Request a flavour' },
]

export default function Footer() {
  return (
    <footer className="mt-auto rounded-t-[2rem] bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-2xl bg-cream text-lg font-extrabold text-ink"
            >
              S
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight">
                SUPER
              </span>
              <span className="block text-[11px] font-semibold tracking-wide opacity-70">
                Foods &amp; Beverages
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-70">
            Har Boond Mein Taazgi — eight bold soft-drink flavours, made for
            every Indian table.
          </p>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm font-semibold">
            {EXPLORE.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(l.id)}
                  className="opacity-80 transition-opacity hover:opacity-100"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact (placeholders until client provides real data — PLAN.md §9) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">
            Reach us
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm font-medium opacity-80">
            <li>Phone: +91 00000 00000</li>
            <li>Email: hello@example.com</li>
            <li>Head office: Address TBD</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Super Foods &amp; Beverages. All rights reserved.</p>
          <p>Har Boond Mein Taazgi</p>
        </div>
      </div>
    </footer>
  )
}

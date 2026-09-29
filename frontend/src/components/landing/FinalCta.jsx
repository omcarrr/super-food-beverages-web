import { scrollToSection } from '../../utils/scroll.js'

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6">
      <div className="rounded-[2rem] bg-ink px-6 py-14 text-center text-cream sm:px-12 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Want to stock or order Super drinks?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed opacity-70">
          Tell us which flavours and sizes you need — we&apos;ll call you back
          to arrange it.
        </p>
        <button
          type="button"
          onClick={() => scrollToSection('get-in-touch')}
          className="mt-8 inline-block rounded-full bg-cream px-8 py-4 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5"
        >
          Request flavours
        </button>
      </div>
    </section>
  )
}

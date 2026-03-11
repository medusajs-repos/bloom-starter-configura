import { Link, useParams } from "@tanstack/react-router"

export default function Inspiration() {
  const { countryCode } = useParams({ from: "/$countryCode/inspiration" })

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/generated-01KK9NDCEVMGKAHM8BKMNR5G9G-01KK9NDCEVGK1C4DBA22GW66R1.jpeg"
          alt="Executive office workspace"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="mb-4 text-sm font-medium tracking-[0.2em] uppercase text-white/70">
            Our Philosophy
          </p>
          <h1 className="mb-6 text-5xl font-light tracking-wide text-white md:text-6xl lg:text-7xl">
            Designed for <br className="hidden md:block" />Performance
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/80 font-light">
            Every chair we build begins with a single question: what does the
            person sitting here truly need to do their best work?
          </p>
        </div>
      </div>

      {/* Brand Values */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-1 md:grid-cols-3">
          <div className="border-t border-neutral-200 pt-8 pr-8">
            <span className="mb-5 block text-xs font-medium tracking-[0.2em] uppercase text-neutral-400">
              01
            </span>
            <h3 className="mb-4 text-2xl font-light">Ergonomic Precision</h3>
            <p className="text-neutral-600 leading-relaxed">
              Engineered with the human body in mind. Adjustable lumbar support,
              multi-axis armrests, and dynamic recline mechanics that adapt to
              how you work.
            </p>
          </div>
          <div className="border-t border-neutral-200 pt-8 pr-8 md:pl-8">
            <span className="mb-5 block text-xs font-medium tracking-[0.2em] uppercase text-neutral-400">
              02
            </span>
            <h3 className="mb-4 text-2xl font-light">Premium Materials</h3>
            <p className="text-neutral-600 leading-relaxed">
              Full-grain leathers sourced from European tanneries. High-density
              memory foam. Polished aluminium and chrome alloys built for
              decades, not years.
            </p>
          </div>
          <div className="border-t border-neutral-200 pt-8 md:pl-8">
            <span className="mb-5 block text-xs font-medium tracking-[0.2em] uppercase text-neutral-400">
              03
            </span>
            <h3 className="mb-4 text-2xl font-light">Refined Aesthetics</h3>
            <p className="text-neutral-600 leading-relaxed">
              Furniture that elevates any office environment. Clean geometric
              forms with meticulous detailing — because the spaces we work in
              shape the work we do.
            </p>
          </div>
        </div>
      </div>

      {/* Split Image + Text */}
      <div className="grid md:grid-cols-2">
        <div className="relative h-[500px] md:h-auto">
          <img
            src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/generated-01KK9NDC1FHR4TGER8BWQ0PDEH-01KK9NDC1GYYFD3648TQPHTXFW.jpeg"
            alt="Premium leather executive chair detail"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center bg-neutral-950 px-10 py-16 md:px-16">
          <p className="mb-6 text-xs font-medium tracking-[0.2em] uppercase text-neutral-500">
            Craftsmanship
          </p>
          <h2 className="mb-6 text-3xl font-light leading-snug text-white md:text-4xl">
            Every stitch tells a story of precision
          </h2>
          <p className="mb-8 text-neutral-400 leading-relaxed">
            Our chairs are assembled by hand in facilities where quality control
            is not a checklist — it is a mindset. Each component is inspected,
            each seam reviewed, before a chair earns the right to carry our name.
          </p>
          <Link
            to="/$countryCode/configurator"
            params={{ countryCode }}
            className="inline-flex w-fit items-center gap-2 border border-white/30 px-6 py-3 text-sm tracking-wider uppercase text-white transition-colors hover:bg-white hover:text-black"
          >
            Configure Yours
          </Link>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid md:grid-cols-2">
        <div className="relative h-[450px]">
          <img
            src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/generated-01KK9NDG8ZQWYZBZ2M3FXCQ49C-01KK9NDG8ZHN95J6PQ1219V6HH.jpeg"
            alt="Chair engineering detail"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative h-[450px]">
          <img
            src="https://cdn.mignite.app/ws/works_01KHQX6EG3S3V9XTHBYPWQCEYQ/generated-01KK9NDERX6J6VA0PTZVJ5E7R5-01KK9NDERXYGCH6R1KG58JD01Q.jpeg"
            alt="Executive office environment"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Quote */}
      <div className="container mx-auto px-4 py-24 text-center">
        <blockquote className="mx-auto max-w-3xl">
          <p className="text-2xl font-light leading-relaxed text-neutral-800 md:text-3xl">
            "The chair you sit in for eight hours a day should be the least
            compromised object in your office. We built Configura to make that
            possible."
          </p>
          <footer className="mt-8 text-sm tracking-widest uppercase text-neutral-400">
            Configura Design Studio
          </footer>
        </blockquote>
      </div>

      {/* CTA Banner */}
      <div className="bg-neutral-950 py-20 text-center">
        <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase text-neutral-500">
          Ready to elevate your workspace?
        </p>
        <h2 className="mb-8 text-3xl font-light text-white md:text-4xl">
          Build your perfect chair
        </h2>
        <Link
          to="/$countryCode/configurator"
          params={{ countryCode }}
          className="inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium tracking-wider uppercase text-black transition-colors hover:bg-neutral-200"
        >
          Start Configuring
        </Link>
      </div>
    </div>
  )
}

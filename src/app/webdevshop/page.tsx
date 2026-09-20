import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "./ScrollReveal";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "WebDevShop — Websites that convert",
  description:
    "A boutique web development studio building fast, beautiful, high-converting websites for ambitious businesses.",
};

const services = [
  {
    icon: "🎨",
    title: "Web Design",
    description:
      "Custom, on-brand designs crafted in Figma and shipped pixel-perfect — no bloated templates.",
  },
  {
    icon: "⚙️",
    title: "Web Apps",
    description:
      "Full-stack applications built on modern frameworks, designed to scale with your business.",
  },
  {
    icon: "🛒",
    title: "E-commerce",
    description:
      "Conversion-focused storefronts with fast checkout, integrated payments, and inventory tooling.",
  },
  {
    icon: "🚀",
    title: "SEO & Performance",
    description:
      "Sub-second load times and technical SEO that gets you found — and keeps visitors around.",
  },
];

const whyChooseUs = [
  {
    icon: "⚡",
    title: "Fast turnaround",
    description: "Most projects ship in 4–6 weeks, not 4–6 months.",
  },
  {
    icon: "🤝",
    title: "Direct access",
    description: "You work with the engineers building your site — no account managers.",
  },
  {
    icon: "📈",
    title: "Built to grow",
    description: "Clean, documented code your next hire won't dread inheriting.",
  },
  {
    icon: "🛡️",
    title: "30-day guarantee",
    description: "Not happy at launch? We keep refining it until you are.",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$1,500",
    cadence: "one-time",
    description: "A polished, single-page site to get you online fast.",
    features: [
      "Up to 5 sections",
      "Mobile-first responsive design",
      "Basic SEO setup",
      "2 rounds of revisions",
      "2-week delivery",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4,900",
    cadence: "one-time",
    description: "A full multi-page site or web app with custom features.",
    features: [
      "Up to 10 pages",
      "Custom UI components",
      "CMS or admin dashboard",
      "Advanced SEO & analytics",
      "Unlimited revisions",
      "4-week delivery",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "contact us",
    description: "Complex platforms, integrations, and ongoing partnership.",
    features: [
      "Unlimited pages & features",
      "Third-party integrations",
      "Dedicated engineering pod",
      "SLA-backed support",
      "Ongoing optimization",
    ],
    highlighted: false,
  },
];

const testimonials = [
  {
    quote:
      "They rebuilt our site in three weeks and our conversion rate doubled within the first month. Genuinely the best agency we've worked with.",
    name: "Priya Nandan",
    role: "Founder, Loomstate Goods",
  },
  {
    quote:
      "Fast, communicative, and the code quality was a huge step up from our last dev shop. Our team can actually maintain it now.",
    name: "Marcus Webb",
    role: "Head of Product, Fenwick & Rye",
  },
  {
    quote:
      "WebDevShop understood our brand instantly. The new site paid for itself in the first quarter alone.",
    name: "Elena Torres",
    role: "CEO, Northbound Studio",
  },
];

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function WebDevShopPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-white">
            Web<span className="text-violet-400">Dev</span>Shop
          </span>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:inline"
            >
              ← LifeBuildr
            </Link>
            <a
              href="#contact"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/40"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(217,70,239,0.2),transparent_40%)]"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-violet-200 uppercase">
            Websites &amp; web apps for ambitious teams
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            We build websites that{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              turn visitors into customers
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            From landing pages to full-stack platforms, WebDevShop designs and
            engineers digital experiences that look premium and perform even
            better.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/40"
            >
              Get a Free Quote
            </a>
            <a
              href="#services"
              className="rounded-full border border-white/15 px-8 py-3.5 text-base font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5"
            >
              See what we do
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Everything you need to launch and grow
          </h2>
          <p className="mt-4 text-slate-400">
            One team, end-to-end — design, engineering, and performance,
            handled.
          </p>
        </ScrollReveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/40 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-violet-950/40">
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {service.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Why teams choose WebDevShop
            </h2>
            <p className="mt-4 text-slate-400">
              We move fast, communicate constantly, and build things that
              last.
            </p>
          </ScrollReveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-2xl">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-slate-400">
            Pick a starting point — every project is scoped to your goals.
          </p>
        </ScrollReveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition duration-300 hover:-translate-y-1.5 ${
                  tier.highlighted
                    ? "border-violet-400/50 bg-gradient-to-b from-violet-500/10 to-fuchsia-500/5 shadow-xl shadow-violet-950/40"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1 text-xs font-semibold text-white shadow-md">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">
                  {tier.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {tier.price}
                  </span>
                  <span className="text-sm text-slate-500">
                    {tier.cadence}
                  </span>
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="mt-0.5 text-violet-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 rounded-lg px-5 py-3 text-center text-sm font-semibold transition ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-xl hover:shadow-violet-900/40"
                      : "border border-white/15 text-slate-200 hover:border-white/30 hover:bg-white/5"
                  }`}
                >
                  Get started
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="border-y border-white/10 bg-white/[0.02]"
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Trusted by teams who care about craft
            </h2>
          </ScrollReveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <figure className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-violet-400/30">
                  <blockquote className="text-sm leading-relaxed text-slate-300">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.18),transparent_50%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to build something great?
            </h2>
            <p className="mt-4 max-w-md text-slate-400">
              Tell us about your project and we&apos;ll get back to you with a
              free, no-obligation quote within one business day.
            </p>
            <div className="mt-8 space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <span className="text-violet-400">✓</span> Free 30-minute
                strategy call
              </p>
              <p className="flex items-center gap-2">
                <span className="text-violet-400">✓</span> Fixed-price
                proposals, no surprises
              </p>
              <p className="flex items-center gap-2">
                <span className="text-violet-400">✓</span> Usually replies
                within a few hours
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <span className="text-base font-bold text-white">
              Web<span className="text-violet-400">Dev</span>Shop
            </span>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="transition hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} WebDevShop. All rights reserved.</p>
            <Link href="/dashboard" className="transition hover:text-white">
              ← Back to LifeBuildr
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// app/page.js
// CHANGED:
// - Keeps your hero + sections, but fixes the “jarring” feel by adding a consistent section rhythm
// - Adds subtle dividers between blocks so transitions feel intentional
// - Wraps the CONTACT area in the same <Section> system so it matches everything else
// - Adjusts spacing so "Work" doesn't feel like it floats in a void
// - Adds small optional “tone” wrappers so cards sit on a consistent backdrop (relies on Section wrapper styles you added)

import Container from "./components/ui/Container";
import Button from "./components/ui/Button";
import Section from "./components/ui/Section";
import CaseStudies from "./components/CaseStudies";
import Services from "./components/Services";
import ProofStrip from "./components/ProofStrip";
import Tooling from "./components/Tooling";

// Small helper divider (in case you want it even if Section showDivider=false somewhere)
function Divider({ className = "" }) {
  return <div className={`section-divider ${className}`} />;
}

function Hero() {
  return (
    <section className="pt-12 md:pt-16 pb-10 md:pb-14">
      <Container>
        <div className="surface p-7 md:p-12">
          <div className="accent-line" />

          <p className="mt-4 text-[11px] uppercase tracking-[0.26em] text-white/60">
            Independent studio • UK • product-led engineering
          </p>

          <h1 className="mt-4 max-w-3xl text-[34px] leading-[1.06] md:text-[56px] font-semibold text-white">
            We design and build platforms that ship — and keep running.
          </h1>

          <p className="mt-4 max-w-2xl text-[14px] md:text-[15px] leading-relaxed text-muted">
            SixByFive is a small studio building collector-first products, workflow portals,
            and the internal tooling that makes data and operations reliable.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#work" variant="primary">See work</Button>
            <Button href="#services" variant="secondary">Capabilities</Button>
            {/* <Button href="#contact" variant="ghost">Contact →</Button> */}
          </div>

          <ProofStrip />
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <Hero />

      {/* CHANGED: Explicit divider after hero to avoid “drop into void” */}
      <Divider />

      {/* WORK */}
      <Section
        id="work"
        eyebrow="Selected work"
        title="Products and portals in production"
        subtitle="A small set of shipped systems — presented as outcomes, not experiments."
        className="pt-8 md:pt-10"
        showDivider={false} // divider already added above for cleaner rhythm
      >
        <CaseStudies />
      </Section>

      {/* TOOLING */}
      <Section
        id="tooling"
        eyebrow="Tooling"
        title="The systems behind the systems"
        subtitle="Internal tooling that keeps data accurate, operations fast, and releases safe."
      >
        <Tooling />
      </Section>

      {/* SERVICES */}
      <Section
        id="services"
        eyebrow="Capabilities"
        title="What we deliver"
        subtitle="Clear scope buckets that make it easy to understand how we can help."
      >
        <Services />
      </Section>

      {/* PROCESS */}
      <Section
        id="process"
        eyebrow="Delivery"
        title="How we work"
        subtitle="Simple, structured, and designed to ship without chaos."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface p-5">
            <p className="text-[12px] font-semibold text-white">1) Define the milestone</p>
            <p className="mt-2 text-[13px] text-muted">
              Tight scope, clear acceptance criteria, and an agreed first release worth shipping.
            </p>
          </div>

          <div className="surface p-5">
            <p className="text-[12px] font-semibold text-white">2) Build + iterate</p>
            <p className="mt-2 text-[13px] text-muted">
              Components + API contracts first, then refinement. No “big bang” rewrites.
            </p>
          </div>

          <div className="surface p-5">
            <p className="text-[12px] font-semibold text-white">3) Ship + maintain</p>
            <p className="mt-2 text-[13px] text-muted">
              Logging, monitoring, and maintenance pathways so the product stays healthy.
            </p>
          </div>
        </div>
      </Section>

      {/* CONTACT (CHANGED: now uses Section for consistent transitions) */}
      <Section
        id="contact"
        eyebrow="Contact"
        title="Want to collaborate?"
        subtitle="If you’re building something that needs to ship and keep running, we can talk through scope, timeline, and a sensible first milestone."
      >
        <div className="surface p-7 md:p-12">
          <div className="accent-line" />

          <div className="mt-6 flex flex-wrap gap-3">
            {/* <Button href="https://sixbyfive.com" variant="primary">
              Contact via sixbyfive.com
            </Button> */}

            <Button href="https://uk.linkedin.com/company/sixbyfive" variant="secondary">
              LinkedIn
            </Button>
          </div>

          {/* Optional: small reassurance line (keeps it “agency” without sounding salesy) */}
          <p className="mt-4 text-[12px] text-muted2">
            Typical first step: a short scope call → a single milestone → ship.
          </p>
        </div>
      </Section>
    </div>
  );
}

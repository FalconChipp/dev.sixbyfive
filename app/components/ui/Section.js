// app/components/ui/Section.js
//
// UPDATED (FULL FILE)
//
// CHANGED:
// - Adds `fullBleed` prop:
//   - Header remains inside <Container> for consistent page typography
//   - Children can render OUTSIDE <Container> so tools can go true fullscreen
// - Backwards compatible: default remains the same (Container wraps everything)
//
// USAGE:
// <Section ... fullBleed>
//   <YourFullWidthTool />
// </Section>

import Container from "./Container";

export default function Section({
  eyebrow,
  title,
  subtitle,
  children,
  id,
  className = "",
  showDivider = true,
  fullBleed = false, // NEW
}) {
  return (
    <>
      {showDivider && <div className="section-divider" />}

      <section id={id} className={`section py-10 md:py-14 ${className}`}>
        {/* Header stays consistent */}
        {(eyebrow || title || subtitle) && (
          <Container>
            <header className="mb-6 md:mb-8 relative">
              {eyebrow && (
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="mt-2 text-[18px] md:text-[22px] font-semibold text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
                  {subtitle}
                </p>
              )}
            </header>
          </Container>
        )}

        {/* Children placement:
            - default: children inside Container (existing behavior)
            - fullBleed: children outside Container (can be full width) */}
        {fullBleed ? (
          <div className="relative">{children}</div>
        ) : (
          <Container>
            <div className="relative">{children}</div>
          </Container>
        )}
      </section>
    </>
  );
}

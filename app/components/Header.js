// app/components/Header.js — v5
// Tools nav item is now a dropdown with all tools listed directly
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const toolLinks = [
  { href: "/tools/bulk-edit",           label: "Bulk Edit UI",         desc: "Variant editor" },
  { href: "/tools/cardmarket-exporter", label: "Cardmarket Exporter",  desc: "ID export script" },
  { href: "/tools/tcgplayer-exporter",  label: "TCGPlayer Exporter",   desc: "API product IDs" },
  { href: "/tools/image-intake",        label: "Card Image Intake",    desc: "Upload pipeline" },
];

// Nav links — no Tools here, it gets its own dropdown
const navLinks = [
  { href: "/work",     label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process",  label: "Process" },
  { href: "https://tcg.sixbyfive.com", label: "TCG ↗", external: true },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timer = useRef(null);
  function show() { clearTimeout(timer.current); setOpen(true); }
  function hideSoon() { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 150); }
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(timer.current); document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);
  return { open, setOpen, ref, show, hideSoon };
}

const navItemStyle = (active) => ({
  fontSize: 13,
  fontWeight: 500,
  padding: "5px 10px",
  borderRadius: 6,
  textDecoration: "none",
  transition: "all 0.15s",
  color: active ? "var(--text)" : "var(--text-3)",
  background: active ? "var(--bg-hover)" : "transparent",
  display: "inline-block",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
});

const dropdownStyle = {
  position: "absolute",
  top: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: "var(--bg-raised)",
  border: "1px solid var(--border-2)",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
  zIndex: 100,
  minWidth: 220,
};

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const tools = useDropdown();

  const isActive = (href) => href !== "/" && pathname?.startsWith(href);
  const toolsActive = toolLinks.some((t) => pathname === t.href);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,10,11,0.88)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, lineHeight: 1 }}>
            {/* Top rule */}
            <div style={{ width: "100%", height: 2, background: "white", marginBottom: 4 }} />
            {/* SIXBYFIVE wordmark */}
            <div style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}>
              <span style={{ color: "white" }}>SIX</span>
              <span style={{ color: "#e8a444" }}>BY</span>
              <span style={{ color: "white" }}>FIVE</span>
            </div>
            {/* Bottom: rules + STUDIOS */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, width: "100%" }}>
              <div style={{ flex: 1, height: 1.5, background: "rgba(255,255,255,0.6)" }} />
              <span style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 8,
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.75)",
                whiteSpace: "nowrap",
              }}>STUDIOS</span>
              <div style={{ flex: 1, height: 1.5, background: "rgba(255,255,255,0.6)" }} />
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="sbf-desktop-nav">

          {/* Regular links */}
          {navLinks.map((l) => {
            const active = isActive(l.href);
            if (l.external) {
              return (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                  style={navItemStyle(active)}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = active ? "var(--text)" : "var(--text-3)"; e.currentTarget.style.background = active ? "var(--bg-hover)" : "transparent"; }}>
                  {l.label}
                </a>
              );
            }
            return (
              <Link key={l.href} href={l.href}
                style={navItemStyle(active)}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = active ? "var(--text)" : "var(--text-3)"; e.currentTarget.style.background = active ? "var(--bg-hover)" : "transparent"; }}>
                {l.label}
              </Link>
            );
          })}

          {/* Tools dropdown — lists each tool directly */}
          <div ref={tools.ref} style={{ position: "relative" }}
            onMouseEnter={tools.show} onMouseLeave={tools.hideSoon}>

            <button type="button"
              onClick={() => tools.setOpen(v => !v)}
              style={{
                ...navItemStyle(toolsActive || tools.open),
                display: "inline-flex", alignItems: "center", gap: 4,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={e => {
                if (!tools.open) {
                  e.currentTarget.style.color = toolsActive ? "var(--text)" : "var(--text-3)";
                  e.currentTarget.style.background = toolsActive ? "var(--bg-hover)" : "transparent";
                }
              }}
            >
              Tools
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: tools.open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {tools.open && (
              <div style={dropdownStyle} onMouseEnter={tools.show} onMouseLeave={tools.hideSoon}>
                {/* Bridge gap */}
                <div style={{ position: "absolute", top: -8, left: 0, right: 0, height: 8 }} />

                {/* Header row */}
                <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)" }}>
                    Free tools
                  </span>
                  <Link href="/tools" onClick={() => tools.setOpen(false)}
                    style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)", textDecoration: "none", letterSpacing: "0.06em" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text-2)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-4)"}>
                    All tools →
                  </Link>
                </div>

                {/* Tool list */}
                <div style={{ padding: 4 }}>
                  {toolLinks.map((t) => {
                    const active = pathname === t.href;
                    return (
                      <Link key={t.href} href={t.href}
                        onClick={() => tools.setOpen(false)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          padding: "9px 10px",
                          borderRadius: 6,
                          textDecoration: "none",
                          background: active ? "var(--bg-hover)" : "transparent",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-hover)"}
                        onMouseLeave={e => e.currentTarget.style.background = active ? "var(--bg-hover)" : "transparent"}
                      >
                        <span style={{ fontSize: 13, fontWeight: 500, color: active ? "var(--text)" : "var(--text-2)" }}>
                          {t.label}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>
                          {t.desc}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <a href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer"
            className="btn btn-primary" style={{ marginLeft: 8, padding: "6px 14px", fontSize: 12 }}>
            Get in touch ↗
          </a>
        </nav>

        {/* Mobile toggle */}
        <button type="button" className="sbf-mobile-btn"
          onClick={() => setMobileOpen(v => !v)}
          style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-2)", cursor: "pointer", padding: "5px 10px", fontSize: 13, display: "none" }}>
          {mobileOpen ? "✕" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "8px 0 16px" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {navLinks.map((l) => (
              l.external
                ? <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                    style={{ fontSize: 13, fontWeight: 500, padding: "8px 10px", color: "var(--text-2)", textDecoration: "none", borderRadius: 6 }}
                    onClick={() => setMobileOpen(false)}>{l.label}</a>
                : <Link key={l.href} href={l.href}
                    style={{ fontSize: 13, fontWeight: 500, padding: "8px 10px", color: isActive(l.href) ? "var(--text)" : "var(--text-2)", textDecoration: "none", borderRadius: 6 }}
                    onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}

            {/* Tools section in mobile */}
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 10px 8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)" }}>Tools</span>
                <Link href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)", textDecoration: "none" }}
                  onClick={() => setMobileOpen(false)}>All →</Link>
              </div>
              {toolLinks.map((t) => (
                <Link key={t.href} href={t.href}
                  style={{ display: "flex", flexDirection: "column", gap: 1, padding: "8px 10px", borderRadius: 6, textDecoration: "none" }}
                  onClick={() => setMobileOpen(false)}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: pathname === t.href ? "var(--text)" : "var(--text-2)" }}>{t.label}</span>
                  <span style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>{t.desc}</span>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <a href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer"
                className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Get in touch ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .sbf-desktop-nav { display: none !important; }
          .sbf-mobile-btn  { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
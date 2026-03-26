// app/components/Footer.js — REDESIGN v3
"use client";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: 0 }}>
      <div className="wrap" style={{ padding: "40px 24px", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", alignItems: "center" }}>
        {/* Brand */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>
            SixByFive Studio
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Products · Platforms · Tooling
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 24px" }}>
          {[
            { href: "https://sixbyfive.com",              label: "sixbyfive.com" },
            { href: "https://tcg.sixbyfive.com",          label: "TCG Platform" },
            { href: "https://3dprinting.sixbyfive.com",   label: "3D Printing" },
            { href: "https://uk.linkedin.com/company/sixbyfive", label: "LinkedIn" },
          ].map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-4)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-2)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-4)"}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-4)" }}>
          © {year} SixByFive
        </div>
      </div>
    </footer>
  );
}
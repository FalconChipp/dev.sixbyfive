// app/components/Header.js
//
// FIXED:
// - Hover dropdown works (doesn't snap shut)
// - openTools/closeToolsSoon + closeTimerRef correctly scoped inside Header()
// - Adds active + hover state to the Tools button
// - Keeps outside-click + Escape close
// - Clears close timer on unmount (prevents state updates after unmount)
// - Mobile tools group unchanged

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "./ui/Button";

const toolLinks = [
  { href: "/tools/bulk-edit", label: "Bulk Edit UI", external: false },
  { href: "/tools/cardmarket-exporter", label: "Cardmarket Exporter", external: false },
  { href: "/tools/tcgplayer-exporter", label: "TCGPlayer Exporter", external: false },
  { href: "/tools/image-intake", label: "TCGDex Image Intake", external: false }, 
];

const navLinks = [
  { href: "/", label: "Home", external: false },

  // Existing anchors
  { href: "#work", label: "Work", external: false },
  { href: "#services", label: "Services", external: false },
  { href: "#process", label: "Process", external: false },

  // External
  { href: "https://tcg.sixbyfive.com", label: "TCG", external: true },
];

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3 1.41 1.42Z"
      />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

function NavItem({ link, pathname, onClick }) {
  const base =
    "rounded-md px-2 py-1 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition";
  const isExternal = link.external;

  if (isExternal) {
    return (
      <a
        key={link.href}
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={base}
        onClick={onClick}
      >
        {link.label}
      </a>
    );
  }

  const isHash = link.href.startsWith("#");
  if (isHash) {
    return (
      <a key={link.href} href={link.href} className={base} onClick={onClick}>
        {link.label}
      </a>
    );
  }

  const isActive = pathname === link.href;
  return (
    <Link
      key={link.href}
      href={link.href}
      className={`${base} ${isActive ? "text-white bg-white/[0.06]" : ""}`}
      onClick={onClick}
    >
      {link.label}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Tools dropdown state
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  // NEW: hover-safe close delay (prevents menu snapping shut)
  const closeTimerRef = useRef(null);

  function openTools() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setToolsOpen(true);
  }

  function closeToolsSoon() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setToolsOpen(false), 160);
  }

  // Close dropdown on outside click + Escape
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!toolsRef.current) return;
      if (!toolsRef.current.contains(e.target)) setToolsOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setToolsOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const renderedLinks = useMemo(() => {
    return navLinks.map((link) => (
      <NavItem
        key={link.href}
        link={link}
        pathname={pathname}
        onClick={() => setOpen(false)}
      />
    ));
  }, [pathname]);

  const toolsIsActive = useMemo(() => {
    return toolLinks.some((t) => pathname === t.href);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="accent-glow flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--accent)] text-[12px] font-black text-slate-950">
            S
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-white tracking-tight">
              SixByFive Studio
            </div>
            <div className="text-[11px] text-white/55">
              Products • Platforms • Tooling
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 md:flex">
          {renderedLinks}

          {/* Tools dropdown (hover-safe) */}
          <div
            className="relative"
            ref={toolsRef}
            onMouseEnter={openTools}
            onMouseLeave={closeToolsSoon}
          >
            <button
              type="button"
              className={[
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[13px] transition",
                "hover:text-white hover:bg-white/[0.06]",
                toolsIsActive || toolsOpen
                  ? "text-white bg-white/[0.06]"
                  : "text-white/70",
              ].join(" ")}
              aria-haspopup="menu"
              aria-expanded={toolsOpen ? "true" : "false"}
              onClick={() => setToolsOpen((v) => !v)} // click fallback
            >
              Tools
              <span
                className={[
                  "text-white/70 transition-transform",
                  toolsOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                <IconChevronDown />
              </span>
            </button>

            {toolsOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56"
                onMouseEnter={openTools}
                onMouseLeave={closeToolsSoon}
              >
                {/* hover “bridge” to prevent gap between button + menu */}
                <div className="absolute -top-2 left-0 right-0 h-2" />

                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur shadow-lg">
                  <div className="px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Free tools
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="p-1">
                    {toolLinks.map((t) => {
                      const isActive = pathname === t.href;
                      return (
                        <Link
                          key={t.href}
                          href={t.href}
                          role="menuitem"
                          className={[
                            "block rounded-lg px-3 py-2 text-[13px] transition",
                            isActive
                              ? "bg-white/[0.10] text-white"
                              : "text-white/75 hover:bg-white/[0.06] hover:text-white",
                          ].join(" ")}
                          onClick={() => setToolsOpen(false)}
                        >
                          <div className="font-semibold">{t.label}</div>
                          <div className="mt-0.5 text-[11px] text-white/55">
                            {t.href.includes("bulk-edit")
                              ? "UI + docs in one page"
                              : "Download + docs"}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* <Button href="#contact" variant="primary" className="ml-2">
            Contact
          </Button> */}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.04] p-2 text-white/80 hover:bg-white/[0.08] transition"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/45 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {renderedLinks}

            {/* Tools group in mobile */}
            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
              <div className="px-2 py-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                Tools
              </div>
              <div className="mt-1 flex flex-col gap-1">
                {toolLinks.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="rounded-lg px-2 py-2 text-[13px] text-white/75 hover:text-white hover:bg-white/[0.06] transition"
                    onClick={() => setOpen(false)}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* <Button href="#contact" variant="primary" className="mt-2">
              Contact
            </Button> */}
          </div>
        </div>
      )}
    </header>
  );
}

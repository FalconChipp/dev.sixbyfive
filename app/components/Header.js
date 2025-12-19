// components/Header.js
// Clean, quiet header: logo text left, simple nav right.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "https://tcg.sixbyfive.com", label: "TCG Platform", external: true },
  { href: "https://3dprinting.sixbyfive.com", label: "3D Printing", external: true },
  { href: "/tools/cardmarket-merge-exporter", label: "Open tooling" }
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-sbf-border bg-sbf-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sbf-accent text-[11px] font-semibold text-white">
            S
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold">SixByFive Studio</span>
            <span className="text-[11px] text-sbf-textMuted">
              Products, platforms, tooling
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-4 text-[13px] text-sbf-textMuted md:flex">
          {navLinks.map((link) => {
            const isExternal = link.external;
            const isActive =
              !isExternal &&
              (pathname === link.href || pathname.startsWith(link.href + "/"));

            const base =
              "hover:text-sbf-text transition-colors relative pb-0.5";

            const content = (
              <>
                {link.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[3px] h-[2px] rounded-full bg-sbf-accent" />
                )}
              </>
            );

            if (isExternal) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={base}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={link.href} href={link.href} className={base}>
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

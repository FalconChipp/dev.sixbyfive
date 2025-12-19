// components/Footer.js
// Small, neutral footer with links back to other properties.

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sbf-border bg-sbf-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-[11px] text-sbf-textMuted md:flex-row">
        <span>© {year} SixByFive. Built and run by a real developer.</span>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="https://sixbyfive.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sbf-accent"
          >
            sixbyfive.com
          </Link>
          <span className="hidden text-sbf-border md:inline">•</span>
          <Link
            href="https://tcg.sixbyfive.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sbf-accent"
          >
            TCG platform
          </Link>
          <span className="hidden text-sbf-border md:inline">•</span>
          <Link
            href="https://3dprinting.sixbyfive.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sbf-accent"
          >
            3D printing
          </Link>
        </div>
      </div>
    </footer>
  );
}

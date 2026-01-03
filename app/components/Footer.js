// app/components/Footer.js
// CHANGED: cleaner footer, consistent styling, studio feel

import Container from "./ui/Container";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <Container className="py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[13px] font-semibold text-white">SixByFive Studio</div>
            <div className="text-[12px] text-muted">
              Building focused products and the tooling behind them.
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[12px] text-white/70">
            <a className="hover:text-white transition" href="https://sixbyfive.com" target="_blank" rel="noreferrer">
              sixbyfive.com
            </a>
            <a className="hover:text-white transition" href="https://tcg.sixbyfive.com" target="_blank" rel="noreferrer">
              SixByFive TCG
            </a>
            <a className="hover:text-white transition" href="https://3dprinting.sixbyfive.com" target="_blank" rel="noreferrer">
              3D Printing
            </a>
            <a className="hover:text-white transition" href="https://uk.linkedin.com/company/sixbyfive" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-6 text-[11px] text-white/45">
          © {year} SixByFive. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

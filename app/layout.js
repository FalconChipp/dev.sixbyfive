// app/layout.js
// CHANGED: use bg-noise wrapper, remove old bg-grid

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "SixByFive Studio",
  description: "SixByFive Studio — Products, platforms, and tooling.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-noise min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

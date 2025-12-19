// app/layout.js
// Simple shell: neutral background, centered content.

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "SixByFive Studio",
  description: "SixByFive — building real products, platforms, and tools."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-sbf-bg text-sbf-text antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

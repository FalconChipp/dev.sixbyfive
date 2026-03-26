// app/layout.js — v4 with SEO
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const SITE_URL = "https://dev.sixbyfive.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SixByFive Studios — Products, Platforms & Tooling",
    template: "%s — SixByFive Studios",
  },
  description:
    "Independent UK studio building collector-first products and the internal tooling that runs them. Full-stack web, mobile, and data pipelines.",
  keywords: [
    "SixByFive Studios",
    "independent software studio",
    "UK developer studio",
    "Next.js",
    "React",
    "full-stack development",
    "TCG platform",
    "collector software",
    "bespoke web development",
  ],
  authors: [{ name: "SixByFive Studios", url: SITE_URL }],
  creator: "SixByFive Studios",
  publisher: "SixByFive Studios",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "SixByFive Studios",
    title: "SixByFive Studios — Products, Platforms & Tooling",
    description:
      "Independent UK studio building collector-first products and the internal tooling that runs them.",
  },
  twitter: {
    card: "summary",
    title: "SixByFive Studios — Products, Platforms & Tooling",
    description:
      "Independent UK studio building collector-first products and the internal tooling that runs them.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SixByFive Studios",
  url: SITE_URL,
  description:
    "Independent UK software studio building collector-first products, platforms, and the operational tooling behind them.",
  foundingLocation: {
    "@type": "Place",
    addressCountry: "GB",
  },
  sameAs: [],
  knowsAbout: [
    "Web application development",
    "Mobile application development",
    "Full-stack engineering",
    "Data pipelines",
    "TCG collector platforms",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <head>
        <meta name="theme-color" content="#0a0a0b" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
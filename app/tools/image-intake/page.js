// app/tools/image-intake/page.js

import ImageIntakeClient from "./ImageIntakeClient";

export const metadata = {
  title: "Card Image Intake • SixByFive Tools",
  description:
    "Upload a zip of card images for a set. Files are validated, renamed to canonical format, and uploaded to Google Drive.",
};

export default function ImageIntakePage() {
  return (
    <>
      <style>{`
        .ingest-link:hover {
          background: rgba(56,189,248,0.25) !important;
          border-color: rgba(56,189,248,0.6) !important;
          color: rgba(186,230,253,1) !important;
        }
      `}</style>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(99,102,241,0.10) 100%)",
          borderBottom: "1px solid rgba(56,189,248,0.2)",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(56,189,248,0.8)",
              marginBottom: "0.75rem",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            Official ingest now available
          </div>
          <h2
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.3,
            }}
          >
            Use the TCGdex Manager for image submissions
          </h2>
          <p
            style={{
              margin: "0 0 1.25rem",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
            }}
          >
            Card images can now be submitted directly through the official TCGdex ingest pipeline.
            This internal tool remains available below.
          </p>
          <a
            href="https://manager.tcgdex.net/ingest"
            target="_blank"
            rel="noopener noreferrer"
            className="ingest-link"
            style={{
              transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(56,189,248,0.15)",
              border: "1px solid rgba(56,189,248,0.35)",
              borderRadius: "0.625rem",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "rgba(186,230,253,0.95)",
              textDecoration: "none",
            }}
          >
            Open manager.tcgdex.net/ingest
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
      <ImageIntakeClient />
    </>
  );
}
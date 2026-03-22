// app/tools/image-intake/ImageIntakeClient.js
"use client";

import React, { useCallback, useRef, useState } from "react";
import Section from "../../components/ui/Section";

// ─── Config ─────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_IMAGE_INTAKE_URL || "https://tcgdex-upload.sixbyfive.com";
const API_KEY = process.env.NEXT_PUBLIC_IMAGE_INTAKE_KEY || "";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseCardNumbersForPreview(raw) {
  const segments = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));

  const seen = new Set();
  const result = [];
  for (const seg of segments) {
    const padded = seg.padStart(3, "0");
    if (!seen.has(padded)) {
      seen.add(padded);
      result.push({ raw: seg, padded });
    }
  }
  return result;
}

function StatusIcon({ status }) {
  if (status === "uploading") {
    return (
      <svg className="animate-spin h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    );
  }
  if (status === "success") {
    return (
      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === "error") {
    return (
      <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return null;
}

// ─── Drop zone ───────────────────────────────────────────────────────────────
function DropZone({ file, onFile, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) onFile(f);
  }, [onFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={[
        "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition cursor-pointer select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/30 hover:bg-white/[0.03]",
        dragging ? "border-[color:var(--accent)]/60 bg-[color:var(--accent)]/5" : "border-white/15",
        file ? "bg-white/[0.03]" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />

      {file ? (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
            <svg className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white">{file.name}</div>
            <div className="mt-1 text-[12px] text-white/45">{formatBytes(file.size)}</div>
          </div>
          {!disabled && (
            <div className="text-[11px] text-white/35">Click or drop to replace</div>
          )}
        </>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <svg className="h-6 w-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-semibold text-white/80">Drop a .zip file here</div>
            <div className="mt-1 text-[12px] text-white/40">or click to browse</div>
          </div>
          <div className="text-[11px] text-white/25">Images must be at root level • filenames must contain a number</div>
        </>
      )}
    </div>
  );
}

// ─── Result panel ────────────────────────────────────────────────────────────
function ResultPanel({ result }) {
  const [copied, setCopied] = useState(false);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(result.submissionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { /* ignore */ }
  }

  if (!result.success) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-red-300">Upload failed</div>
            <div className="mt-1 text-[13px] text-red-200/70">{result.error}</div>
          </div>
        </div>
      </div>
    );
  }

  const totalCount = result.matchedCount + (result.symbolFile ? 1 : 0);

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-emerald-300">
            {totalCount} file{totalCount !== 1 ? "s" : ""} uploaded successfully
            {result.symbolFile && (
              <span className="ml-2 text-[11px] font-normal text-emerald-400/60">
                (incl. set symbol)
              </span>
            )}
          </div>
          <button
            onClick={copyId}
            className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400/60 hover:text-emerald-300 transition font-mono"
          >
            {result.submissionId}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied && <span className="text-emerald-300">Copied!</span>}
          </button>
        </div>
      </div>

      {/* Storage info */}
      <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-[12px]">
        <div className="text-white/40 mb-2">Storage location</div>
        <div className="space-y-1 text-white/70 font-mono text-[11px]">
          <div>Bucket: <span className="text-white/90">{result.storage?.bucketName}</span></div>
          <div>Path: <span className="text-white/90">{result.storage?.submissionPrefix}</span></div>
        </div>
      </div>

      {/* Symbol file */}
      {result.symbolFile && (
        <div>
          <div className="text-[11px] text-white/40 mb-1.5">Set symbol</div>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <StatusIcon status="success" />
            <span className="text-[12px] font-mono text-white/80 min-w-[3.5rem]">symbol</span>
            <span className="text-[12px] text-white/50 flex-1 truncate">{result.symbolFile.filename}</span>
            <span className="text-[10px] font-mono text-white/25 hidden md:block truncate max-w-[180px]">{result.symbolFile.objectKey}</span>
          </div>
        </div>
      )}

      {/* Card image file list */}
      <div>
        {result.symbolFile && (
          <div className="text-[11px] text-white/40 mb-1.5">Card images</div>
        )}
        <div className="space-y-1.5">
          {(result.uploadedFiles || []).map((f) => (
            <div
              key={f.cardNumber}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
            >
              <StatusIcon status="success" />
              <span className="text-[12px] font-mono text-white/80 min-w-[3.5rem]">{f.cardNumber}</span>
              <span className="text-[12px] text-white/50 flex-1 truncate">{f.filename}</span>
              <span className="text-[10px] font-mono text-white/25 hidden md:block truncate max-w-[180px]">{f.objectKey}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Rules sidebar ───────────────────────────────────────────────────────────
function RulesPanel() {
  const rules = [
    "Single .zip file",
    "Files at root level — no subfolders",
    "Filenames must contain a number — that number is the card number",
    "Valid: 001.png, Blitzle-12-XY-Trainer-Kit.png, Potion-21.jpg",
    "Formats: .png .jpg .jpeg .webp",
    "No duplicate files for the same card number",
    "Card numbers must match declared numbers exactly — no extras, no missing",
    'Optionally include "symbol.png" or "logo.png" for the set logo',
  ];

  return (
    <div className="surface p-5 h-fit">
      <div className="text-[12px] font-semibold text-white mb-3">Upload rules</div>
      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r} className="flex items-start gap-2 text-[12px] text-white/60">
            <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
            {r}
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-3">
        <div className="text-[11px] text-white/40 mb-1.5">Example zip structure</div>
        <pre className="text-[11px] text-white/60 leading-relaxed font-mono">{`cards.zip
├── symbol.png
├── 001.png
├── Blitzle-12-XY-Trainer-Kit.png
└── Potion-21.jpg`}</pre>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ImageIntakeClient() {
  const [setCode, setSetCode] = useState("");
  const [cardNumbers, setCardNumbers] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [result, setResult] = useState(null);

  const canSubmit =
    status !== "uploading" &&
    setCode.trim().length > 0 &&
    cardNumbers.trim().length > 0 &&
    zipFile !== null;

  const parsedNumbers = parseCardNumbersForPreview(cardNumbers);

  async function handleSubmit() {
    if (!canSubmit) return;

    setStatus("uploading");
    setResult(null);

    const formData = new FormData();
    formData.append("setCode", setCode.trim());
    formData.append("cardNumbers", cardNumbers.trim());
    formData.append("zipFile", zipFile);

    try {
      const res = await fetch(`${API_URL}/api/uploads/card-images`, {
        method: "POST",
        headers: { "x-api-key": API_KEY },
        body: formData,
      });

      const json = await res.json();
      setResult(json);
      setStatus(json.success ? "success" : "error");

      if (json.success) {
        setZipFile(null);
        setCardNumbers("");
        setSetCode("");
      }
    } catch (err) {
      setResult({ success: false, error: err.message || "Network error" });
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setZipFile(null);
    setCardNumbers("");
    setSetCode("");
  }

  return (
    <Section
      eyebrow="Tool"
      title="Card Image Intake"
      subtitle="Upload a zip of card images for a set. Files are validated, renamed to canonical format, and uploaded to storage."
      showDivider={false}
    >
      <div className="grid gap-6 md:grid-cols-12">
        {/* ── LEFT: Form ─────────────────────────────────────────── */}
        <div className="md:col-span-8 space-y-4">

          <div className="surface p-5">
            <div className="text-[12px] font-semibold text-white mb-4">Submission details</div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-[11px] text-white/55 mb-1.5">
                  Set code <span className="text-white/30">(e.g. SV2A)</span>
                </label>
                <input
                  value={setCode}
                  onChange={(e) => setSetCode(e.target.value.toUpperCase())}
                  placeholder="SV2A"
                  disabled={status === "uploading"}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-white font-mono uppercase placeholder:text-white/20 outline-none focus:border-white/25 transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/55 mb-1.5">
                  Card numbers <span className="text-white/30">(comma-separated)</span>
                </label>
                <input
                  value={cardNumbers}
                  onChange={(e) => setCardNumbers(e.target.value)}
                  placeholder="1, 2, 10"
                  disabled={status === "uploading"}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-white font-mono placeholder:text-white/20 outline-none focus:border-white/25 transition disabled:opacity-50"
                />
              </div>
            </div>

            {parsedNumbers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {parsedNumbers.map(({ raw, padded }, i) => (
                  <span
                    key={`${i}-${raw}`}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/60"
                  >
                    {setCode ? `${setCode}-${padded}` : padded}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="surface p-5">
            <div className="text-[12px] font-semibold text-white mb-4">Zip file</div>
            <DropZone
              file={zipFile}
              onFile={setZipFile}
              disabled={status === "uploading"}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition",
                canSubmit
                  ? "bg-[color:var(--accent)] text-slate-950 hover:brightness-110"
                  : "bg-white/[0.06] text-white/30 cursor-not-allowed",
              ].join(" ")}
            >
              {status === "uploading" ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  Upload images
                </>
              )}
            </button>

            {(status === "success" || status === "error") && (
              <button
                onClick={reset}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-white/10 transition"
              >
                New upload
              </button>
            )}

            {!canSubmit && status === "idle" && (
              <span className="text-[12px] text-white/30">
                {!setCode.trim() ? "Set code required" : !cardNumbers.trim() ? "Card numbers required" : "Zip file required"}
              </span>
            )}
          </div>

          {result && <ResultPanel result={result} />}
        </div>

        {/* ── RIGHT: Rules sidebar ────────────────────────────────── */}
        <div className="md:col-span-4">
          <RulesPanel />
        </div>
      </div>
    </Section>
  );
}
// app/tools/image-intake/ImageIntakeClient.js
"use client";

import React, { useCallback, useRef, useState } from "react";
import { unzipSync } from "fflate";
import Section from "../../components/ui/Section";

// ─── Config ─────────────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_IMAGE_INTAKE_URL || "https://tcgdex-upload.sixbyfive.com";
const API_KEY = process.env.NEXT_PUBLIC_IMAGE_INTAKE_KEY || "";

const SYMBOL_BASENAMES = new Set(["symbol", "logo"]);
const ALLOWED_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const SET_CODE_RE = /^[A-Z0-9]{2,10}$/;

// ─── Zip detection ───────────────────────────────────────────────────────────
async function detectZipMode(file) {
  try {
    const buffer = await file.arrayBuffer();
    const entries = unzipSync(new Uint8Array(buffer));

    const paths = Object.keys(entries).map((p) => p.replace(/\\/g, "/"));
    const filtered = paths.filter((p) => !p.endsWith("/"));

    const relevant = filtered.filter((p) => {
      const name = p.split("/").pop().toLowerCase();
      return !name.startsWith(".") && name !== "thumbs.db" && !p.startsWith("__MACOSX/");
    });

    if (relevant.length === 0) return "unknown";

    const hasFolder = relevant.some((p) => p.includes("/"));

    if (hasFolder) {
      const folders = [...new Set(relevant.map((p) => p.split("/")[0].toUpperCase()))];
      const allValidSetCodes = folders.every((f) => SET_CODE_RE.test(f));
      return allValidSetCodes ? "multi" : "unknown";
    }

    const allSymbols = relevant.every((p) => {
      const name = p.split("/").pop().toLowerCase();
      const ext = name.slice(name.lastIndexOf("."));
      const base = name.slice(0, name.lastIndexOf("."));
      return ALLOWED_EXTS.has(ext) && SYMBOL_BASENAMES.has(base);
    });

    return allSymbols ? "symbol" : "card";
  } catch {
    return "unknown";
  }
}

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

// ─── Detection badge ─────────────────────────────────────────────────────────
function DetectionBadge({ detectedMode, overrideDetection, onToggleOverride }) {
  if (!detectedMode || detectedMode === "unknown") return null;

  const labels = {
    card: "Single set detected",
    symbol: "Symbol-only detected",
    multi: "Multi-set detected",
  };

  const colors = {
    card: "border-white/10 text-white/40",
    symbol: "border-amber-500/20 text-amber-400/60",
    multi: "border-blue-500/20 text-blue-400/60",
  };

  return (
    <div className={`flex items-center gap-1.5 text-[11px] border rounded-lg px-2 py-1 ${colors[detectedMode]}`}>
      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
      {labels[detectedMode]}
      {detectedMode === "multi" && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleOverride(); }}
          className="ml-1 underline underline-offset-2 text-white/30 hover:text-white/60 transition"
        >
          {overrideDetection ? "lock set code" : "enter set code manually"}
        </button>
      )}
    </div>
  );
}

// ─── Drop zone ───────────────────────────────────────────────────────────────
function DropZone({ file, detectedMode, overrideDetection, onToggleOverride, onFile, disabled }) {
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
          <DetectionBadge
            detectedMode={detectedMode}
            overrideDetection={overrideDetection}
            onToggleOverride={onToggleOverride}
          />
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

// ─── Single set result ────────────────────────────────────────────────────────
function SingleSetResult({ result }) {
  const cardCount = result.uploadedFiles?.length ?? 0;
  const totalCount = cardCount + (result.symbolFile ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-emerald-300">
            {totalCount} file{totalCount !== 1 ? "s" : ""} uploaded successfully
            {result.symbolFile && cardCount === 0 && (
              <span className="ml-2 text-[11px] font-normal text-emerald-400/60">(symbol only)</span>
            )}
            {result.symbolFile && cardCount > 0 && (
              <span className="ml-2 text-[11px] font-normal text-emerald-400/60">(incl. set symbol)</span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-[12px]">
        <div className="text-white/40 mb-2">Storage location</div>
        <div className="space-y-1 text-white/70 font-mono text-[11px]">
          <div>Bucket: <span className="text-white/90">{result.storage?.bucketName}</span></div>
          <div>Path: <span className="text-white/90">{result.storage?.submissionPrefix}</span></div>
        </div>
      </div>

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

      {cardCount > 0 && (
        <div>
          {result.symbolFile && <div className="text-[11px] text-white/40 mb-1.5">Card images</div>}
          <div className="space-y-1.5">
            {result.uploadedFiles.map((f) => (
              <div key={f.cardNumber} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <StatusIcon status="success" />
                <span className="text-[12px] font-mono text-white/80 min-w-[3.5rem]">{f.cardNumber}</span>
                <span className="text-[12px] text-white/50 flex-1 truncate">{f.filename}</span>
                <span className="text-[10px] font-mono text-white/25 hidden md:block truncate max-w-[180px]">{f.objectKey}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Multi set result ─────────────────────────────────────────────────────────
function MultiSetResult({ data }) {
  const [expandedSets, setExpandedSets] = useState({});

  function toggleSet(setCode) {
    setExpandedSets((prev) => ({ ...prev, [setCode]: !prev[setCode] }));
  }

  const totalFiles = data.sets.reduce((acc, s) => {
    return acc + (s.uploadedFiles?.length ?? 0) + (s.symbolFile ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-emerald-300">
            {totalFiles} file{totalFiles !== 1 ? "s" : ""} uploaded across {data.setCount} set{data.setCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.sets.map((s) => {
          const cardCount = s.uploadedFiles?.length ?? 0;
          const totalCount = cardCount + (s.symbolFile ? 1 : 0);
          const isExpanded = expandedSets[s.setCode] ?? false;

          return (
            <div key={s.setCode} className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => toggleSet(s.setCode)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.03] transition text-left"
              >
                <span className="text-[12px] font-mono font-semibold text-white/90 min-w-[4rem]">{s.setCode}</span>
                <span className="text-[12px] text-white/40 flex-1">
                  {totalCount} file{totalCount !== 1 ? "s" : ""}
                  {s.symbolFile && cardCount === 0 && <span className="ml-1.5 text-white/25">(symbol only)</span>}
                  {s.symbolFile && cardCount > 0 && <span className="ml-1.5 text-white/25">(incl. symbol)</span>}
                </span>
                <span className="text-[11px] font-mono text-white/25 hidden md:block truncate max-w-[160px]">{s.storage?.submissionPrefix}</span>
                <svg
                  className={`h-3.5 w-3.5 text-white/30 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="border-t border-white/[0.06] px-3 py-2 space-y-1.5">
                  {s.symbolFile && (
                    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                      <StatusIcon status="success" />
                      <span className="text-[11px] font-mono text-white/60 min-w-[3.5rem]">symbol</span>
                      <span className="text-[11px] text-white/40 flex-1 truncate">{s.symbolFile.filename}</span>
                      <span className="text-[10px] font-mono text-white/20 hidden md:block truncate max-w-[180px]">{s.symbolFile.objectKey}</span>
                    </div>
                  )}
                  {(s.uploadedFiles || []).map((f) => (
                    <div key={f.cardNumber} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                      <StatusIcon status="success" />
                      <span className="text-[11px] font-mono text-white/60 min-w-[3.5rem]">{f.cardNumber}</span>
                      <span className="text-[11px] text-white/40 flex-1 truncate">{f.filename}</span>
                      <span className="text-[10px] font-mono text-white/20 hidden md:block truncate max-w-[180px]">{f.objectKey}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Result panel ────────────────────────────────────────────────────────────
function ResultPanel({ result }) {
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

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      {result.multiSet
        ? <MultiSetResult data={result} />
        : <SingleSetResult result={result} />
      }
    </div>
  );
}

// ─── Rules sidebar ───────────────────────────────────────────────────────────
function RulesPanel({ mode }) {
  const cardExample = `cards.zip\n├── symbol.png      (optional)\n├── 001.png\n├── Blitzle-12.png\n└── Potion-21.jpg`;
  const symbolExample = `symbols.zip\n├── symbol.png\n└── logo.png        (alternative)`;
  const multiExample = `batch.zip\n├── SV2A/\n│   ├── symbol.png  (optional)\n│   └── 001.png\n├── SV2B/\n│   └── symbol.png\n└── SV3/\n    ├── 001.png\n    └── 002.png`;

  const titles = {
    card: "Single set",
    symbol: "Symbol only",
    multi: "Batch — multi-set",
  };

  const subtitles = {
    card: "Files at root level. Filenames must contain a number.",
    symbol: 'File must be named "symbol.png" or "logo.png".',
    multi: "One folder per set, named after the set code.",
  };

  const example = mode === "symbol" ? symbolExample : mode === "multi" ? multiExample : cardExample;

  return (
    <div className="surface p-5 h-fit space-y-4">
      <div>
        <div className="text-[12px] font-semibold text-white">{titles[mode]}</div>
        <div className="mt-1 text-[12px] text-white/50">{subtitles[mode]}</div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <div className="text-[11px] text-white/40 mb-1.5">Zip structure</div>
        <pre className="text-[11px] text-white/60 leading-relaxed font-mono">{example}</pre>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <div className="text-[11px] text-white/40 mb-1.5">Supported formats</div>
        <div className="font-mono text-[11px] text-white/60">.png  .jpg  .jpeg  .webp</div>
      </div>
    </div>
  );
}

// ─── Docs section ─────────────────────────────────────────────────────────────
function DocsSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="surface overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition"
      >
        <div className="flex items-center gap-2.5">
          <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <span className="text-[13px] font-semibold text-white">How to use this tool</span>
        </div>
        <svg
          className={`h-4 w-4 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-white/[0.06] px-5 py-5 space-y-7 text-[13px] text-white/70 leading-relaxed">

          <div>
            <div className="text-[12px] font-semibold text-white mb-2">Overview</div>
            <p>
              This tool accepts a zip file of card images, validates and renames them to a canonical format, and uploads them to storage. The mode is detected automatically based on what you fill in.
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Mode</th>
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Set code</th>
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Card numbers</th>
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Zip structure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr>
                    <td className="px-3 py-2 text-white/80">Single set — strict</td>
                    <td className="px-3 py-2 font-mono text-emerald-400/70">Required</td>
                    <td className="px-3 py-2 font-mono text-emerald-400/70">Required</td>
                    <td className="px-3 py-2 text-white/50">Flat</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-white/80">Single set — auto</td>
                    <td className="px-3 py-2 font-mono text-emerald-400/70">Required</td>
                    <td className="px-3 py-2 font-mono text-white/30">Leave blank</td>
                    <td className="px-3 py-2 text-white/50">Flat</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-white/80">Symbol only</td>
                    <td className="px-3 py-2 font-mono text-emerald-400/70">Required</td>
                    <td className="px-3 py-2 font-mono text-white/30">Leave blank</td>
                    <td className="px-3 py-2 text-white/50">Flat</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-white/80">Batch — multi-set</td>
                    <td className="px-3 py-2 font-mono text-white/30">Leave blank</td>
                    <td className="px-3 py-2 font-mono text-white/30">Leave blank</td>
                    <td className="px-3 py-2 text-white/50">Folders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-white mb-2">Single set upload</div>
            <p>
              Provide a set code and optionally a list of card numbers. The zip must contain image files at the root level — no subfolders.
            </p>
            <p className="mt-2">
              If you provide card numbers, the tool cross-checks them exactly against the files in the zip. Any missing or extra files will be rejected. Use this when you know exactly which cards you are submitting.
            </p>
            <p className="mt-2">
              If you leave card numbers blank, the tool auto-resolves them from the filenames. Any file whose name contains a number will be accepted. If the zip contains only a <span className="font-mono text-white/80">symbol.png</span> or <span className="font-mono text-white/80">logo.png</span>, it is uploaded as a symbol-only submission.
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[11px] text-white/40 mb-1.5">Example</div>
              <pre className="text-[11px] text-white/60 leading-relaxed font-mono">{`cards.zip\n├── symbol.png\n├── 001.png\n├── Blitzle-12-XY-Trainer-Kit.png\n└── Potion-21.jpg`}</pre>
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-white mb-2">Batch upload</div>
            <p>
              Leave the set code blank to use batch mode. The zip must contain one folder per set, named after the set code. Files go inside the relevant folder. Card numbers are always auto-resolved from filenames in this mode.
            </p>
            <p className="mt-2">
              Folder names must be 2–10 alphanumeric characters matching the set code exactly — for example <span className="font-mono text-white/80">SV2A</span>, <span className="font-mono text-white/80">XY</span>, or <span className="font-mono text-white/80">SWSH12</span>.
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="text-[11px] text-white/40 mb-1.5">Example</div>
              <pre className="text-[11px] text-white/60 leading-relaxed font-mono">{`batch.zip\n├── SV2A/\n│   ├── symbol.png\n│   └── 001.png\n├── SV2B/\n│   └── symbol.png\n└── SV3/\n    ├── 001.png\n    └── 002.png`}</pre>
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-white mb-2">Filename rules</div>
            <p>
              Card image filenames must contain a number — that number is extracted as the card number and zero-padded to three digits. The rest of the filename is ignored.
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/30 overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Filename</th>
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Card number</th>
                    <th className="text-left px-3 py-2 text-white/40 font-medium">Valid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    ["001.png", "001", true],
                    ["Blitzle-12-XY-Trainer-Kit.png", "012", true],
                    ["Potion-21.jpg", "021", true],
                    ["card.png", "—", false, "No number in filename"],
                    ["folder/001.png", "—", false, "Nested path not allowed"],
                    ["001.gif", "—", false, "Unsupported format"],
                  ].map(([filename, num, valid, reason]) => (
                    <tr key={filename}>
                      <td className="px-3 py-2 font-mono text-white/70">{filename}</td>
                      <td className="px-3 py-2 font-mono text-white/50">{num}</td>
                      <td className="px-3 py-2">
                        {valid
                          ? <span className="text-emerald-400">✓</span>
                          : <span className="text-red-400">✗{reason && <span className="ml-1.5 font-sans text-white/30 text-[11px]">{reason}</span>}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              To include a set symbol or logo, name the file <span className="font-mono text-white/80">symbol.png</span> or <span className="font-mono text-white/80">logo.png</span>. Supported formats: <span className="font-mono text-white/80">.png .jpg .jpeg .webp</span>
            </p>
          </div>

          <div>
            <div className="text-[12px] font-semibold text-white mb-2">Common errors</div>
            <div className="space-y-2">
              {[
                ["Missing image files for card numbers: 001, 002", "The zip is missing files for card numbers you declared. Check your filenames contain the right numbers."],
                ["Unexpected image files found in zip: 003", "The zip contains files you didn't declare. Either add the card number to your list or remove the file."],
                ["Nested file path not allowed", "Files must be at the root level in single-set mode, or one folder deep in batch mode."],
                ["Folder name \"xyz\" is not a valid set code", "Batch mode folder names must be 2–10 alphanumeric characters."],
                ["No valid set folders found in zip", "Batch mode zip had no recognisable set code folders."],
                ["Duplicate image file for card number \"001\"", "Two files in the zip resolved to the same card number. Rename or remove one."],
              ].map(([error, explanation]) => (
                <div key={error} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="font-mono text-[11px] text-red-400/80 mb-1">{error}</div>
                  <div className="text-[12px] text-white/50">{explanation}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ImageIntakeClient() {
  const [setCode, setSetCode] = useState("");
  const [cardNumbers, setCardNumbers] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [detectedMode, setDetectedMode] = useState(null);
  const [overrideDetection, setOverrideDetection] = useState(false);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  // Multi-set is locked when detected and not overridden
  const isMultiSetLocked = detectedMode === "multi" && !overrideDetection;

  // Effective multi-set: locked by detection, or set code is blank with no conflicting detection
  const effectiveIsMultiSet = isMultiSetLocked ||
    (setCode.trim().length === 0 && detectedMode !== "card" && detectedMode !== "symbol");

  const isSymbolOnly = !effectiveIsMultiSet && cardNumbers.trim().length === 0;

  const canSubmit = status !== "uploading" && zipFile !== null;
  const parsedNumbers = parseCardNumbersForPreview(cardNumbers);

  function deriveMode() {
    if (effectiveIsMultiSet) {
      if (detectedMode && detectedMode !== "unknown") return detectedMode;
      return "multi";
    }
    if (isSymbolOnly) return "symbol";
    return "card";
  }

  async function handleFile(file) {
    setZipFile(file);
    setDetectedMode(null);
    setOverrideDetection(false);
    setSetCode("");
    const detected = await detectZipMode(file);
    setDetectedMode(detected);
  }

  function handleToggleOverride() {
    setOverrideDetection((v) => {
      const next = !v;
      if (!next) setSetCode("");
      return next;
    });
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    setStatus("uploading");
    setResult(null);

    const formData = new FormData();
    if (!effectiveIsMultiSet) formData.append("setCode", setCode.trim());
    if (!effectiveIsMultiSet && !isSymbolOnly) formData.append("cardNumbers", cardNumbers.trim());
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
        setDetectedMode(null);
        setOverrideDetection(false);
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
    setDetectedMode(null);
    setOverrideDetection(false);
  }

  const mode = deriveMode();

  return (
    <Section
      eyebrow="Tool"
      title="Card Image Intake (V2)"
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
                  Set code <span className="text-white/30">(leave blank for multi-set zip)</span>
                </label>
                <input
                  value={setCode}
                  onChange={(e) => setSetCode(e.target.value.toUpperCase())}
                  placeholder={isMultiSetLocked ? "Auto-detected from folders" : "SV2A  —  or leave blank"}
                  disabled={status === "uploading" || isMultiSetLocked}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-white font-mono uppercase placeholder:text-white/20 outline-none focus:border-white/25 transition disabled:opacity-50"
                />
                {effectiveIsMultiSet && (
                  <div className="mt-1.5 text-[11px] text-blue-400/70">
                    Multi-set mode — set codes come from folder names
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-white/55 mb-1.5">
                  Card numbers{" "}
                  <span className="text-white/30">(comma-separated, leave blank to auto-resolve)</span>
                </label>
                <input
                  value={cardNumbers}
                  onChange={(e) => setCardNumbers(e.target.value)}
                  placeholder="1, 2, 10  —  or leave blank"
                  disabled={status === "uploading" || effectiveIsMultiSet}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-white font-mono placeholder:text-white/20 outline-none focus:border-white/25 transition disabled:opacity-50"
                />
                {isSymbolOnly && (
                  <div className="mt-1.5 text-[11px] text-amber-400/70">
                    Symbol-only mode — zip must contain only symbol.png / logo.png
                  </div>
                )}
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
              detectedMode={detectedMode}
              overrideDetection={overrideDetection}
              onToggleOverride={handleToggleOverride}
              onFile={handleFile}
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
                  {mode === "multi" ? "Upload batch" : mode === "symbol" ? "Upload symbol" : "Upload images"}
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
              <span className="text-[12px] text-white/30">Zip file required</span>
            )}
          </div>

          {result && <ResultPanel result={result} />}

          {/* ── Docs ───────────────────────────────────────────────── */}
          <DocsSection />
        </div>

        {/* ── RIGHT: Rules sidebar ────────────────────────────────── */}
        <div className="md:col-span-4">
          <RulesPanel mode={mode} />
        </div>
      </div>
    </Section>
  );
}
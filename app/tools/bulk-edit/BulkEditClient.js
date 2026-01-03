// app/tools/bulk-edit/BulkEditClient.js
//
// UPDATED (FULL FILE) — TRUE FULL SCREEN APP SHELL
//
// FIXED:
// - Actually full screen: w-screen + min-h based on viewport
// - Breaks out of any parent max-width wrapper using negative margins
// - Sticky toolbar
// - Independent scrolling panes on desktop
//
// HOW IT WORKS:
// - We define a CSS var for header height (--sbf-header-h). Default 64px.
// - App shell uses min-height: calc(100vh - headerHeight) so it fills the visible page.
// - The shell uses w-screen and negative margins to escape any centered layout constraints.
//
// TWEAKS YOU MAY NEED:
// - If your header is not ~64px tall, change DEFAULT_HEADER_H below.
// - If your page wrapper padding differs, adjust -mx-4 / md:-mx-6 to match.
//

"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../components/ui/Section";

const APP_STORE_KEY = "sbf_variant_editor_overrides_v1";

const TYPE_OPTIONS = ["normal", "reverse", "holo"];
const FOIL_OPTIONS = ["", "pokeball", "masterball"];

// If your header is 56px, change this to 56.
// This only affects the "fill viewport" height calculation.
const DEFAULT_HEADER_H = 64;

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function uniq(nums) {
  return Array.from(new Set((nums || []).filter(Boolean)));
}

function clampNonEmptyStr(s) {
  const v = String(s || "").trim();
  return v.length ? v : "";
}

function isLockedToBase(type, foil) {
  return (type === "normal" || type === "reverse") && !foil;
}

function makeVariantRow() {
  return { type: "normal", foil: "", stamp: "", cardmarket: "" };
}

function parseImported(json) {
  const byCardId = json?.byCardId || json?.cardIdToProductId || null;
  if (!byCardId || typeof byCardId !== "object") {
    throw new Error("Unsupported JSON: missing byCardId (or cardIdToProductId)");
  }

  const out = [];

  for (const [cardId, obj] of Object.entries(byCardId)) {
    const baseIds = uniq((obj?.ids?.base || []).map(Number));
    const additionalIds = uniq((obj?.ids?.additional || []).map(Number));
    const scalar = typeof obj === "number" ? obj : null;

    out.push({
      cardId,
      baseIds: baseIds.length ? baseIds : scalar ? [Number(scalar)] : [],
      additionalIds,
      raw: obj,
    });
  }

  out.sort((a, b) => {
    const am = a.cardId.match(/-(\d+)/);
    const bm = b.cardId.match(/-(\d+)/);
    if (am && bm) return Number(am[1]) - Number(bm[1]);
    return a.cardId.localeCompare(b.cardId);
  });

  return out;
}

function loadOverrides() {
  try {
    const raw = localStorage.getItem(APP_STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides) {
  localStorage.setItem(APP_STORE_KEY, JSON.stringify(overrides));
}

function ensureOverrideShape(overrides, cardId) {
  const next = { ...overrides };
  if (!next[cardId]) next[cardId] = { notes: "", variants: [] };
  if (!Array.isArray(next[cardId].variants)) next[cardId].variants = [];
  if (typeof next[cardId].notes !== "string") next[cardId].notes = "";
  return next;
}

function ensureAutofill(cardsById, overrides, cardId) {
  const card = cardsById.get(cardId);
  if (!card) return overrides;

  let next = ensureOverrideShape(overrides, cardId);
  const ov = { ...next[cardId] };
  const existing = [...(ov.variants || [])];

  const findVar = (type, foil) =>
    existing.find((v) => v.type === type && (v.foil || "") === (foil || ""));

  if (!findVar("normal", "")) existing.push({ type: "normal", foil: "", stamp: "", cardmarket: "" });
  if (!findVar("reverse", "")) existing.push({ type: "reverse", foil: "", stamp: "", cardmarket: "" });

  if (card.additionalIds.length) {
    if (!findVar("reverse", "pokeball"))
      existing.push({ type: "reverse", foil: "pokeball", stamp: "", cardmarket: "" });
    if (!findVar("reverse", "masterball"))
      existing.push({ type: "reverse", foil: "masterball", stamp: "", cardmarket: "" });

    if (card.additionalIds.length === 2) {
      const pb = findVar("reverse", "pokeball");
      const mb = findVar("reverse", "masterball");
      if (pb && !safeNum(pb.cardmarket)) pb.cardmarket = String(card.additionalIds[0]);
      if (mb && !safeNum(mb.cardmarket)) mb.cardmarket = String(card.additionalIds[1]);
    }
  }

  ov.variants = existing;
  next[cardId] = ov;
  return next;
}

function generateCodeBlock(card, override) {
  const baseId = safeNum(card?.baseIds?.[0]);

  const variants = (override?.variants || []).map((v) => ({
    type: clampNonEmptyStr(v.type) || "normal",
    foil: clampNonEmptyStr(v.foil) || "",
    stamp: clampNonEmptyStr(v.stamp) || "",
    cardmarket: clampNonEmptyStr(v.cardmarket) || "",
  }));

  const ordered = [
    ...variants.filter((v) => v.type === "normal" && !v.foil),
    ...variants.filter((v) => v.type === "reverse" && !v.foil),
    ...variants.filter((v) => v.type === "reverse" && !!v.foil),
    ...variants.filter(
      (v) =>
        !(
          (v.type === "normal" && !v.foil) ||
          (v.type === "reverse" && !v.foil) ||
          (v.type === "reverse" && !!v.foil)
        )
    ),
  ];

  const lines = [];
  lines.push("variants: [");

  for (const v of ordered) {
    let cm = safeNum(v.cardmarket);
    if (isLockedToBase(v.type, v.foil) && baseId) cm = baseId;

    const cmText = cm ? String(cm) : "/* MISSING_ID */";

    lines.push("\t{");
    lines.push(`\t\ttype: "${v.type}",`);
    if (v.foil) lines.push(`\t\tfoil: "${v.foil}",`);
    if (v.stamp) lines.push(`\t\tstamp: "${v.stamp}",`);
    lines.push("\t\tthirdParty: {");
    lines.push(`\t\t\tcardmarket: ${cmText}`);
    lines.push("\t\t}");
    lines.push("\t},");
  }

  lines.push("],");

  const needsBase = ordered.some((v) => isLockedToBase(v.type, v.foil)) && !baseId;

  return { text: lines.join("\n"), needsBase };
}

export default function BulkEditClient() {
  const fileInputRef = useRef(null);

  const [badge, setBadge] = useState("No file loaded");
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  const [overrides, setOverridesState] = useState({});
  const [copyStatus, setCopyStatus] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setOverridesState(loadOverrides());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") saveOverrides(overrides);
  }, [overrides]);

  // Ensure our header height CSS var exists (fallback)
  useEffect(() => {
    document.documentElement.style.setProperty("--sbf-header-h", `${DEFAULT_HEADER_H}px`);
    return () => {
      // don't remove var; harmless, but keep tidy:
      // document.documentElement.style.removeProperty("--sbf-header-h");
    };
  }, []);

  const cardsById = useMemo(() => {
    const m = new Map();
    for (const c of cards) m.set(c.cardId, c);
    return m;
  }, [cards]);

  const selectedCard = useMemo(
    () => (selectedCardId ? cardsById.get(selectedCardId) : null),
    [cardsById, selectedCardId]
  );

  const selectedOverride = useMemo(() => {
    if (!selectedCardId) return null;
    return overrides[selectedCardId] || { notes: "", variants: [] };
  }, [overrides, selectedCardId]);

  const filteredCards = useMemo(() => {
    const q = search.trim().toUpperCase();
    return cards.filter((c) => {
      if (q && !c.cardId.toUpperCase().includes(q)) return false;

      const hasBase = c.baseIds.length > 0;
      const hasAdd = c.additionalIds.length > 0;

      if (filterMode === "needs") return !hasBase;
      if (filterMode === "hasAdd") return hasAdd;
      return true;
    });
  }, [cards, search, filterMode]);

  const output = useMemo(() => {
    if (!selectedCard || !selectedOverride) return { text: "", needsBase: false };
    return generateCodeBlock(selectedCard, selectedOverride);
  }, [selectedCard, selectedOverride]);

  function setOverrides(updater) {
    setOverridesState((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }

  function resetAll() {
    setCards([]);
    setSelectedCardId(null);
    setOverridesState({});
    localStorage.removeItem(APP_STORE_KEY);
    setBadge("No file loaded");
    setCopyStatus("");
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function loadSample() {
    const sample = {
      byCardId: {
        "PRE-001": { ids: { base: [805390], additional: [806408, 806409] } },
        "PRE-002": { ids: { base: [805391], additional: [] } },
        "PRE-003": { ids: { base: [], additional: [810420] } },
      },
    };
    handleJson(sample);
  }

  function handleJson(json) {
    const parsed = parseImported(json);
    setCards(parsed);
    setBadge(`Loaded ${parsed.length} cards`);
    if (selectedCardId && !parsed.find((c) => c.cardId === selectedCardId)) {
      setSelectedCardId(null);
    }
  }

  async function handleFileObject(file) {
    if (!file) return;

    const name = (file.name || "").toLowerCase();
    const isJson = file.type === "application/json" || name.endsWith(".json");

    if (!isJson) {
      setBadge("Upload a .json file");
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      handleJson(json);
      setBadge(`Loaded ${file.name}`);
    } catch (err) {
      console.error("Failed to load JSON:", err);
      setBadge(`Failed to load JSON (${file.name || "file"})`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onFileChange(e) {
    const f = e.target.files?.[0];
    await handleFileObject(f);
  }

  function selectCard(cardId) {
    setSelectedCardId(cardId);
    setOverrides((prev) => ensureAutofill(cardsById, prev, cardId));
  }

  function setNotes(value) {
    if (!selectedCardId) return;
    setOverrides((prev) => {
      let next = ensureOverrideShape(prev, selectedCardId);
      next = { ...next, [selectedCardId]: { ...next[selectedCardId], notes: value } };
      return next;
    });
  }

  function autofillNow() {
    if (!selectedCardId) return;
    setOverrides((prev) => ensureAutofill(cardsById, prev, selectedCardId));
  }

  function addVariant() {
    if (!selectedCardId) return;
    setOverrides((prev) => {
      let next = ensureOverrideShape(prev, selectedCardId);
      const ov = { ...next[selectedCardId] };
      ov.variants = [...(ov.variants || []), makeVariantRow()];
      return { ...next, [selectedCardId]: ov };
    });
  }

  function clearOverridesForCard() {
    if (!selectedCardId) return;
    setOverrides((prev) =>
      ensureAutofill(cardsById, { ...prev, [selectedCardId]: { notes: "", variants: [] } }, selectedCardId)
    );
  }

  function removeVariant(idx) {
    if (!selectedCardId) return;
    setOverrides((prev) => {
      let next = ensureOverrideShape(prev, selectedCardId);
      const ov = { ...next[selectedCardId] };
      const v = [...(ov.variants || [])];
      v.splice(idx, 1);
      ov.variants = v;
      return { ...next, [selectedCardId]: ov };
    });
  }

  function updateVariant(idx, key, value) {
    if (!selectedCardId) return;

    setOverrides((prev) => {
      let next = ensureOverrideShape(prev, selectedCardId);
      const ov = { ...next[selectedCardId] };
      const v = [...(ov.variants || [])];
      const row = { ...(v[idx] || makeVariantRow()) };

      row[key] = value;

      if ((key === "type" || key === "foil") && isLockedToBase(row.type, row.foil)) {
        row.cardmarket = "";
      }

      v[idx] = row;
      ov.variants = v;
      return { ...next, [selectedCardId]: ov };
    });
  }

  async function copyBlock() {
    if (!output.text) return;
    try {
      await navigator.clipboard.writeText(output.text);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 900);
    } catch (err) {
      console.error("Clipboard write failed:", err);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 1100);
    }
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  async function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer?.files?.[0];
    await handleFileObject(f);
  }

  // Fullscreen height: viewport - header
  const appHeightClass = "min-h-[calc(100vh-var(--sbf-header-h))]";

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className={`w-screen ${appHeightClass} -mx-4 md:-mx-6`}>
        {/* Give the app its own padding */}
        <div className="px-4 md:px-6 py-4">
          <Section
            eyebrow="Tool"
            title="Bulk Edit UI (Variant Editor)"
            subtitle="Upload a Cardmarket export JSON, edit variants, and generate a stable code block. Free to use."
            showDivider={false}
            fullBleed={true}
          >
            {/* APP SHELL */}
            <div className={`mt-4 ${appHeightClass}`}>
              {/* Sticky toolbar */}
              <div
                className={[
                  "surface p-4 md:p-5 mb-4 transition sticky top-[64px] z-10",
                  "backdrop-blur",
                  isDragging ? "border-white/25 bg-white/[0.06]" : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div className="flex items-center gap-3 flex-wrap">
    <div className="text-[14px] md:text-[16px] font-semibold text-white">
      Card Variant Editor
    </div>
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70">
      {badge}
    </span>

    {isDragging && (
      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[12px] text-white/80">
        Drop JSON to import
      </span>
    )}
  </div>

  <div className="flex items-center gap-2 flex-wrap">
    <input
      ref={fileInputRef}
      type="file"
      accept="application/json,.json"
      onChange={onFileChange}
      className="sr-only"
    />

    <button
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
      onClick={() => fileInputRef.current?.click()}
      type="button"
    >
      Upload JSON
    </button>

    {/* ✅ NEW: link button to exporter page */}
    <Link
      href="/tools/cardmarket-exporter"
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
    >
      Get exporter script
    </Link>

    <button
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
      onClick={loadSample}
      type="button"
    >
      Load sample
    </button>

    <button
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
      onClick={resetAll}
      type="button"
    >
      Reset
    </button>
  </div>
</div>

                <div className="mt-3 text-[12px] text-white/55">
                  Tip: you can drag & drop a <b>.json</b> anywhere on this page to import it.
                </div>
              </div>

              {/* Desktop: fixed-height 2-pane app with independent scrolling */}
              <div className="grid gap-4 md:grid-cols-12">
                {/* LEFT: cards pane */}
                <div className="md:col-span-7">
                  <div className="surface p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-[12px] font-semibold text-white">Cards</div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                        {filteredCards.length} cards
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-12">
                      <div className="md:col-span-8">
                        <label className="block text-[11px] text-white/55 mb-2">Search cardId</label>
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="e.g. PRE-051"
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-[11px] text-white/55 mb-2">Filter</label>
                        <select
                          value={filterMode}
                          onChange={(e) => setFilterMode(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                        >
                          <option value="all">All</option>
                          <option value="needs">Needs attention (missing base id)</option>
                          <option value="hasAdd">Has additionals</option>
                        </select>
                      </div>
                    </div>

                    {!cards.length ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px] text-white/70">
                        Import a JSON file produced by your Cardmarket merge exporter.
                        <div className="mt-2 text-white/60">
                          Expected shape:{" "}
                          <b>
                            {"{ byCardId: { \"PRE-001\": { ids: { base: [], additional: [] } } } }"}
                          </b>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-4">
                        {filteredCards.map((c) => {
                          const hasBase = c.baseIds.length > 0;
                          const hasAdd = c.additionalIds.length > 0;
                          const isSelected = c.cardId === selectedCardId;
                          const note = (overrides[c.cardId]?.notes || "").trim();

                          return (
                            <button
                              key={c.cardId}
                              onClick={() => selectCard(c.cardId)}
                              className={[
                                "text-left rounded-2xl border px-3 py-3 transition",
                                "bg-black/30 hover:bg-black/40",
                                isSelected ? "border-white/30" : "border-white/10",
                              ].join(" ")}
                              type="button"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-[12px] font-semibold text-white">{c.cardId}</div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/65">
                                  {hasAdd ? "has add" : "base only"}
                                </span>
                              </div>

                              <div className="mt-2 text-[11px] text-white/65 space-y-1">
                                <div>
                                  base:{" "}
                                  <span className="text-white/85 font-semibold">
                                    {hasBase ? c.baseIds.join(", ") : "—"}
                                  </span>
                                </div>
                                <div>
                                  add:{" "}
                                  <span className="text-white/85 font-semibold">
                                    {hasAdd ? c.additionalIds.join(", ") : "—"}
                                  </span>
                                </div>
                              </div>

                              {!hasBase && (
                                <div className="mt-2 text-[11px] text-red-200/80">
                                  Missing base id — base-locked variants can’t be enforced
                                </div>
                              )}

                              {note && <div className="mt-2 text-[11px] text-white/60">📝 {note}</div>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: editor + docs */}
                <div className="md:col-span-5">
                  <div className="surface p-4 md:p-5">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-[12px] font-semibold text-white">Editor</div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={autofillNow}
                          type="button"
                          disabled={!selectedCardId}
                        >
                          Autofill variants
                        </button>
                        <button
                          className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={copyBlock}
                          type="button"
                          disabled={!output.text}
                        >
                          Copy block
                        </button>
                      </div>
                    </div>

                    {!selectedCardId ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px] text-white/70">
                        Select a card from the grid to edit its variants.
                        <div className="mt-3 text-white/60">
                          Rules enforced: <b>normal</b> and <b>reverse</b> with no foil always use the{" "}
                          <b>base</b> Cardmarket ID.
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                          <div className="text-[14px] font-semibold text-white">{selectedCardId}</div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/65">
                            base: {selectedCard?.baseIds?.[0] ? selectedCard.baseIds[0] : "—"}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/65">
                            additionals: {selectedCard?.additionalIds?.length || 0}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div>
                            <label className="block text-[11px] text-white/55 mb-2">
                              Base Cardmarket ID (locked to normal/reverse with no foil)
                            </label>
                            <input
                              disabled
                              value={selectedCard?.baseIds?.[0] ? String(selectedCard.baseIds[0]) : ""}
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white/80 outline-none"
                            />
                            <div className="mt-2 text-[11px] text-white/50">
                              Comes from <code>ids.base[0]</code>.
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-white/55 mb-2">
                              Notes (optional, local only)
                            </label>
                            <input
                              value={selectedOverride?.notes || ""}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="e.g. needs pokeball/masterball mapping"
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2 flex-wrap">
                          <button
                            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition"
                            onClick={addVariant}
                            type="button"
                          >
                            Add variant
                          </button>
                          <button
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
                            onClick={clearOverridesForCard}
                            type="button"
                          >
                            Clear overrides
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {(selectedOverride?.variants || []).map((v, idx) => {
                            const locked = isLockedToBase(v.type, v.foil);

                            return (
                              <div
                                key={`${idx}-${v.type}-${v.foil}`}
                                className="rounded-2xl border border-white/10 bg-black/30 p-3"
                              >
                                <div className="grid gap-3 md:grid-cols-2">
                                  <div>
                                    <label className="block text-[11px] text-white/55 mb-2">Type</label>
                                    <select
                                      value={v.type}
                                      onChange={(e) => updateVariant(idx, "type", e.target.value)}
                                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                                    >
                                      {TYPE_OPTIONS.map((t) => (
                                        <option key={t} value={t}>
                                          {t}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-white/55 mb-2">Foil</label>
                                    <select
                                      value={v.foil || ""}
                                      onChange={(e) => updateVariant(idx, "foil", e.target.value)}
                                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                                    >
                                      {FOIL_OPTIONS.map((f) => (
                                        <option key={f || "none"} value={f}>
                                          {f ? f : "none"}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-white/55 mb-2">Stamp</label>
                                    <input
                                      value={v.stamp || ""}
                                      onChange={(e) => updateVariant(idx, "stamp", e.target.value)}
                                      placeholder="optional"
                                      className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] text-white/55 mb-2">Cardmarket ID</label>
                                    <input
                                      value={v.cardmarket || ""}
                                      onChange={(e) => updateVariant(idx, "cardmarket", e.target.value)}
                                      type="number"
                                      disabled={locked}
                                      placeholder={locked ? "locked to base" : "e.g. 805390"}
                                      className={[
                                        "w-full rounded-xl border px-3 py-2 text-[13px] outline-none",
                                        "bg-black/30 text-white",
                                        locked ? "border-white/5 text-white/60" : "border-white/10",
                                      ].join(" ")}
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                  <button
                                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[12px] font-semibold text-red-200 hover:bg-red-500/10 transition"
                                    onClick={() => removeVariant(idx)}
                                    type="button"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4">
                          <label className="block text-[11px] text-white/55 mb-2">Generated code block</label>
                          <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] text-white/80">
                            <code>{output.text}</code>
                          </pre>

                          <div className="mt-3 flex items-center gap-3 flex-wrap">
                            <button
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={copyBlock}
                              type="button"
                              disabled={!output.text}
                            >
                              Copy block
                            </button>

                            {copyStatus ? (
                              <span className="text-[12px] text-green-300">{copyStatus}</span>
                            ) : output.needsBase ? (
                              <span className="text-[12px] text-red-200/80">
                                ⚠ Base id missing — normal/reverse (no foil) can’t be locked.
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="surface p-4 md:p-5 mt-4">
                    <div className="text-[12px] font-semibold text-white">Documentation</div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">Expected JSON shape:</p>
                    <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] text-white/80">
                      <code>{`{
  "byCardId": {
    "PRE-001": { "ids": { "base": [805390], "additional": [806408, 806409] } }
  }
}`}</code>
                    </pre>
                    <ul className="mt-2 space-y-1 text-[13px] text-white/75">
                      <li>• normal (no foil) uses ids.base[0]</li>
                      <li>• reverse (no foil) uses ids.base[0]</li>
                      <li>• foil variants should use ids.additional</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// app/tools/bulk-edit/BulkEditClient.js
// MULTI-SOURCE VARIANT EDITOR v5
// UPDATED (2026-03-07)
//
// CHANGES
// - ADDED: Independent scroll areas for the card list and editor panel.
// - ADDED: Desktop panel height management using a shared viewport-based content area.
// - CHANGED: Cards panel now uses an internal scroll container instead of growing the full page.
// - CHANGED: Editor panel now scrolls internally so the card list and editor can be used side-by-side.
// - CHANGED: Layout wrappers now use min-h-0 / flex-1 patterns so nested overflow works correctly.
// - PRESERVED: Cardmarket product name + variant label support, legacy fallback mapping, and matched product display.

"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../components/ui/Section";

const APP_STORE_KEY = "sbf_variant_editor_overrides_v3";
const TYPE_OPTIONS = ["normal", "reverse", "holo"];
const FOIL_OPTIONS = ["", "pokeball", "masterball", "loveball", "friendball", "quickball", "team-rocket", "duskball", "energy"];
const DEFAULT_HEADER_H = 64;

function safeNum(v) { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; }
function uniq(nums) { return Array.from(new Set((nums || []).filter(Boolean))); }
function clampNonEmptyStr(s) { const v = String(s || "").trim(); return v.length ? v : ""; }
function isLockedToBase(type, foil) { return (type === "normal" || type === "reverse") && !foil; }
function makeVariantRow() { return { type: "normal", foil: "", stamp: "", cardmarket: "", tcgplayer: "" }; }

const TCGPLAYER_FOIL_PATTERNS = [
  { pattern: /master\s*ball/i, foil: "masterball" },
  { pattern: /poke\s*ball|poké\s*ball/i, foil: "pokeball" },
  { pattern: /love\s*ball/i, foil: "loveball" },
  { pattern: /friend\s*ball/i, foil: "friendball" },
  { pattern: /quick\s*ball/i, foil: "quickball" },
  { pattern: /team[\s-]*rocket/i, foil: "team-rocket" },
  { pattern: /dusk\s*ball/i, foil: "duskball" },
  { pattern: /energy\s*symbol/i, foil: "energy" },
];

function inferFoilFromTCGPlayerName(name) {
  const n = String(name || "");
  for (const { pattern, foil } of TCGPLAYER_FOIL_PATTERNS) {
    if (pattern.test(n)) return foil;
  }
  return "";
}

function IdLink({ id, source }) {
  const numId = safeNum(id);
  if (!numId) return null;
  if (source === "tcgplayer") {
    return (
      <a href={`https://www.tcgplayer.com/product/${numId}`} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-0.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition"
        title={`View on TCGPlayer (${numId})`}>↗ TCG</a>
    );
  }
  if (source === "cardmarket") {
    return (
      <a href={`https://product-images.s3.cardmarket.com/51/ASC/${numId}/${numId}.jpg`} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-0.5 text-[10px] text-white/50 hover:text-white/80 transition"
        title={`View card image (product ${numId})`}>↗ img</a>
    );
  }
  return null;
}

function parseToMap(json) {
  const byCardId = json?.byCardId || json?.cardIdToProductId || null;
  if (!byCardId || typeof byCardId !== "object") throw new Error("Unsupported JSON: missing byCardId");

  const map = new Map();

  for (const [cardId, obj] of Object.entries(byCardId)) {
    const baseIds = uniq((obj?.ids?.base || []).map(Number));
    const additionalIds = uniq((obj?.ids?.additional || []).map(Number));
    const tcgplayerIds = uniq((obj?.ids?.tcgplayer || []).map(Number));

    const tcgplayerProducts = Array.isArray(obj?.tcgplayerProducts)
      ? obj.tcgplayerProducts
      : [];

    const cardmarketProducts = Array.isArray(obj?.cardmarketProducts)
      ? obj.cardmarketProducts.map((p) => ({
          productId: Number(p.productId),
          name: p.name || "",
          variantLabel: p.variantLabel || "",
          bucket: p.bucket || "",
          rawCardId: p.rawCardId || "",
          canonicalCardId: p.canonicalCardId || cardId,
          setSlug: p.setSlug || "",
          setName: p.setName || "",
          url: p.url || "",
        }))
      : Array.isArray(obj?.sources)
        ? obj.sources
            .filter((s) => Number.isFinite(Number(s?.productId)))
            .map((s) => ({
              productId: Number(s.productId),
              name: s.name || "",
              variantLabel: s.variantLabel || "",
              bucket: s.bucket || "",
              rawCardId: s.rawCardId || "",
              canonicalCardId: cardId,
              setSlug: s.setSlug || "",
              setName: s.setName || "",
              url: s.url || "",
            }))
        : [];

    const scalar = typeof obj === "number" ? obj : null;

    map.set(cardId, {
      cardId,
      baseIds: baseIds.length ? baseIds : scalar ? [Number(scalar)] : [],
      additionalIds,
      tcgplayerIds,
      tcgplayerProducts,
      cardmarketProducts,
      raw: obj,
    });
  }

  return map;
}

function mergeMaps(existing, incoming) {
  const merged = new Map(existing);

  for (const [cardId, inc] of incoming) {
    if (merged.has(cardId)) {
      const cur = merged.get(cardId);

      merged.set(cardId, {
        cardId,
        baseIds: uniq([...cur.baseIds, ...inc.baseIds]),
        additionalIds: uniq([...cur.additionalIds, ...inc.additionalIds]),
        tcgplayerIds: uniq([...cur.tcgplayerIds, ...inc.tcgplayerIds]),

        tcgplayerProducts: [
          ...cur.tcgplayerProducts,
          ...inc.tcgplayerProducts.filter((ip) => !cur.tcgplayerProducts.some((cp) => cp.productId === ip.productId)),
        ],

        cardmarketProducts: [
          ...(cur.cardmarketProducts || []),
          ...(inc.cardmarketProducts || []).filter(
            (ip) => !(cur.cardmarketProducts || []).some((cp) => cp.productId === ip.productId)
          ),
        ],

        raw: { ...cur.raw, ...inc.raw },
      });
    } else {
      merged.set(cardId, {
        ...inc,
        cardmarketProducts: inc.cardmarketProducts || [],
      });
    }
  }

  return merged;
}

function mapToSortedArray(map) {
  return [...map.values()].sort((a, b) => {
    const am = a.cardId.match(/-(\d+)/); const bm = b.cardId.match(/-(\d+)/);
    if (am && bm) return Number(am[1]) - Number(bm[1]);
    return a.cardId.localeCompare(b.cardId);
  });
}

function loadOverrides() { try { const raw = localStorage.getItem(APP_STORE_KEY); return raw ? JSON.parse(raw) : {}; } catch { return {}; } }
function saveOverrides(overrides) { localStorage.setItem(APP_STORE_KEY, JSON.stringify(overrides)); }
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
  const findVar = (type, foil) => existing.find((v) => v.type === type && (v.foil || "") === (foil || ""));

  if (!findVar("normal", "")) existing.push(makeVariantRow());
  if (!findVar("reverse", "")) existing.push({ ...makeVariantRow(), type: "reverse" });

  if (card.tcgplayerProducts.length) {
    for (const tp of card.tcgplayerProducts) {
      const foil = inferFoilFromTCGPlayerName(tp.name);
      if (!foil) {
        const normal = findVar("normal", ""); const reverse = findVar("reverse", "");
        if (normal && !safeNum(normal.tcgplayer)) normal.tcgplayer = String(tp.productId);
        if (reverse && !safeNum(reverse.tcgplayer)) reverse.tcgplayer = String(tp.productId);
      } else {
        let row = findVar("reverse", foil);
        if (!row) { row = { type: "reverse", foil, stamp: "", cardmarket: "", tcgplayer: "" }; existing.push(row); }
        if (!safeNum(row.tcgplayer)) row.tcgplayer = String(tp.productId);
      }
    }
  }

  if (card.additionalIds.length) {
    const foilRows = existing.filter((v) => v.type === "reverse" && v.foil);
    const foilRowsWithTcg = foilRows.filter((r) => safeNum(r.tcgplayer));
    if (foilRowsWithTcg.length > 0 && card.additionalIds.length <= foilRowsWithTcg.length) {
      for (let i = 0; i < card.additionalIds.length; i++) {
        if (i < foilRowsWithTcg.length && !safeNum(foilRowsWithTcg[i].cardmarket)) foilRowsWithTcg[i].cardmarket = String(card.additionalIds[i]);
      }
    } else if (card.additionalIds.length === 2 && !card.tcgplayerProducts.length) {
      if (!findVar("reverse", "pokeball")) existing.push({ type: "reverse", foil: "pokeball", stamp: "", cardmarket: "", tcgplayer: "" });
      if (!findVar("reverse", "masterball")) existing.push({ type: "reverse", foil: "masterball", stamp: "", cardmarket: "", tcgplayer: "" });
      const pb = findVar("reverse", "pokeball"); const mb = findVar("reverse", "masterball");
      if (pb && !safeNum(pb.cardmarket)) pb.cardmarket = String(card.additionalIds[0]);
      if (mb && !safeNum(mb.cardmarket)) mb.cardmarket = String(card.additionalIds[1]);
    } else if (!card.tcgplayerProducts.length) {
      if (!findVar("reverse", "pokeball")) existing.push({ type: "reverse", foil: "pokeball", stamp: "", cardmarket: "", tcgplayer: "" });
      if (!findVar("reverse", "masterball")) existing.push({ type: "reverse", foil: "masterball", stamp: "", cardmarket: "", tcgplayer: "" });
    }
  }

  ov.variants = existing; next[cardId] = ov; return next;
}

function generateCodeBlock(card, override) {
  const baseId = safeNum(card?.baseIds?.[0]);
  let baseTcgId = null;
  if (card?.tcgplayerProducts?.length) {
    const bp = card.tcgplayerProducts.find((tp) => !inferFoilFromTCGPlayerName(tp.name));
    if (bp) baseTcgId = bp.productId;
  }
  const variants = (override?.variants || []).map((v) => ({
    type: clampNonEmptyStr(v.type) || "normal", foil: clampNonEmptyStr(v.foil) || "",
    stamp: clampNonEmptyStr(v.stamp) || "", cardmarket: clampNonEmptyStr(v.cardmarket) || "",
    tcgplayer: clampNonEmptyStr(v.tcgplayer) || "",
  }));
  const ordered = [
    ...variants.filter((v) => v.type === "normal" && !v.foil),
    ...variants.filter((v) => v.type === "reverse" && !v.foil),
    ...variants.filter((v) => v.type === "reverse" && !!v.foil),
    ...variants.filter((v) => !((v.type === "normal" && !v.foil) || (v.type === "reverse" && !v.foil) || (v.type === "reverse" && !!v.foil))),
  ];
  const lines = ["variants: ["];
  for (const v of ordered) {
    let cm = safeNum(v.cardmarket); let tcg = safeNum(v.tcgplayer);
    if (isLockedToBase(v.type, v.foil)) { if (baseId) cm = baseId; if (baseTcgId) tcg = baseTcgId; }
    lines.push("\t{");
    lines.push(`\t\ttype: "${v.type}",`);
    if (v.foil) lines.push(`\t\tfoil: "${v.foil}",`);
    if (v.stamp) lines.push(`\t\tstamp: "${v.stamp}",`);
    lines.push("\t\tthirdParty: {");
    lines.push(`\t\t\tcardmarket: ${cm || "/* MISSING_ID */"},`);
    lines.push(`\t\t\ttcgplayer: ${tcg || "/* MISSING_ID */"}`);
    lines.push("\t\t}");
    lines.push("\t},");
  }
  lines.push("],");
  return { text: lines.join("\n"), needsBase: ordered.some((v) => isLockedToBase(v.type, v.foil)) && !baseId && !baseTcgId };
}

function getEffectiveCmId(v, card) {
  if (isLockedToBase(v.type, v.foil)) return card?.baseIds?.[0] || null;
  return safeNum(v.cardmarket) ? Number(v.cardmarket) : null;
}
function getEffectiveTcgId(v, card) {
  if (isLockedToBase(v.type, v.foil)) {
    const bp = card?.tcgplayerProducts?.find((tp) => !inferFoilFromTCGPlayerName(tp.name));
    return bp?.productId || null;
  }
  return safeNum(v.tcgplayer) ? Number(v.tcgplayer) : null;
}

function getCardmarketProductById(card, productId) {
  const numId = safeNum(productId);
  if (!card || !numId) return null;
  return (card.cardmarketProducts || []).find((p) => Number(p.productId) === Number(numId)) || null;
}

function getTcgplayerProductById(card, productId) {
  const numId = safeNum(productId);
  if (!card || !numId) return null;
  return (card.tcgplayerProducts || []).find((p) => Number(p.productId) === Number(numId)) || null;
}

function formatVariantLabel(label) {
  const v = String(label || "").trim();
  if (!v) return "";
  return v
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BulkEditClient() {
  const cmFileRef = useRef(null);
  const tcgFileRef = useRef(null);
  const [sources, setSources] = useState({ cardmarket: false, tcgplayer: false });
  const [cardMapRaw, setCardMapRaw] = useState(new Map());
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [overrides, setOverridesState] = useState({});
  const [copyStatus, setCopyStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => { setOverridesState(loadOverrides()); }, []);
  useEffect(() => { if (typeof window !== "undefined") saveOverrides(overrides); }, [overrides]);
  useEffect(() => { document.documentElement.style.setProperty("--sbf-header-h", `${DEFAULT_HEADER_H}px`); }, []);
  useEffect(() => { setCards(mapToSortedArray(cardMapRaw)); }, [cardMapRaw]);

  const cardsById = useMemo(() => { const m = new Map(); for (const c of cards) m.set(c.cardId, c); return m; }, [cards]);
  const selectedCard = useMemo(() => (selectedCardId ? cardsById.get(selectedCardId) : null), [cardsById, selectedCardId]);
  const selectedOverride = useMemo(() => { if (!selectedCardId) return null; return overrides[selectedCardId] || { notes: "", variants: [] }; }, [overrides, selectedCardId]);
  const filteredCards = useMemo(() => {
    const q = search.trim().toUpperCase();
    return cards.filter((c) => {
      if (q && !c.cardId.toUpperCase().includes(q)) return false;
      const hasBase = c.baseIds.length > 0; const hasAdd = c.additionalIds.length > 0; const hasTcg = c.tcgplayerIds.length > 0;
      if (filterMode === "needs") return !hasBase && !hasTcg;
      if (filterMode === "hasAdd") return hasAdd;
      if (filterMode === "hasTcg") return hasTcg;
      if (filterMode === "hasBoth") return hasBase && hasTcg;
      if (filterMode === "missingOne") return (hasBase && !hasTcg) || (!hasBase && hasTcg);
      return true;
    });
  }, [cards, search, filterMode]);
  const output = useMemo(() => {
    if (!selectedCard || !selectedOverride) return { text: "", needsBase: false };
    return generateCodeBlock(selectedCard, selectedOverride);
  }, [selectedCard, selectedOverride]);

  function setOverrides(updater) { setOverridesState((prev) => (typeof updater === "function" ? updater(prev) : updater)); }

  async function handleFileObject(file, sourceType) {
    if (!file) return;
    if (!(file.name || "").toLowerCase().endsWith(".json") && file.type !== "application/json") { setStatusMsg("Upload a .json file"); return; }
    try {
      const json = JSON.parse(await file.text()); const incoming = parseToMap(json);
      setCardMapRaw((prev) => mergeMaps(prev, incoming));
      setSources((prev) => ({ ...prev, [sourceType]: true }));
      setStatusMsg(`Merged ${incoming.size} cards from ${sourceType} (${file.name})`);
    } catch (err) { setStatusMsg(`Failed: ${err.message}`); }
  }
  async function handleDropFile(file) {
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      const sourceType = (json?.meta?.tool || "").includes("tcgplayer") ? "tcgplayer" : "cardmarket";
      const incoming = parseToMap(json);
      setCardMapRaw((prev) => mergeMaps(prev, incoming));
      setSources((prev) => ({ ...prev, [sourceType]: true }));
      setStatusMsg(`Merged ${incoming.size} cards from ${sourceType} (${file.name})`);
    } catch (err) { setStatusMsg(`Failed: ${err.message}`); }
  }
  function resetAll() {
    setCardMapRaw(new Map()); setCards([]); setSelectedCardId(null); setOverridesState({});
    localStorage.removeItem(APP_STORE_KEY); setSources({ cardmarket: false, tcgplayer: false });
    setStatusMsg(""); setCopyStatus(""); setIsDragging(false);
    if (cmFileRef.current) cmFileRef.current.value = ""; if (tcgFileRef.current) tcgFileRef.current.value = "";
  }
  function loadSample() {
    const sample = { meta: { tool: "sample" }, byCardId: {
      "ASC-001": { ids: { base: [869612], additional: [870135, 870136], tcgplayer: [675813, 676852, 676992] },
        cardmarketProducts: [
          { productId: 869612, name: "Erika's Oddish", variantLabel: "", bucket: "base", canonicalCardId: "ASC-001" },
          { productId: 870135, name: "Erika's Oddish (Poke Ball)", variantLabel: "pokeball", bucket: "additional", canonicalCardId: "ASC-001" },
          { productId: 870136, name: "Erika's Oddish (Energy Symbol Pattern)", variantLabel: "energy", bucket: "additional", canonicalCardId: "ASC-001" },
        ],
        tcgplayerProducts: [
          { productId: 675813, name: "Erika's Oddish", rarity: "Common", printings: ["Normal"] },
          { productId: 676852, name: "Erika's Oddish (Poke Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 676992, name: "Erika's Oddish (Energy Symbol Pattern)", rarity: "Common", printings: ["Reverse Holofoil"] },
        ] },
      "ASC-007": { ids: { base: [869618], additional: [870106, 870145, 870146], tcgplayer: [675819, 676858, 676998, 677050, 677100, 677150, 677200, 677250] },
        cardmarketProducts: [
          { productId: 869618, name: "Erika's Tangela", variantLabel: "", bucket: "base", canonicalCardId: "ASC-007" },
          { productId: 870106, name: "Erika's Tangela (Poke Ball)", variantLabel: "pokeball", bucket: "additional", canonicalCardId: "ASC-007" },
          { productId: 870145, name: "Erika's Tangela (Love Ball)", variantLabel: "loveball", bucket: "additional", canonicalCardId: "ASC-007" },
          { productId: 870146, name: "Erika's Tangela (Energy Symbol Pattern)", variantLabel: "energy", bucket: "additional", canonicalCardId: "ASC-007" },
        ],
        tcgplayerProducts: [
          { productId: 675819, name: "Erika's Tangela", rarity: "Common", printings: ["Normal"] },
          { productId: 676858, name: "Erika's Tangela (Poke Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 676998, name: "Erika's Tangela (Energy Symbol Pattern)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 677050, name: "Erika's Tangela (Love Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 677100, name: "Erika's Tangela (Friend Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 677150, name: "Erika's Tangela (Quick Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 677200, name: "Erika's Tangela (Team Rocket)", rarity: "Common", printings: ["Reverse Holofoil"] },
          { productId: 677250, name: "Erika's Tangela (Dusk Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
        ] },
      "ASC-003": { ids: { base: [869614], additional: [], tcgplayer: [675815] },
        cardmarketProducts: [{ productId: 869614, name: "Erika's Vileplume ex", variantLabel: "", bucket: "base", canonicalCardId: "ASC-003" }],
        tcgplayerProducts: [{ productId: 675815, name: "Erika's Vileplume ex", rarity: "Double Rare", printings: ["Holofoil"] }] },
    }};
    setCardMapRaw(parseToMap(sample)); setSources({ cardmarket: true, tcgplayer: true });
    setStatusMsg("Loaded sample (3 cards, both sources, all foil types)");
  }

  function selectCard(cardId) { setSelectedCardId(cardId); setOverrides((prev) => ensureAutofill(cardsById, prev, cardId)); }
  function setNotes(value) { if (!selectedCardId) return; setOverrides((prev) => { let next = ensureOverrideShape(prev, selectedCardId); return { ...next, [selectedCardId]: { ...next[selectedCardId], notes: value } }; }); }
  function autofillNow() { if (!selectedCardId) return; setOverrides((prev) => ensureAutofill(cardsById, prev, selectedCardId)); }
  function addVariant() { if (!selectedCardId) return; setOverrides((prev) => { let next = ensureOverrideShape(prev, selectedCardId); const ov = { ...next[selectedCardId] }; ov.variants = [...(ov.variants || []), makeVariantRow()]; return { ...next, [selectedCardId]: ov }; }); }
  function clearOverridesForCard() { if (!selectedCardId) return; setOverrides((prev) => ensureAutofill(cardsById, { ...prev, [selectedCardId]: { notes: "", variants: [] } }, selectedCardId)); }
  function removeVariant(idx) { if (!selectedCardId) return; setOverrides((prev) => { let next = ensureOverrideShape(prev, selectedCardId); const ov = { ...next[selectedCardId] }; const v = [...(ov.variants || [])]; v.splice(idx, 1); ov.variants = v; return { ...next, [selectedCardId]: ov }; }); }
  function updateVariant(idx, key, value) {
    if (!selectedCardId) return;
    setOverrides((prev) => {
      let next = ensureOverrideShape(prev, selectedCardId); const ov = { ...next[selectedCardId] };
      const v = [...(ov.variants || [])]; const row = { ...(v[idx] || makeVariantRow()) }; row[key] = value;
      if ((key === "type" || key === "foil") && isLockedToBase(row.type, row.foil)) { row.cardmarket = ""; row.tcgplayer = ""; }
      v[idx] = row; ov.variants = v; return { ...next, [selectedCardId]: ov };
    });
  }
  async function copyBlock() { if (!output.text) return; try { await navigator.clipboard.writeText(output.text); setCopyStatus("Copied!"); setTimeout(() => setCopyStatus(""), 900); } catch { setCopyStatus("Copy failed"); setTimeout(() => setCopyStatus(""), 1100); } }
  function onDragOver(e) { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }
  function onDragLeave(e) { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }
  async function onDrop(e) { e.preventDefault(); e.stopPropagation(); setIsDragging(false); await handleDropFile(e.dataTransfer?.files?.[0]); }

  const appHeightClass = "min-h-[calc(100vh-var(--sbf-header-h))]";
  const desktopPanelsHeightClass = "md:h-[calc(100vh-var(--sbf-header-h)-12.5rem)]";
  const sourceBadge = [sources.cardmarket ? "CM" : null, sources.tcgplayer ? "TCG" : null].filter(Boolean).join(" + ") || "No file loaded";

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className={`w-screen ${appHeightClass} -mx-4 md:-mx-6`}>
        <div className="px-4 md:px-6 py-4">
          <Section eyebrow="Tool" title="Bulk Edit UI (Variant Editor)" subtitle="Upload Cardmarket and/or TCGPlayer export JSONs. Edit variants with IDs from both sources and generate a stable code block." showDivider={false} fullBleed={true}>
            <div className={`mt-4 ${appHeightClass} flex flex-col`}>

              {/* Toolbar */}
              <div className={["surface p-4 md:p-5 mb-4 transition sticky top-[64px] z-10 backdrop-blur shrink-0", isDragging ? "border-white/25 bg-white/[0.06]" : ""].join(" ")}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-[14px] md:text-[16px] font-semibold text-white">Card Variant Editor</div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70">{sourceBadge}</span>
                    {cards.length > 0 && <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/50">{cards.length} cards</span>}
                    {isDragging && <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[12px] text-white/80">Drop JSON to merge</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input ref={cmFileRef} type="file" accept=".json" onChange={(e) => handleFileObject(e.target.files?.[0], "cardmarket")} className="sr-only" />
                    <input ref={tcgFileRef} type="file" accept=".json" onChange={(e) => handleFileObject(e.target.files?.[0], "tcgplayer")} className="sr-only" />
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition" onClick={() => cmFileRef.current?.click()} type="button">Upload Cardmarket</button>
                    <button className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-[12px] font-semibold text-indigo-200 hover:bg-indigo-500/15 transition" onClick={() => tcgFileRef.current?.click()} type="button">Upload TCGPlayer</button>
                    <Link href="/tools/cardmarket-exporter" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition">CM script</Link>
                    <Link href="/tools/tcgplayer-exporter" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition">TCG exporter</Link>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition" onClick={loadSample} type="button">Sample</button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition" onClick={resetAll} type="button">Reset</button>
                  </div>
                </div>
                {statusMsg && <div className="mt-2 text-[12px] text-white/55">{statusMsg}</div>}
                <div className="mt-2 text-[12px] text-white/40">Tip: drag & drop any JSON — source is auto-detected from <code>meta.tool</code>.</div>
              </div>

              <div className={`grid gap-4 md:grid-cols-12 md:items-stretch flex-1 min-h-0 ${desktopPanelsHeightClass}`}>
                {/* LEFT: cards */}
                <div className="md:col-span-7 min-h-0 flex flex-col max-h-[2790px]">
                  <div className="surface p-4 md:p-5 flex flex-col min-h-0 h-full max-h-content">
                    <div className="shrink-0">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="text-[12px] font-semibold text-white">Cards</div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">{filteredCards.length} shown</span>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-12">
                        <div className="md:col-span-7">
                          <label className="block text-[11px] text-white/55 mb-2">Search cardId</label>
                          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. ASC-051" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none" />
                        </div>
                        <div className="md:col-span-5">
                          <label className="block text-[11px] text-white/55 mb-2">Filter</label>
                          <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none">
                            <option value="all">All</option>
                            <option value="needs">Missing all IDs</option>
                            <option value="hasAdd">Has CM additionals</option>
                            <option value="hasTcg">Has TCGPlayer IDs</option>
                            <option value="hasBoth">Has both CM + TCG</option>
                            <option value="missingOne">Has one, missing other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {!cards.length ? (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px] text-white/70">
                        Import a Cardmarket and/or TCGPlayer export JSON.
                        <div className="mt-2 text-white/50">You can load both — they'll be merged by card ID.</div>
                      </div>
                    ) : (
                      <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
                        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
                          {filteredCards.map((c) => {
                            const hasBase = c.baseIds.length > 0; const hasAdd = c.additionalIds.length > 0;
                            const hasTcg = c.tcgplayerIds.length > 0; const isSelected = c.cardId === selectedCardId;
                            const note = (overrides[c.cardId]?.notes || "").trim();
                            return (
                              <button key={c.cardId} onClick={() => selectCard(c.cardId)} className={["text-left rounded-2xl border px-3 py-3 transition bg-black/30 hover:bg-black/40", isSelected ? "border-white/30" : "border-white/10"].join(" ")} type="button">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[12px] font-semibold text-white">{c.cardId}</div>
                                  <div className="flex gap-1">
                                    {hasBase && <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/60">CM</span>}
                                    {hasTcg && <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] text-indigo-300">TCG</span>}
                                  </div>
                                </div>
                                <div className="mt-2 text-[10px] text-white/50 space-y-0.5">
                                  <div>
                                    base: <span className="text-white/75 font-semibold">{hasBase ? c.baseIds.join(", ") : "—"}</span>
                                  </div>
                                  <div>
                                    add: <span className="text-white/75 font-semibold">{hasAdd ? c.additionalIds.join(", ") : "—"}</span>
                                  </div>
                                  <div>
                                    tcg: <span className="text-indigo-300/75 font-semibold">{hasTcg ? c.tcgplayerIds.join(", ") : "—"}</span>
                                  </div>
                                </div>

                                {!!(c.cardmarketProducts?.length || c.tcgplayerProducts?.length) && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {(c.cardmarketProducts || []).slice(0, 3).map((p) => (
                                      <span
                                        key={`cm-${p.productId}`}
                                        className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-white/60"
                                        title={`${p.productId} • ${p.name || "Unnamed Cardmarket product"}`}
                                      >
                                        CM {p.variantLabel ? formatVariantLabel(p.variantLabel) : p.name || p.productId}
                                      </span>
                                    ))}
                                    {(c.tcgplayerProducts || []).slice(0, 2).map((p) => (
                                      <span
                                        key={`tcg-${p.productId}`}
                                        className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] text-indigo-300"
                                        title={`${p.productId} • ${p.name}`}
                                      >
                                        TCG {p.name}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {!hasBase && !hasTcg && <div className="mt-2 text-[10px] text-red-200/80">No IDs</div>}
                                {note && <div className="mt-1 text-[10px] text-white/40">📝 {note}</div>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: editor */}
                <div className="md:col-span-5 min-h-0 flex flex-col">
                  <div className="surface p-4 md:p-5 flex flex-col min-h-0 h-full">
                    <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
                      <div className="text-[12px] font-semibold text-white">Editor</div>
                      <div className="flex gap-2 flex-wrap">
                        <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={autofillNow} type="button" disabled={!selectedCardId}>Autofill</button>
                        <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={copyBlock} type="button" disabled={!output.text}>Copy block</button>
                      </div>
                    </div>

                    <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
                      {!selectedCardId ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px] text-white/70">
                          Select a card to edit variants.
                          <div className="mt-3 text-white/50"><b>normal</b> and <b>reverse</b> (no foil) lock to base IDs.<br/>Foil variants get their own IDs from both sources.</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <div className="text-[14px] font-semibold text-white">{selectedCardId}</div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">CM base: {selectedCard?.baseIds?.[0] || "—"}</span>
                            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300">TCG: {selectedCard?.tcgplayerIds?.length || 0} products</span>
                          </div>

                          {selectedCard?.cardmarketProducts?.length > 0 && (
                            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                              <div className="text-[11px] font-semibold text-white mb-2">Cardmarket products</div>
                              <div className="space-y-1">
                                {selectedCard.cardmarketProducts.map((cm) => (
                                  <div key={cm.productId} className="text-[11px] text-white/60 flex items-center gap-2 flex-wrap">
                                    <a href={`https://product-images.s3.cardmarket.com/51/ASC/${cm.productId}/${cm.productId}.jpg`} target="_blank" rel="noreferrer" className="font-mono text-white/80 hover:text-white transition">{cm.productId}</a>
                                    <span>{cm.name || "Unnamed Cardmarket product"}</span>
                                    {cm.variantLabel && <span className="text-white/35">({formatVariantLabel(cm.variantLabel)})</span>}
                                    {cm.bucket && <span className="text-white/30">[{cm.bucket}]</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedCard?.tcgplayerProducts?.length > 0 && (
                            <div className="mt-3 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-3">
                              <div className="text-[11px] font-semibold text-indigo-300 mb-2">TCGPlayer products</div>
                              <div className="space-y-1">
                                {selectedCard.tcgplayerProducts.map((tp) => (
                                  <div key={tp.productId} className="text-[11px] text-white/60 flex items-center gap-2 flex-wrap">
                                    <a href={`https://www.tcgplayer.com/product/${tp.productId}`} target="_blank" rel="noreferrer" className="font-mono text-indigo-300/80 hover:text-indigo-200 transition">{tp.productId}</a>
                                    <span>{tp.name}</span>
                                    {tp.printings?.length > 0 && <span className="text-white/40">({tp.printings.join(", ")})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3">
                            <label className="block text-[11px] text-white/55 mb-1">Notes (local only)</label>
                            <input value={selectedOverride?.notes || ""} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. needs pokeball mapping" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none" />
                          </div>

                          <div className="mt-3 flex gap-2 flex-wrap">
                            <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition" onClick={addVariant} type="button">Add variant</button>
                            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition" onClick={clearOverridesForCard} type="button">Clear overrides</button>
                          </div>

                          {/* Variant rows */}
                          <div className="mt-4 space-y-3">
                            {(selectedOverride?.variants || []).map((v, idx) => {
                              const locked = isLockedToBase(v.type, v.foil);
                              const effectiveCm = getEffectiveCmId(v, selectedCard);
                              const effectiveTcg = getEffectiveTcgId(v, selectedCard);
                              const matchedCmProduct = getCardmarketProductById(selectedCard, effectiveCm);
                              const matchedTcgProduct = getTcgplayerProductById(selectedCard, effectiveTcg);
                              return (
                                <div key={`${idx}-${v.type}-${v.foil}`} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                                  <div className="grid gap-3 grid-cols-2">
                                    <div>
                                      <label className="block text-[11px] text-white/55 mb-1">Type</label>
                                      <select value={v.type} onChange={(e) => updateVariant(idx, "type", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none">
                                        {TYPE_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-[11px] text-white/55 mb-1">Foil</label>
                                      <select value={v.foil || ""} onChange={(e) => updateVariant(idx, "foil", e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none">
                                        {FOIL_OPTIONS.map((f) => (<option key={f || "none"} value={f}>{f || "none"}</option>))}
                                      </select>
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-[11px] text-white/55 mb-1">Stamp</label>
                                      <input value={v.stamp || ""} onChange={(e) => updateVariant(idx, "stamp", e.target.value)} placeholder="optional" className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none" />
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[11px] text-white/55">Cardmarket ID</label>
                                        <IdLink id={effectiveCm} source="cardmarket" />
                                      </div>
                                      <input
                                        value={v.cardmarket || ""}
                                        onChange={(e) => updateVariant(idx, "cardmarket", e.target.value)}
                                        type="number"
                                        disabled={locked}
                                        placeholder={locked ? "locked to base" : "e.g. 869612"}
                                        className={`w-full rounded-xl border px-3 py-2 text-[13px] outline-none bg-black/30 text-white ${locked ? "border-white/5 text-white/50" : "border-white/10"}`}
                                      />
                                      {locked && effectiveCm && <div className="mt-1 text-[10px] text-white/40">→ {effectiveCm}</div>}
                                      {matchedCmProduct?.name && (
                                        <div className="mt-1 text-[10px] text-white/50">
                                          {matchedCmProduct.name}
                                          {matchedCmProduct.variantLabel && (
                                            <span className="text-white/30"> • {formatVariantLabel(matchedCmProduct.variantLabel)}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center justify-between mb-1">
                                        <label className="text-[11px] text-indigo-300/70">TCGPlayer ID</label>
                                        <IdLink id={effectiveTcg} source="tcgplayer" />
                                      </div>
                                      <input
                                        value={v.tcgplayer || ""}
                                        onChange={(e) => updateVariant(idx, "tcgplayer", e.target.value)}
                                        type="number"
                                        disabled={locked}
                                        placeholder={locked ? "locked to base" : "e.g. 675813"}
                                        className={`w-full rounded-xl border px-3 py-2 text-[13px] outline-none bg-black/30 text-indigo-200 ${locked ? "border-indigo-500/10 text-indigo-200/50" : "border-indigo-500/20"}`}
                                      />
                                      {locked && effectiveTcg && <div className="mt-1 text-[10px] text-indigo-300/40">→ {effectiveTcg}</div>}
                                      {matchedTcgProduct?.name && (
                                        <div className="mt-1 text-[10px] text-indigo-300/55">{matchedTcgProduct.name}</div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <button className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[12px] font-semibold text-red-200 hover:bg-red-500/10 transition" onClick={() => removeVariant(idx)} type="button">Remove</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-4">
                            <label className="block text-[11px] text-white/55 mb-2">Generated code block</label>
                            <pre className="overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-[12px] text-white/80"><code>{output.text}</code></pre>
                            <div className="mt-3 flex items-center gap-3 flex-wrap">
                              <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={copyBlock} type="button" disabled={!output.text}>Copy block</button>
                              {copyStatus ? <span className="text-[12px] text-green-300">{copyStatus}</span> : output.needsBase ? <span className="text-[12px] text-red-200/80">⚠ No base IDs — normal/reverse can't be locked.</span> : null}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="surface p-4 md:p-5 mt-4 shrink-0">
                    <div className="text-[12px] font-semibold text-white">Documentation</div>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">Upload one or both source JSONs. Cards are merged by ID (e.g. <code>ASC-001</code>).</p>
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-3 text-[12px] text-white/70 space-y-1">
                      <div><span className="text-white/90 font-semibold">Cardmarket JSON</span> → from the Tampermonkey exporter script</div>
                      <div><span className="text-indigo-300 font-semibold">TCGPlayer JSON</span> → from the TCGPlayer Set Exporter tool</div>
                    </div>
                    <ul className="mt-3 space-y-1 text-[12px] text-white/60">
                      <li>• <b>normal</b> + <b>reverse</b> (no foil) lock to base IDs from both sources</li>
                      <li>• Foil types: pokeball, masterball, loveball, friendball, quickball, team-rocket, duskball, energy</li>
                      <li>• TCGPlayer products are auto-mapped by name pattern</li>
                      <li>• Click <b>↗ TCG</b> / <b>↗ img</b> links to verify each ID</li>
                      <li>• Generated block includes <code>{"thirdParty: { cardmarket, tcgplayer }"}</code></li>
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

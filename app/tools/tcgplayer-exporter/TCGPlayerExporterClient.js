// app/tools/tcgplayer-exporter/TCGPlayerExporterClient.js
//
// UPDATED (2026-03-07)
//
// CHANGES
// - NO STRUCTURAL EXPORT CHANGES REQUIRED.
// - CONFIRMED: tcgplayerProducts already exports per-product names used by Bulk Edit.
// - NOTE: Bulk Edit now reads Cardmarket cardmarketProducts alongside this file.
//
// TCGPlayer Set Exporter — fetches product + price data from TCGCSV.com
// (a free, no-auth, daily-updated mirror of TCGPlayer's API).
//
// Key insight: TCGPlayer uses ONE productId per card variant pattern
// (e.g. base, Poké Ball, Energy Symbol each get their own productId).
// Printing types (Normal, Holofoil, Reverse Holofoil) are price-level
// subTypeName entries, NOT separate products.
//
// This tool lets you:
//  1. Browse all Pokémon sets from TCGPlayer
//  2. Load any set's full product + price data
//  3. See every card with all its variant productIds + printing subtypes
//  4. Export a JSON keyed by canonical SETCODE-NNN, compatible with Bulk Edit UI

"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Section from "../../components/ui/Section";

// ─── Config ────────────────────────────────────────────────────────
const API_BASE = "https://tcgcsv.com/tcgplayer";
const POKEMON_CATEGORY = 3;

// ─── Helpers ───────────────────────────────────────────────────────
function pad3(n) {
  const s = String(n).replace(/^0+/, "") || "0";
  return s.length >= 3 ? s : s.padStart(3, "0");
}

function parseCardNumber(numStr) {
  if (!numStr) return null;
  const m = numStr.match(/^(\d+)/);
  return m ? m[1] : null;
}

function canonicalId(setCode, numStr) {
  const n = parseCardNumber(numStr);
  if (!setCode || !n) return null;
  return `${setCode}-${pad3(n)}`;
}

function uniqSorted(nums) {
  const out = Array.from(new Set(nums.filter((n) => Number.isFinite(n))));
  out.sort((a, b) => a - b);
  return out;
}

// ─── API ───────────────────────────────────────────────────────────
async function fetchGroups() {
  const r = await fetch(`${API_BASE}/${POKEMON_CATEGORY}/groups`);
  const d = await r.json();
  return (d.results || []).sort(
    (a, b) => new Date(b.publishedOn) - new Date(a.publishedOn)
  );
}

async function fetchProducts(groupId) {
  const r = await fetch(`${API_BASE}/${POKEMON_CATEGORY}/${groupId}/products`);
  return (await r.json()).results || [];
}

async function fetchPrices(groupId) {
  const r = await fetch(`${API_BASE}/${POKEMON_CATEGORY}/${groupId}/prices`);
  return (await r.json()).results || [];
}

// ─── Data transforms ───────────────────────────────────────────────
function buildCardMap(products, prices, setCode) {
  const priceMap = {};
  for (const p of prices) {
    if (!priceMap[p.productId]) priceMap[p.productId] = [];
    priceMap[p.productId].push(p);
  }

  const cardMap = new Map();

  for (const prod of products) {
    const ext = {};
    for (const e of prod.extendedData || []) ext[e.name] = e.value;
    if (!ext.Number) continue;

    const cid = canonicalId(setCode, ext.Number);
    if (!cid) continue;

    if (!cardMap.has(cid)) {
      cardMap.set(cid, { cardId: cid, number: ext.Number, products: [] });
    }

    const card = cardMap.get(cid);
    const pricings = priceMap[prod.productId] || [];

    card.products.push({
      productId: prod.productId,
      name: prod.name,
      cleanName: prod.cleanName,
      rarity: ext.Rarity || "",
      imageUrl: prod.imageUrl,
      url: prod.url,
      printings: pricings.map((p) => ({
        subTypeName: p.subTypeName,
        marketPrice: p.marketPrice,
        lowPrice: p.lowPrice,
      })),
    });
  }

  return new Map(
    [...cardMap.entries()].sort((a, b) => {
      const an = parseInt(parseCardNumber(a[1].number)) || 0;
      const bn = parseInt(parseCardNumber(b[1].number)) || 0;
      return an - bn;
    })
  );
}

function buildExportPayload(cardMap, setCode, groupId, groupName) {
  const byCardId = {};

  for (const [cid, card] of cardMap) {
    const tcgplayerIds = card.products.map((p) => p.productId);
    const productDetails = card.products.map((p) => ({
      productId: p.productId,
      name: p.name,
      rarity: p.rarity,
      printings: p.printings.map((pr) => pr.subTypeName),
    }));

    byCardId[cid] = {
      cardId: cid,
      ids: {
        base: [],
        additional: [],
        tcgplayer: tcgplayerIds,
      },
      tcgplayerProducts: productDetails,
      sources: card.products.map((p) => ({
        productId: p.productId,
        name: p.name,
        url: p.url,
      })),
    };
  }

  return {
    meta: {
      tool: "sbf-tcgplayer-set-exporter",
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      groupKey: setCode,
      groupId,
      groupName,
      source: "tcgcsv.com (TCGPlayer mirror)",
      note: "ids.tcgplayer contains all TCGPlayer productIds for this card (base + variant patterns). ids.base/additional are empty — merge with Cardmarket export. tcgplayerProducts has per-product detail including printing subtypes.",
    },
    stats: { mergedKeys: Object.keys(byCardId).length },
    byCardId,
  };
}

// ─── Printing badge ────────────────────────────────────────────────
const PRINTING_COLORS = {
  Normal: "border-white/10 bg-white/[0.03] text-white/60",
  Holofoil: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  "Reverse Holofoil": "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "1st Edition Holofoil": "border-red-500/30 bg-red-500/10 text-red-300",
  "1st Edition Normal": "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

function PrintingBadge({ name, price }) {
  const cls = PRINTING_COLORS[name] || "border-white/10 bg-white/[0.03] text-white/60";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {name}
      {price != null && (
        <span className="opacity-60 font-normal">${price.toFixed(2)}</span>
      )}
    </span>
  );
}

// ─── Card row ──────────────────────────────────────────────────────
function CardRow({ cid, card }) {
  const [expanded, setExpanded] = useState(false);
  const hasVariants = card.products.length > 1;

  return (
    <div
      className={[
        "rounded-xl border transition",
        hasVariants ? "border-indigo-500/15 bg-white/[0.02]" : "border-white/[0.06] bg-white/[0.01]",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-[10px] text-white/40 w-3">{expanded ? "▼" : "▶"}</span>
        <span className="text-[13px] font-semibold text-white min-w-[90px]">{cid}</span>
        <span className="text-[12px] text-white/60 flex-1 truncate">{card.products[0]?.name}</span>
        <span className={`text-[11px] ${hasVariants ? "text-indigo-300 font-semibold" : "text-white/40"}`}>
          {card.products.length} product{card.products.length !== 1 ? "s" : ""}
        </span>
        <span className="text-[11px] text-white/40 hidden md:inline">{card.products[0]?.rarity}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 pl-10 space-y-2">
          {card.products.map((p) => (
            <div
              key={p.productId}
              className="rounded-xl border border-white/[0.06] bg-black/30 p-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-white">{p.name}</span>
                <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-white/50 font-mono">
                  id:{p.productId}
                </span>
                {p.rarity && (
                  <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 text-[10px] text-purple-300">
                    {p.rarity}
                  </span>
                )}
              </div>

              <div className="mt-2 flex gap-1.5 flex-wrap">
                {p.printings.map((pr) => (
                  <PrintingBadge key={pr.subTypeName} name={pr.subTypeName} price={pr.marketPrice} />
                ))}
                {p.printings.length === 0 && (
                  <span className="text-[11px] text-white/30">No pricing data</span>
                )}
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-[11px] text-white/40 hover:text-white/70 transition"
              >
                View on TCGPlayer →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────
export default function TCGPlayerExporterClient() {
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [groupsError, setGroupsError] = useState(null);
  const [groupSearch, setGroupSearch] = useState("");

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [setCodeOverride, setSetCodeOverride] = useState("");

  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [copyStatus, setCopyStatus] = useState("");

  // Load groups on mount
  useEffect(() => {
    fetchGroups()
      .then(setGroups)
      .catch((e) => setGroupsError(e.message))
      .finally(() => setGroupsLoading(false));
  }, []);

  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return groups;
    const q = groupSearch.toLowerCase();
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.abbreviation.toLowerCase().includes(q) ||
        String(g.groupId).includes(q)
    );
  }, [groups, groupSearch]);

  const loadSet = useCallback(async (group) => {
    setSelectedGroup(group);
    setSetCodeOverride(group.abbreviation || "");
    setLoading(true);
    setError(null);
    setProducts([]);
    setPrices([]);
    setSearch("");
    setFilter("all");
    setCopyStatus("");

    try {
      const [prods, prs] = await Promise.all([
        fetchProducts(group.groupId),
        fetchPrices(group.groupId),
      ]);
      setProducts(prods);
      setPrices(prs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const effectiveSetCode = (setCodeOverride || selectedGroup?.abbreviation || "SET").toUpperCase();

  const cardMap = useMemo(
    () => buildCardMap(products, prices, effectiveSetCode),
    [products, prices, effectiveSetCode]
  );

  const filteredCards = useMemo(() => {
    let entries = [...cardMap.entries()];

    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(
        ([cid, card]) =>
          cid.toLowerCase().includes(q) ||
          card.products.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    if (filter === "multiProduct") {
      entries = entries.filter(([, card]) => card.products.length > 1);
    } else if (filter === "holoOnly") {
      entries = entries.filter(([, card]) =>
        card.products.some((p) =>
          p.printings.some(
            (pr) => pr.subTypeName === "Holofoil" || pr.subTypeName === "Reverse Holofoil"
          )
        )
      );
    }

    return entries;
  }, [cardMap, search, filter]);

  const exportPayload = useMemo(() => {
    if (!cardMap.size) return null;
    return buildExportPayload(
      cardMap,
      effectiveSetCode,
      selectedGroup?.groupId,
      selectedGroup?.name
    );
  }, [cardMap, effectiveSetCode, selectedGroup]);

  const exportJson = exportPayload ? JSON.stringify(exportPayload, null, 2) : "";

  const stats = useMemo(() => {
    if (!cardMap.size) return null;
    let totalProducts = 0;
    let withMultiple = 0;
    const printingSet = new Set();

    for (const [, card] of cardMap) {
      totalProducts += card.products.length;
      if (card.products.length > 1) withMultiple++;
      for (const p of card.products) {
        for (const pr of p.printings) printingSet.add(pr.subTypeName);
      }
    }

    return {
      cards: cardMap.size,
      products: totalProducts,
      withVariants: withMultiple,
      printingTypes: [...printingSet].sort(),
    };
  }, [cardMap]);

  async function copyExport() {
    if (!exportJson) return;
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1200);
    } catch {
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 1200);
    }
  }

  function downloadExport() {
    if (!exportJson) return;
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tcgplayer-${effectiveSetCode}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ─── Render ──────────────────────────────────────────────────────
  const btnCls =
    "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed";
  const btnPrimaryCls =
    "rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <Section
      eyebrow="Tool"
      title="TCGPlayer Set Exporter"
      subtitle="Fetch product IDs + variant data for any Pokémon set from TCGPlayer via TCGCSV. Export is compatible with the Bulk Edit UI."
      showDivider={false}
    >
      {/* ── SET SELECTOR ────────────────────────────────────────── */}
      {!selectedGroup && (
        <div className="surface p-5">
          <div className="text-[14px] font-semibold text-white mb-3">Select a Pokémon set</div>

          <input
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
            placeholder="Search sets (name, abbreviation, or groupId)..."
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none mb-3"
          />

          {groupsLoading && <div className="text-[12px] text-white/50">Loading sets from TCGCSV...</div>}
          {groupsError && <div className="text-[12px] text-red-200/80">Error: {groupsError}</div>}

          <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto">
            {filteredGroups.slice(0, 80).map((g) => (
              <button
                key={g.groupId}
                type="button"
                onClick={() => loadSet(g)}
                className="text-left rounded-xl border border-white/10 bg-black/30 px-3 py-3 hover:bg-black/40 hover:border-white/20 transition"
              >
                <div className="text-[13px] font-semibold text-white">{g.name}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/50">
                  {g.abbreviation && (
                    <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono font-semibold text-white/60">
                      {g.abbreviation}
                    </span>
                  )}
                  <span>id:{g.groupId}</span>
                  <span>{new Date(g.publishedOn).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── LOADED SET VIEW ─────────────────────────────────────── */}
      {selectedGroup && (
        <>
          {/* Toolbar */}
          <div className="surface p-4 md:p-5 mb-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <button type="button" onClick={() => setSelectedGroup(null)} className={btnCls}>
                  ← Back
                </button>
                <div className="text-[14px] md:text-[16px] font-semibold text-white">
                  {selectedGroup.name}
                </div>
                {selectedGroup.abbreviation && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60 font-mono font-semibold">
                    {selectedGroup.abbreviation}
                  </span>
                )}
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
                  groupId:{selectedGroup.groupId}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-[11px] text-white/50">Set code:</label>
                <input
                  value={setCodeOverride}
                  onChange={(e) => setSetCodeOverride(e.target.value)}
                  className="w-20 rounded-xl border border-white/10 bg-black/30 px-2 py-1.5 text-[12px] text-white outline-none font-mono"
                  placeholder="e.g. PRE"
                />

                <button type="button" onClick={copyExport} className={btnPrimaryCls} disabled={!exportJson}>
                  {copyStatus || "Copy JSON"}
                </button>
                <button type="button" onClick={downloadExport} className={btnCls} disabled={!exportJson}>
                  Download
                </button>
                <Link href="/tools/bulk-edit" className={btnCls}>
                  Open Bulk Edit UI
                </Link>
              </div>
            </div>
          </div>

          {loading && (
            <div className="surface p-5 text-[12px] text-white/50">
              Loading products + prices from TCGCSV...
            </div>
          )}
          {error && (
            <div className="surface p-5 text-[12px] text-red-200/80">Error: {error}</div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-4">
              <div className="surface p-4">
                <div className="text-[20px] font-black text-white">{stats.cards}</div>
                <div className="text-[11px] text-white/50 mt-1">unique cards</div>
              </div>
              <div className="surface p-4">
                <div className="text-[20px] font-black text-white">{stats.products}</div>
                <div className="text-[11px] text-white/50 mt-1">total products</div>
              </div>
              <div className="surface p-4">
                <div className="text-[20px] font-black text-white">{stats.withVariants}</div>
                <div className="text-[11px] text-white/50 mt-1">with variant patterns</div>
              </div>
              <div className="surface p-4">
                <div className="flex flex-wrap gap-1.5">
                  {stats.printingTypes.map((pt) => (
                    <PrintingBadge key={pt} name={pt} />
                  ))}
                </div>
                <div className="text-[11px] text-white/50 mt-1">printing types in set</div>
              </div>
            </div>
          )}

          {/* Filter bar */}
          {stats && (
            <div className="flex gap-3 mb-4 flex-wrap items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by card ID or name..."
                className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[12px] text-white outline-none"
              >
                <option value="all">All cards ({cardMap.size})</option>
                <option value="multiProduct">Has variant patterns ({stats.withVariants})</option>
                <option value="holoOnly">Has Holo/Reverse Holo</option>
              </select>
              <span className="text-[11px] text-white/40">
                {filteredCards.length} of {cardMap.size}
              </span>
            </div>
          )}

          {/* Card list */}
          <div className="space-y-1">
            {filteredCards.map(([cid, card]) => (
              <CardRow key={cid} cid={cid} card={card} />
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
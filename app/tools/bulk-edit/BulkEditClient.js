// app/tools/bulk-edit/BulkEditClient.js
// MULTI-SOURCE VARIANT EDITOR v14
// UPDATED (2026-03-11)
//
// CHANGES
// - FIX: Patterned products (Poke Ball / Master Ball Pattern) are now always reverse|foil.
//        TCGPlayer incorrectly labels all of them as Holofoil in Black Bolt / White Flare —
//        their printings are ignored entirely and they always map to reverse|foil.
// - FIX: isHoloRarity() guard added — Holofoil printings on base products are only trusted
//        when the card is actually a holo rare. Commons/Uncommons with a bogus Holofoil
//        entry (e.g. WHT-011 Tepig, WHT-021 Oshawott) no longer generate a fake holo|| row.
// - FIX: Bump APP_STORE_KEY to v6 to clear stale localStorage overrides causing wrong CM IDs
//        to persist on cards like WHT-001 where old autofill put 836494 into an unknown row
//        instead of holo|masterball.
// - FIX: "Preserve manual rows" pass now only preserves rows with at least one manually-set ID.
//        Auto-generated rows from a previous stale autofill no longer block fresh TCG/CM
//        assignment, preventing wrong IDs from being locked in on re-autofill.
// - FIX: Stop inferring "team-rocket" foil from base card names like "Team Rocket's Meowth".
// - FIX: Resolve variants canonically before assigning IDs, instead of relying on row order.
// - FIX: Sanitize broken Cardmarket variant labels before using them.
// - FIX: Improve autofill so TCGPlayer determines variant identity and Cardmarket IDs attach afterward.
// - FIX: Prevent wrong Cardmarket additional IDs from being assigned to the wrong foil row.
// - FIX: Holo-only cards no longer create fake normal/reverse rows.
// - FIX: Holo base rows now inherit the base Cardmarket / TCGPlayer product IDs.
// - FIX: TCGPlayer products with multiple printings (e.g. Holofoil + Reverse Holofoil) now create multiple rows.
// - FIX: Plain reverse rows can now receive Cardmarket additional IDs during fallback assignment.
// - FIX: Cardmarket-only additional variants are now allowed and preserved even if no TCGPlayer ID exists.
// - FIX: Base-locking is now PER-CARD, not global.
// - FIX: Unresolved extra Cardmarket-only additionals are now preserved as explicit UNKNOWN rows instead of being forced into an incorrect variant.
// - FIX: Leaked non-Cardmarket IDs are filtered out of cardmarketProducts during ingest.
// - FIX: Base-locked rows are now derived from the actual base TCGPlayer product keys.
// - FIX: Patterned TCGPlayer products now respect their actual printings instead of always becoming reverse rows.
// - FIX: Pokeball now sorts before Masterball during both fallback CM assignment and generated output.
// - CHANGED: Output ordering now keeps base rows first: normal, reverse, holo, then foil-pattern rows.
// - ADDED: Foil rank helpers for stable patterned ordering.
// - ADDED: "unknown" type / foil support for unresolved rows.
// - ADDED: Hidden marker-based unknown row keys so multiple unresolved additionals can coexist.
// - ADDED: Unknown row labels in the editor and generated code output.
// - ADDED: Base-locked type helper.
// - PRESERVED: Independent scroll areas for the card list and editor panel.
// - PRESERVED: Cardmarket product name + variant label support, legacy fallback mapping, and matched product display.

"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Section from "../../components/ui/Section";

const APP_STORE_KEY = "sbf_variant_editor_overrides_v7";
const TYPE_OPTIONS = ["normal", "reverse", "holo", "unknown"];
const FOIL_OPTIONS = [
  "",
  "pokeball",
  "masterball",
  "loveball",
  "friendball",
  "quickball",
  "team-rocket",
  "duskball",
  "energy",
  "unknown",
];
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

function makeVariantRow() {
  return {
    type: "normal",
    foil: "",
    stamp: "",
    cardmarket: "",
    tcgplayer: "",
  };
}

function makeVariantKey(type = "normal", foil = "", stamp = "") {
  return `${String(type || "normal").trim()}|${String(foil || "").trim()}|${String(stamp || "").trim()}`;
}

function parseVariantKey(key) {
  const [type = "normal", foil = "", stamp = ""] = String(key || "").split("|");
  return { type, foil, stamp };
}

function makeVariantRowFromKey(key) {
  const { type, foil, stamp } = parseVariantKey(key);
  return {
    type: type || "normal",
    foil: foil || "",
    stamp: stamp || "",
    cardmarket: "",
    tcgplayer: "",
  };
}

const VALID_FOILS = new Set([
  "pokeball",
  "masterball",
  "loveball",
  "friendball",
  "quickball",
  "team-rocket",
  "duskball",
  "energy",
  "unknown",
]);

const SUFFIX_TO_FOIL = [
  { pattern: /^poke\s*ball(\s+pattern)?$/i, foil: "pokeball" },
  { pattern: /^poké\s*ball(\s+pattern)?$/i, foil: "pokeball" },
  { pattern: /^master\s*ball(\s+pattern)?$/i, foil: "masterball" },
  { pattern: /^love\s*ball(\s+pattern)?$/i, foil: "loveball" },
  { pattern: /^friend\s*ball(\s+pattern)?$/i, foil: "friendball" },
  { pattern: /^quick\s*ball(\s+pattern)?$/i, foil: "quickball" },
  { pattern: /^team[\s-]*rocket$/i, foil: "team-rocket" },
  { pattern: /^dusk\s*ball(\s+pattern)?$/i, foil: "duskball" },
  { pattern: /^energy\s*symbol\s*pattern$/i, foil: "energy" },
  { pattern: /^energy$/i, foil: "energy" },
];

function extractParenLabels(name) {
  const n = String(name || "").trim();
  const matches = [...n.matchAll(/\(([^()]+)\)/g)];
  return matches.map((m) => String(m?.[1] || "").trim()).filter(Boolean);
}

function inferFoilFromSuffixLabel(label) {
  const raw = String(label || "").trim();
  if (!raw) return "";
  for (const { pattern, foil } of SUFFIX_TO_FOIL) {
    if (pattern.test(raw)) return foil;
  }
  return "";
}

function inferFoilFromTCGPlayerName(name) {
  const labels = extractParenLabels(name);

  for (const label of labels) {
    const foil = inferFoilFromSuffixLabel(label);
    if (foil) return foil;
  }

  return "";
}

// Stable foil ordering for JSON/source-driven patterned variants.
// Important for cases like Poké Ball -> Master Ball.
function getFoilSortRank(foil) {
  const value = String(foil || "").trim().toLowerCase();

  if (!value) return 0;
  if (value === "pokeball") return 10;
  if (value === "masterball") return 11;
  if (value === "loveball") return 12;
  if (value === "friendball") return 13;
  if (value === "quickball") return 14;
  if (value === "team-rocket") return 15;
  if (value === "duskball") return 16;
  if (value === "energy") return 17;
  if (value === "unknown") return 999;

  return 100;
}

function compareFoils(a, b) {
  const aFoil = String(a || "").trim().toLowerCase();
  const bFoil = String(b || "").trim().toLowerCase();

  const rankDiff = getFoilSortRank(aFoil) - getFoilSortRank(bFoil);
  if (rankDiff !== 0) return rankDiff;

  return aFoil.localeCompare(bFoil);
}

function getVariantSortRank(type, foil) {
  const t = String(type || "").trim().toLowerCase();
  const f = String(foil || "").trim().toLowerCase();

  // Base rows first, then explicit holo bases, then foil rows, then unknown.
  if (t === "normal" && !f) return 0;
  if (t === "reverse" && !f) return 1;
  if (t === "holo" && !f) return 2;
  if (t === "holo" && !!f) return 3;
  if (t === "reverse" && !!f) return 4;
  if (t === "normal" && !!f) return 5;
  if (t === "unknown") return 999;

  return 100;
}

function compareVariantKeys(keyA, keyB) {
  const a = parseVariantKey(keyA);
  const b = parseVariantKey(keyB);

  const rankDiff = getVariantSortRank(a.type, a.foil) - getVariantSortRank(b.type, b.foil);
  if (rankDiff !== 0) return rankDiff;

  const foilDiff = compareFoils(a.foil, b.foil);
  if (foilDiff !== 0) return foilDiff;

  if (a.type !== b.type) return a.type.localeCompare(b.type);
  return a.stamp.localeCompare(b.stamp);
}

function sanitizeCardmarketVariantLabel(product) {
  const rawLabel = String(product?.variantLabel || "").trim();
  const name = String(product?.name || "");
  const suffixFoil = inferFoilFromTCGPlayerName(name);

  if (suffixFoil) return suffixFoil;

  if (rawLabel && rawLabel !== "team-rocket" && VALID_FOILS.has(rawLabel)) {
    return rawLabel;
  }

  return "";
}

function isHoloRarity(rarity) {
  // Only trust Holofoil printings from TCGPlayer for cards that are actually holo rares.
  // Commons and Uncommons in sets like Black Bolt / White Flare sometimes have a bogus
  // Holofoil entry on their base product (e.g. Tepig, Oshawott in WHT) due to TCGPlayer
  // data errors. Filtering by rarity prevents fake holo|| rows being created for them.
  const r = String(rarity || "").trim().toLowerCase();
  return (
    r === "rare" ||
    r === "rare holo" ||
    r === "double rare" ||
    r === "ultra rare" ||
    r === "secret rare" ||
    r === "special illustration rare" ||
    r === "illustration rare" ||
    r === "hyper rare" ||
    r.includes("rare")
  );
}

function getTcgplayerVariantKeys(product) {
  const foil = inferFoilFromTCGPlayerName(product?.name);
  const printings = Array.isArray(product?.printings) ? product.printings : [];

  // Patterned products (Poke Ball Pattern, Master Ball Pattern, etc.) are always
  // reverse holofoil variants in Black Bolt / White Flare and similar sets.
  // TCGPlayer incorrectly labels all of them as "Holofoil" — ignore their printings
  // entirely and always map to reverse|foil.
  if (foil) {
    return [makeVariantKey("reverse", foil, "")];
  }

  const hasNormal = printings.some((p) => /^normal$/i.test(String(p)));
  const hasReverse = printings.some((p) => /reverse/i.test(String(p)));

  // Only create a holo|| row if the card is actually a holo rare.
  // TCGPlayer sometimes lists Holofoil on base products for commons/uncommons in
  // special sets — this is a data error and should be ignored.
  const hasHolo =
    isHoloRarity(product?.rarity) &&
    printings.some((p) => /holo/i.test(String(p)) && !/reverse/i.test(String(p)));

  const keys = [];

  if (hasNormal) keys.push(makeVariantKey("normal", "", ""));
  if (hasHolo) keys.push(makeVariantKey("holo", "", ""));
  if (hasReverse) keys.push(makeVariantKey("reverse", "", ""));

  if (!keys.length) {
    keys.push(makeVariantKey("normal", "", ""));
  }

  return uniq(keys);
}

function getBaseTcgplayerProduct(card) {
  const products = Array.isArray(card?.tcgplayerProducts) ? card.tcgplayerProducts : [];
  if (!products.length) return null;

  const normalBase = products.find((tp) =>
    getTcgplayerVariantKeys(tp).includes(makeVariantKey("normal", "", ""))
  );
  if (normalBase) return normalBase;

  const holoBase = products.find((tp) =>
    getTcgplayerVariantKeys(tp).includes(makeVariantKey("holo", "", ""))
  );
  if (holoBase) return holoBase;

  const reverseBase = products.find((tp) =>
    getTcgplayerVariantKeys(tp).includes(makeVariantKey("reverse", "", ""))
  );
  if (reverseBase) return reverseBase;

  return null;
}

function getBaseVariantType(card) {
  const baseProduct = getBaseTcgplayerProduct(card);
  if (baseProduct) {
    const keys = getTcgplayerVariantKeys(baseProduct);
    if (keys.includes(makeVariantKey("normal", "", ""))) return "normal";
    if (keys.includes(makeVariantKey("holo", "", ""))) return "holo";
    if (keys.includes(makeVariantKey("reverse", "", ""))) return "reverse";
  }

  const baseCount = Array.isArray(card?.baseIds) ? card.baseIds.length : 0;
  const addCount = Array.isArray(card?.additionalIds) ? card.additionalIds.length : 0;

  if (baseCount > 0 && addCount > 0) {
    return "normal";
  }

  return "normal";
}

// ADDED (2026-03-09)
// CHANGES:
// - Base-locked types now come from the ACTUAL base TCGPlayer product.
// - This allows a base product with Holofoil + Reverse Holofoil to lock both holo and reverse.
function getBaseLockedTypes(card) {
  const locked = new Set();
  const baseProduct = getBaseTcgplayerProduct(card);

  if (baseProduct) {
    const baseKeys = getTcgplayerVariantKeys(baseProduct);

    const hasNormal = baseKeys.includes(makeVariantKey("normal", "", ""));
    const hasReverse = baseKeys.includes(makeVariantKey("reverse", "", ""));
    const hasHolo = baseKeys.includes(makeVariantKey("holo", "", ""));

    if (hasNormal) {
      locked.add("normal");
      locked.add("reverse");
    }

    if (hasHolo) {
      locked.add("holo");
    }

    if (hasReverse) {
      locked.add("reverse");
    }

    if (locked.size > 0) return locked;
  }

  const baseVariantType = getBaseVariantType(card);

  if (baseVariantType === "holo") {
    locked.add("holo");
    return locked;
  }

  if (baseVariantType === "reverse") {
    locked.add("reverse");
    return locked;
  }

  locked.add("normal");
  locked.add("reverse");
  return locked;
}

function isBaseLockedVariant(card, type, foil) {
  if (foil) return false;
  const lockedTypes = getBaseLockedTypes(card);
  return lockedTypes.has(type);
}

function formatVariantLabel(label) {
  const v = String(label || "").trim();
  if (!v) return "";
  return v
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDisplayVariantLabel(product) {
  const clean = sanitizeCardmarketVariantLabel(product);
  const raw =
    String(product?.rawVariantLabel || "").trim() ||
    String(product?.variantLabel || "").trim();

  if (clean && raw && clean !== raw) {
    return `${formatVariantLabel(clean)} (raw: ${raw})`;
  }
  if (clean) return formatVariantLabel(clean);
  if (raw) return `raw: ${raw}`;
  return "";
}

function getUnknownStampFromCardmarketProduct(productId) {
  return `cm-only-${productId}`;
}

function isUnknownRow(row) {
  return row.type === "unknown" || row.foil === "unknown";
}

function getUnknownRowLabel(row) {
  const stamp = String(row?.stamp || "");
  if (stamp.startsWith("cm-only-")) {
    return `Unresolved CM-only variant (${stamp.replace("cm-only-", "")})`;
  }
  return "Unresolved variant";
}

function IdLink({ id, source }) {
  const numId = safeNum(id);
  if (!numId) return null;

  if (source === "tcgplayer") {
    return (
      <a
        href={`https://www.tcgplayer.com/product/${numId}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition"
        title={`View on TCGPlayer (${numId})`}
      >
        ↗ TCG
      </a>
    );
  }

  if (source === "cardmarket") {
    return (
      <a
        href={`https://product-images.s3.cardmarket.com/51/ASC/${numId}/${numId}.jpg`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 text-[10px] text-white/50 hover:text-white/80 transition"
        title={`View card image (product ${numId})`}
      >
        ↗ img
      </a>
    );
  }

  return null;
}

function parseToMap(json) {
  const byCardId = json?.byCardId || json?.cardIdToProductId || null;
  if (!byCardId || typeof byCardId !== "object") {
    throw new Error("Unsupported JSON: missing byCardId");
  }

  const map = new Map();

  for (const [cardId, obj] of Object.entries(byCardId)) {
    const baseIds = uniq((obj?.ids?.base || []).map(Number));
    const additionalIds = uniq((obj?.ids?.additional || []).map(Number));
    const tcgplayerIds = uniq((obj?.ids?.tcgplayer || []).map(Number));

    const allowedCardmarketIds = new Set([...baseIds, ...additionalIds].map(Number));

    const tcgplayerProducts = Array.isArray(obj?.tcgplayerProducts)
      ? obj.tcgplayerProducts
      : [];

    const rawCardmarketProducts = Array.isArray(obj?.cardmarketProducts)
      ? obj.cardmarketProducts
      : Array.isArray(obj?.sources)
        ? obj.sources.filter((s) => Number.isFinite(Number(s?.productId)))
        : [];

    const cardmarketProducts = rawCardmarketProducts
      .map((p) => {
        const next = {
          productId: Number(p.productId),
          name: p.name || "",
          variantLabel: p.variantLabel || "",
          bucket: p.bucket || "",
          rawCardId: p.rawCardId || "",
          canonicalCardId: p.canonicalCardId || cardId,
          setSlug: p.setSlug || "",
          setName: p.setName || "",
          url: p.url || "",
        };

        return {
          ...next,
          variantLabel: sanitizeCardmarketVariantLabel(next),
          rawVariantLabel: p.variantLabel || "",
        };
      })
      .filter((p) => allowedCardmarketIds.has(Number(p.productId)));

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
          ...inc.tcgplayerProducts.filter(
            (ip) => !cur.tcgplayerProducts.some((cp) => cp.productId === ip.productId)
          ),
        ],

        cardmarketProducts: [
          ...(cur.cardmarketProducts || []),
          ...(inc.cardmarketProducts || []).filter(
            (ip) =>
              !(cur.cardmarketProducts || []).some(
                (cp) => cp.productId === ip.productId
              )
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
    const am = a.cardId.match(/-(\d+)/);
    const bm = b.cardId.match(/-(\d+)/);
    if (am && bm) return Number(am[1]) - Number(bm[1]);
    return a.cardId.localeCompare(b.cardId);
  });
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
  const existingRows = [...(ov.variants || [])];
  const byKey = new Map();

  function upsertRow(key, patch = {}) {
    if (!byKey.has(key)) {
      byKey.set(key, {
        ...makeVariantRowFromKey(key),
        ...patch,
      });
      return;
    }

    byKey.set(key, {
      ...byKey.get(key),
      ...patch,
    });
  }

  const baseLockedTypes = getBaseLockedTypes(card);

  if (baseLockedTypes.has("normal")) upsertRow(makeVariantKey("normal", "", ""));
  if (baseLockedTypes.has("holo")) upsertRow(makeVariantKey("holo", "", ""));
  if (baseLockedTypes.has("reverse")) upsertRow(makeVariantKey("reverse", "", ""));

  // TCGPlayer can create multiple rows from one product.
  for (const tp of card.tcgplayerProducts || []) {
    const keys = getTcgplayerVariantKeys(tp);

    for (const key of keys) {
      const current = byKey.get(key) || makeVariantRowFromKey(key);
      if (!safeNum(current.tcgplayer)) {
        upsertRow(key, {
          ...current,
          tcgplayer: String(tp.productId),
        });
      }
    }
  }

  // First pass: explicit Cardmarket-labelled additionals.
  // Pattern-labelled CM additionals prefer matching known patterned rows.
  // Default to holo-pattern row first because White Flare / Black Bolt style
  // pattern products are holo-pattern additionals in the JSON.
  const unresolvedCmAdditionals = [];

  for (const cm of card.cardmarketProducts || []) {
    const isBase = cm.bucket === "base";
    const foil = sanitizeCardmarketVariantLabel(cm);

    if (isBase) continue;

    if (foil) {
      const preferredKeys = [
        makeVariantKey("holo", foil, ""),
        makeVariantKey("reverse", foil, ""),
        makeVariantKey("normal", foil, ""),
      ];

      const targetKey = preferredKeys.find((key) => byKey.has(key)) || preferredKeys[0];
      const current = byKey.get(targetKey) || makeVariantRowFromKey(targetKey);

      if (!safeNum(current.cardmarket)) {
        upsertRow(targetKey, {
          ...current,
          cardmarket: String(cm.productId),
        });
      } else {
        unresolvedCmAdditionals.push(cm);
      }
      continue;
    }

    unresolvedCmAdditionals.push(cm);
  }

  // Second pass: unresolved CM additionals.
  // Prefer known non-base-locked patterned rows in stable foil order, then other
  // non-base-locked rows, then create UNKNOWN rows.
  const assignableRows = [...byKey.entries()]
    .filter(
      ([, row]) =>
        !isBaseLockedVariant(card, row.type, row.foil) &&
        !safeNum(row.cardmarket) &&
        !isUnknownRow(row)
    )
    .map(([key, row]) => ({ key, row }))
    .sort((a, b) => {
      const aRank = getVariantSortRank(a.row.type, a.row.foil);
      const bRank = getVariantSortRank(b.row.type, b.row.foil);
      if (aRank !== bRank) return aRank - bRank;

      const foilDiff = compareFoils(a.row.foil, b.row.foil);
      if (foilDiff !== 0) return foilDiff;

      return a.key.localeCompare(b.key);
    });

  const usedAssignableKeys = new Set();

  for (const cm of unresolvedCmAdditionals) {
    const target = assignableRows.find((candidate) => !usedAssignableKeys.has(candidate.key));

    if (target) {
      usedAssignableKeys.add(target.key);
      upsertRow(target.key, {
        ...byKey.get(target.key),
        cardmarket: String(cm.productId),
      });
      continue;
    }

    // No safe known row left -> preserve as explicit unresolved CM-only row.
    const unknownKey = makeVariantKey(
      "unknown",
      "unknown",
      getUnknownStampFromCardmarketProduct(cm.productId)
    );

    const current = byKey.get(unknownKey) || makeVariantRowFromKey(unknownKey);

    upsertRow(unknownKey, {
      ...current,
      type: "unknown",
      foil: "unknown",
      stamp: getUnknownStampFromCardmarketProduct(cm.productId),
      cardmarket: String(cm.productId),
      tcgplayer: current.tcgplayer || "",
    });
  }

  // Preserve user-edited rows from a previous run — but ONLY after all autofill
  // assignment is complete. This means stale auto-assigned rows (pokeball, masterball,
  // normal, reverse, holo) are discarded and re-derived cleanly. Only rows where the
  // user explicitly set an ID on a genuine unknown (type === "unknown", no synthetic
  // stamp) are restored — these are IDs the user typed in by hand that autofill
  // can never resolve on its own.
  for (const row of existingRows) {
    if (row.type !== "unknown") continue;
    const stamp = String(row.stamp || "");
    if (/^(cm|tcg)-only-/.test(stamp)) continue;
    const hasManualId = safeNum(row.cardmarket) || safeNum(row.tcgplayer);
    if (!hasManualId) continue;
    const key = makeVariantKey(row.type, row.foil || "", stamp);
    upsertRow(key, row);
  }

  const rows = [...byKey.entries()]
    .sort(([keyA], [keyB]) => compareVariantKeys(keyA, keyB))
    .map(([, row]) => row);

  ov.variants = rows;
  next[cardId] = ov;
  return next;
}

function generateCodeBlock(card, override) {
  const baseId = safeNum(card?.baseIds?.[0]);

  let baseTcgId = null;
  const baseTcgProduct = getBaseTcgplayerProduct(card);
  if (baseTcgProduct) {
    baseTcgId = baseTcgProduct.productId;
  }

  const variants = (override?.variants || []).map((v) => ({
    type: clampNonEmptyStr(v.type) || "normal",
    foil: clampNonEmptyStr(v.foil) || "",
    stamp: clampNonEmptyStr(v.stamp) || "",
    cardmarket: clampNonEmptyStr(v.cardmarket) || "",
    tcgplayer: clampNonEmptyStr(v.tcgplayer) || "",
  }));

  const ordered = [...variants].sort((a, b) => {
    const rankDiff = getVariantSortRank(a.type, a.foil) - getVariantSortRank(b.type, b.foil);
    if (rankDiff !== 0) return rankDiff;

    const foilDiff = compareFoils(a.foil, b.foil);
    if (foilDiff !== 0) return foilDiff;

    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return String(a.stamp || "").localeCompare(String(b.stamp || ""));
  });

  const lines = ["variants: ["];
  for (const v of ordered) {
    let cm = safeNum(v.cardmarket);
    let tcg = safeNum(v.tcgplayer);

    if (isBaseLockedVariant(card, v.type, v.foil)) {
      if (baseId) cm = baseId;
      if (baseTcgId) tcg = baseTcgId;
    }

    lines.push("\t{");
    lines.push(`\t\ttype: "${v.type}",`);
    if (v.foil) lines.push(`\t\tfoil: "${v.foil}",`);
    if (v.stamp) lines.push(`\t\tstamp: "${v.stamp}",`);
    lines.push("\t\tthirdParty: {");
    lines.push(`\t\t\tcardmarket: ${cm || "/* MISSING_ID */"},`);
    if (tcg) {
      lines.push(`\t\t\ttcgplayer: ${tcg}`);
    } else {
      lines.push(`\t\t\ttcgplayer: /* MISSING_ID */`);
    }
    lines.push("\t\t}");
    lines.push("\t},");
  }
  lines.push("],");

  return {
    text: lines.join("\n"),
    needsBase:
      ordered.some((v) => isBaseLockedVariant(card, v.type, v.foil)) &&
      !baseId &&
      !baseTcgId,
  };
}

function getEffectiveCmId(v, card) {
  if (isBaseLockedVariant(card, v.type, v.foil)) {
    return card?.baseIds?.[0] || null;
  }
  return safeNum(v.cardmarket) ? Number(v.cardmarket) : null;
}

function getEffectiveTcgId(v, card) {
  if (isBaseLockedVariant(card, v.type, v.foil)) {
    const bp = getBaseTcgplayerProduct(card);
    return bp?.productId || null;
  }
  return safeNum(v.tcgplayer) ? Number(v.tcgplayer) : null;
}

function getCardmarketProductById(card, productId) {
  const numId = safeNum(productId);
  if (!card || !numId) return null;
  return (
    (card.cardmarketProducts || []).find(
      (p) => Number(p.productId) === Number(numId)
    ) || null
  );
}

function getTcgplayerProductById(card, productId) {
  const numId = safeNum(productId);
  if (!card || !numId) return null;
  return (
    (card.tcgplayerProducts || []).find(
      (p) => Number(p.productId) === Number(numId)
    ) || null
  );
}

export default function BulkEditClient() {
  const cmFileRef = useRef(null);
  const tcgFileRef = useRef(null);

  const [sources, setSources] = useState({
    cardmarket: false,
    tcgplayer: false,
  });

  const [cardMapRaw, setCardMapRaw] = useState(new Map());
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [overrides, setOverridesState] = useState({});
  const [copyStatus, setCopyStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    setOverridesState(loadOverrides());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") saveOverrides(overrides);
  }, [overrides]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sbf-header-h",
      `${DEFAULT_HEADER_H}px`
    );
  }, []);

  useEffect(() => {
    setCards(mapToSortedArray(cardMapRaw));
  }, [cardMapRaw]);

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
      const hasTcg = c.tcgplayerIds.length > 0;

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

  function setOverrides(updater) {
    setOverridesState((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  }

  async function handleFileObject(file, sourceType) {
    if (!file) return;

    if (
      !(file.name || "").toLowerCase().endsWith(".json") &&
      file.type !== "application/json"
    ) {
      setStatusMsg("Upload a .json file");
      return;
    }

    try {
      const json = JSON.parse(await file.text());
      const incoming = parseToMap(json);

      setCardMapRaw((prev) => mergeMaps(prev, incoming));
      setSources((prev) => ({ ...prev, [sourceType]: true }));
      setStatusMsg(`Merged ${incoming.size} cards from ${sourceType} (${file.name})`);
    } catch (err) {
      setStatusMsg(`Failed: ${err.message}`);
    }
  }

  async function handleDropFile(file) {
    if (!file) return;

    try {
      const json = JSON.parse(await file.text());
      const sourceType = (json?.meta?.tool || "").includes("tcgplayer")
        ? "tcgplayer"
        : "cardmarket";

      const incoming = parseToMap(json);

      setCardMapRaw((prev) => mergeMaps(prev, incoming));
      setSources((prev) => ({ ...prev, [sourceType]: true }));
      setStatusMsg(`Merged ${incoming.size} cards from ${sourceType} (${file.name})`);
    } catch (err) {
      setStatusMsg(`Failed: ${err.message}`);
    }
  }

  function resetAll() {
    setCardMapRaw(new Map());
    setCards([]);
    setSelectedCardId(null);
    setOverridesState({});
    localStorage.removeItem(APP_STORE_KEY);
    setSources({ cardmarket: false, tcgplayer: false });
    setStatusMsg("");
    setCopyStatus("");
    setIsDragging(false);

    if (cmFileRef.current) cmFileRef.current.value = "";
    if (tcgFileRef.current) tcgFileRef.current.value = "";
  }

  function loadSample() {
    const sample = {
      meta: { tool: "sample" },
      byCardId: {
        "ASC-001": {
          ids: {
            base: [869612],
            additional: [870135, 870136],
            tcgplayer: [675813, 676852, 676992],
          },
          cardmarketProducts: [
            { productId: 869612, name: "Erika's Oddish", variantLabel: "", bucket: "base", canonicalCardId: "ASC-001" },
            { productId: 870135, name: "Erika's Oddish (Poke Ball)", variantLabel: "pokeball", bucket: "additional", canonicalCardId: "ASC-001" },
            { productId: 870136, name: "Erika's Oddish (Energy Symbol Pattern)", variantLabel: "energy", bucket: "additional", canonicalCardId: "ASC-001" },
          ],
          tcgplayerProducts: [
            { productId: 675813, name: "Erika's Oddish", rarity: "Common", printings: ["Normal"] },
            { productId: 676852, name: "Erika's Oddish (Poke Ball)", rarity: "Common", printings: ["Reverse Holofoil"] },
            { productId: 676992, name: "Erika's Oddish (Energy Symbol Pattern)", rarity: "Common", printings: ["Reverse Holofoil"] },
          ],
        },
        "ASC-003": {
          ids: { base: [869614], additional: [], tcgplayer: [675815] },
          cardmarketProducts: [
            { productId: 869614, name: "Erika's Vileplume ex", variantLabel: "", bucket: "base", canonicalCardId: "ASC-003" },
          ],
          tcgplayerProducts: [
            { productId: 675815, name: "Erika's Vileplume ex", rarity: "Double Rare", printings: ["Holofoil"] },
          ],
        },
        "MEG-010": {
          ids: { base: [851081], additional: [851281, 851261], tcgplayer: [654349] },
          cardmarketProducts: [
            { productId: 851081, name: "Meganium", variantLabel: "", bucket: "base", canonicalCardId: "MEG-010" },
            { productId: 851281, name: "Meganium", variantLabel: "", bucket: "additional", canonicalCardId: "MEG-010" },
            { productId: 851261, name: "Meganium", variantLabel: "", bucket: "additional", canonicalCardId: "MEG-010" },
          ],
          tcgplayerProducts: [
            { productId: 654349, name: "Meganium", rarity: "Rare Holo", printings: ["Holofoil", "Reverse Holofoil"] },
          ],
        },
      },
    };

    setCardMapRaw(parseToMap(sample));
    setSources({ cardmarket: true, tcgplayer: true });
    setStatusMsg("Loaded sample");
  }

  function selectCard(cardId) {
    setSelectedCardId(cardId);
    setOverrides((prev) => ensureAutofill(cardsById, prev, cardId));
  }

  function setNotes(value) {
    if (!selectedCardId) return;

    setOverrides((prev) => {
      let next = ensureOverrideShape(prev, selectedCardId);
      return {
        ...next,
        [selectedCardId]: {
          ...next[selectedCardId],
          notes: value,
        },
      };
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
      ensureAutofill(
        cardsById,
        { ...prev, [selectedCardId]: { notes: "", variants: [] } },
        selectedCardId
      )
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

      if (
        (key === "type" || key === "foil") &&
        isBaseLockedVariant(cardsById.get(selectedCardId), row.type, row.foil)
      ) {
        row.cardmarket = "";
        row.tcgplayer = "";
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
    } catch {
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
    await handleDropFile(e.dataTransfer?.files?.[0]);
  }

  const appHeightClass = "min-h-[calc(100vh-var(--sbf-header-h))]";
  const desktopPanelsHeightClass = "md:h-[calc(100vh-var(--sbf-header-h)-12.5rem)]";
  const sourceBadge =
    [sources.cardmarket ? "CM" : null, sources.tcgplayer ? "TCG" : null]
      .filter(Boolean)
      .join(" + ") || "No file loaded";

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className={`w-screen ${appHeightClass} -mx-4 md:-mx-6`}>
        <div className="px-4 md:px-6 py-4">
          <Section
            eyebrow="Tool"
            title="Bulk Edit UI (Variant Editor)"
            subtitle="Upload Cardmarket and/or TCGPlayer export JSONs. Edit variants with IDs from both sources and generate a stable code block."
            showDivider={false}
            fullBleed={true}
          >
            <div className={`mt-4 ${appHeightClass} flex flex-col`}>
              <div
                className={[
                  "surface p-4 md:p-5 mb-4 transition sticky top-[64px] z-10 backdrop-blur shrink-0",
                  isDragging ? "border-white/25 bg-white/[0.06]" : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-[14px] md:text-[16px] font-semibold text-white">
                      Card Variant Editor
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/70">
                      {sourceBadge}
                    </span>

                    {cards.length > 0 && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/50">
                        {cards.length} cards
                      </span>
                    )}

                    {isDragging && (
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[12px] text-white/80">
                        Drop JSON to merge
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      ref={cmFileRef}
                      type="file"
                      accept=".json"
                      onChange={(e) => handleFileObject(e.target.files?.[0], "cardmarket")}
                      className="sr-only"
                    />
                    <input
                      ref={tcgFileRef}
                      type="file"
                      accept=".json"
                      onChange={(e) => handleFileObject(e.target.files?.[0], "tcgplayer")}
                      className="sr-only"
                    />

                    <button
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
                      onClick={() => cmFileRef.current?.click()}
                      type="button"
                    >
                      Upload Cardmarket
                    </button>

                    <button
                      className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-[12px] font-semibold text-indigo-200 hover:bg-indigo-500/15 transition"
                      onClick={() => tcgFileRef.current?.click()}
                      type="button"
                    >
                      Upload TCGPlayer
                    </button>

                    <Link
                      href="/tools/cardmarket-exporter"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
                    >
                      CM script
                    </Link>

                    <Link
                      href="/tools/tcgplayer-exporter"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
                    >
                      TCG exporter
                    </Link>

                    <button
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition"
                      onClick={loadSample}
                      type="button"
                    >
                      Sample
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

                {statusMsg && <div className="mt-2 text-[12px] text-white/55">{statusMsg}</div>}

                <div className="mt-2 text-[12px] text-white/40">
                  Tip: drag & drop any JSON — source is auto-detected from <code>meta.tool</code>.
                </div>
              </div>

              <div
                className={`grid gap-4 md:grid-cols-12 md:items-stretch flex-1 min-h-0 ${desktopPanelsHeightClass}`}
              >
                <div className="md:col-span-7 min-h-0 flex flex-col max-h-[2790px]">
                  <div className="surface p-4 md:p-5 flex flex-col min-h-0 h-full max-h-content">
                    <div className="shrink-0">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="text-[12px] font-semibold text-white">Cards</div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70">
                          {filteredCards.length} shown
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-12">
                        <div className="md:col-span-7">
                          <label className="block text-[11px] text-white/55 mb-2">Search cardId</label>
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="e.g. ASC-051"
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                          />
                        </div>

                        <div className="md:col-span-5">
                          <label className="block text-[11px] text-white/55 mb-2">Filter</label>
                          <select
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                          >
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
                            const hasBase = c.baseIds.length > 0;
                            const hasAdd = c.additionalIds.length > 0;
                            const hasTcg = c.tcgplayerIds.length > 0;
                            const isSelected = c.cardId === selectedCardId;
                            const note = (overrides[c.cardId]?.notes || "").trim();

                            return (
                              <button
                                key={c.cardId}
                                onClick={() => selectCard(c.cardId)}
                                className={[
                                  "text-left rounded-2xl border px-3 py-3 transition bg-black/30 hover:bg-black/40",
                                  isSelected ? "border-white/30" : "border-white/10",
                                ].join(" ")}
                                type="button"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="text-[12px] font-semibold text-white">{c.cardId}</div>
                                  <div className="flex gap-1">
                                    {hasBase && <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/60">CM</span>}
                                    {hasTcg && <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-1.5 py-0.5 text-[9px] text-indigo-300">TCG</span>}
                                  </div>
                                </div>

                                <div className="mt-2 text-[10px] text-white/50 space-y-0.5">
                                  <div>base: <span className="text-white/75 font-semibold">{hasBase ? c.baseIds.join(", ") : "—"}</span></div>
                                  <div>add: <span className="text-white/75 font-semibold">{hasAdd ? c.additionalIds.join(", ") : "—"}</span></div>
                                  <div>tcg: <span className="text-indigo-300/75 font-semibold">{hasTcg ? c.tcgplayerIds.join(", ") : "—"}</span></div>
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

                <div className="md:col-span-5 min-h-0 flex flex-col">
                  <div className="surface p-4 md:p-5 flex flex-col min-h-0 h-full">
                    <div className="flex items-center justify-between gap-3 flex-wrap shrink-0">
                      <div className="text-[12px] font-semibold text-white">Editor</div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={autofillNow}
                          type="button"
                          disabled={!selectedCardId}
                        >
                          Autofill
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

                    <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
                      {!selectedCardId ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[12px] text-white/70">
                          Select a card to edit variants.
                          <div className="mt-3 text-white/50">
                            <b>normal</b>, <b>reverse</b>, and holo-only base variants lock to base IDs.
                            <br />
                            Foil variants get their own IDs from either or both sources.
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <div className="text-[14px] font-semibold text-white">{selectedCardId}</div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                              CM base: {selectedCard?.baseIds?.[0] || "—"}
                            </span>
                            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300">
                              TCG: {selectedCard?.tcgplayerIds?.length || 0} products
                            </span>
                          </div>

                          {selectedCard?.cardmarketProducts?.length > 0 && (
                            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                              <div className="text-[11px] font-semibold text-white mb-2">Cardmarket products</div>

                              <div className="space-y-1">
                                {selectedCard.cardmarketProducts.map((cm) => (
                                  <div
                                    key={cm.productId}
                                    className="text-[11px] text-white/60 flex items-center gap-2 flex-wrap"
                                  >
                                    <a
                                      href={`https://product-images.s3.cardmarket.com/51/ASC/${cm.productId}/${cm.productId}.jpg`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-mono text-white/80 hover:text-white transition"
                                    >
                                      {cm.productId}
                                    </a>

                                    <span>{cm.name || "Unnamed Cardmarket product"}</span>

                                    {getDisplayVariantLabel(cm) && (
                                      <span className="text-white/35">
                                        ({getDisplayVariantLabel(cm)})
                                      </span>
                                    )}

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
                                  <div
                                    key={tp.productId}
                                    className="text-[11px] text-white/60 flex items-center gap-2 flex-wrap"
                                  >
                                    <a
                                      href={`https://www.tcgplayer.com/product/${tp.productId}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-mono text-indigo-300/80 hover:text-indigo-200 transition"
                                    >
                                      {tp.productId}
                                    </a>

                                    <span>{tp.name}</span>

                                    {tp.printings?.length > 0 && (
                                      <span className="text-white/40">
                                        ({tp.printings.join(", ")})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3">
                            <label className="block text-[11px] text-white/55 mb-1">Notes (local only)</label>
                            <input
                              value={selectedOverride?.notes || ""}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="e.g. needs pokeball mapping"
                              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                            />
                          </div>

                          <div className="mt-3 flex gap-2 flex-wrap">
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
                              const locked = isBaseLockedVariant(selectedCard, v.type, v.foil);
                              const effectiveCm = getEffectiveCmId(v, selectedCard);
                              const effectiveTcg = getEffectiveTcgId(v, selectedCard);
                              const matchedCmProduct = getCardmarketProductById(
                                selectedCard,
                                effectiveCm
                              );
                              const matchedTcgProduct = getTcgplayerProductById(
                                selectedCard,
                                effectiveTcg
                              );

                              return (
                                <div
                                  key={`${idx}-${v.type}-${v.foil}-${v.stamp || ""}`}
                                  className="rounded-2xl border border-white/10 bg-black/30 p-3"
                                >
                                  <div className="grid gap-3 grid-cols-2">
                                    <div>
                                      <label className="block text-[11px] text-white/55 mb-1">Type</label>
                                      <select
                                        value={v.type}
                                        onChange={(e) => updateVariant(idx, "type", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                                      >
                                        {TYPE_OPTIONS.map((t) => (
                                          <option key={t} value={t}>{t}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-[11px] text-white/55 mb-1">Foil</label>
                                      <select
                                        value={v.foil || ""}
                                        onChange={(e) => updateVariant(idx, "foil", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                                      >
                                        {FOIL_OPTIONS.map((f) => (
                                          <option key={f || "none"} value={f}>{f || "none"}</option>
                                        ))}
                                      </select>
                                    </div>

                                    <div className="col-span-2">
                                      <label className="block text-[11px] text-white/55 mb-1">Stamp</label>
                                      <input
                                        value={v.stamp || ""}
                                        onChange={(e) => updateVariant(idx, "stamp", e.target.value)}
                                        placeholder="optional"
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[13px] text-white outline-none"
                                      />
                                      {isUnknownRow(v) && (
                                        <div className="mt-1 text-[10px] text-amber-300/70">
                                          {getUnknownRowLabel(v)}
                                        </div>
                                      )}
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
                                        placeholder={locked ? "locked to base" : "optional"}
                                        className={`w-full rounded-xl border px-3 py-2 text-[13px] outline-none bg-black/30 text-white ${
                                          locked ? "border-white/5 text-white/50" : "border-white/10"
                                        }`}
                                      />

                                      {locked && effectiveCm && (
                                        <div className="mt-1 text-[10px] text-white/40">→ {effectiveCm}</div>
                                      )}

                                      {matchedCmProduct?.name && (
                                        <div className="mt-1 text-[10px] text-white/50">
                                          {matchedCmProduct.name}
                                          {getDisplayVariantLabel(matchedCmProduct) && (
                                            <span className="text-white/30">
                                              {" "}• {getDisplayVariantLabel(matchedCmProduct)}
                                            </span>
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
                                        placeholder={locked ? "locked to base" : "optional"}
                                        className={`w-full rounded-xl border px-3 py-2 text-[13px] outline-none bg-black/30 text-indigo-200 ${
                                          locked
                                            ? "border-indigo-500/10 text-indigo-200/50"
                                            : "border-indigo-500/20"
                                        }`}
                                      />

                                      {locked && effectiveTcg && (
                                        <div className="mt-1 text-[10px] text-indigo-300/40">→ {effectiveTcg}</div>
                                      )}

                                      {matchedTcgProduct?.name && (
                                        <div className="mt-1 text-[10px] text-indigo-300/55">{matchedTcgProduct.name}</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-3">
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
                                  ⚠ No base IDs — base-locked rows can&apos;t be resolved.
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="surface p-4 md:p-5 mt-4 shrink-0">
                    <div className="text-[12px] font-semibold text-white">Documentation</div>

                    <p className="mt-2 text-[13px] leading-relaxed text-muted">
                      Upload one or both source JSONs. Cards are merged by ID (e.g. <code>ASC-001</code>).
                    </p>

                    <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-3 text-[12px] text-white/70 space-y-1">
                      <div><span className="text-white/90 font-semibold">Cardmarket JSON</span> → from the Tampermonkey exporter script</div>
                      <div><span className="text-indigo-300 font-semibold">TCGPlayer JSON</span> → from the TCGPlayer Set Exporter tool</div>
                    </div>

                    <ul className="mt-3 space-y-1 text-[12px] text-white/60">
                      <li>• <b>normal</b> / <b>holo</b> always output before <b>reverse</b></li>
                      <li>• Base rows lock to base IDs only when they are actual base rows for that card</li>
                      <li>• Variants can exist with Cardmarket only, TCGPlayer only, or both</li>
                      <li>• Extra unresolved Cardmarket additionals are preserved as <b>unknown</b> rows instead of being guessed incorrectly</li>
                      <li>• Foil types: pokeball, masterball, loveball, friendball, quickball, team-rocket, duskball, energy</li>
                      <li>• TCGPlayer products are used as the primary source for variation identity when available</li>
                      <li>• Cardmarket labels are sanitized before mapping</li>
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
// lib/tcgplayer-exporter.js
//
// Extracted from TCGPlayerExporterClient.js
// UPDATED (2026-04-09)
// - Removed all React / UI code
// - Kept only exporter logic
// - Added USER_AGENT header for all API requests
// - Intended for server-side / Node / API route usage only
//
// IMPORTANT:
// This must NOT run in the browser.
// TCGCSV is blocking browser-origin fetches via CORS.
// Also, User-Agent is not a browser-settable header in normal client fetches.

const API_BASE = "https://tcgcsv.com/tcgplayer";
const POKEMON_CATEGORY = 3;
const USER_AGENT = "Dev-SBF/1.0.0";

/**
 * Pads a number/string to 3 digits.
 * Example: 1 -> 001
 */
function pad3(n) {
  const s = String(n).replace(/^0+/, "") || "0";
  return s.length >= 3 ? s : s.padStart(3, "0");
}

/**
 * Extract the numeric leading portion of a card number.
 * Example:
 *   "12" -> "12"
 *   "12a" -> "12"
 *   "001/198" -> "001"
 */
function parseCardNumber(numStr) {
  if (!numStr) return null;
  const m = String(numStr).match(/^(\d+)/);
  return m ? m[1] : null;
}

/**
 * Build canonical card id: SETCODE-NNN
 */
function canonicalId(setCode, numStr) {
  const n = parseCardNumber(numStr);
  if (!setCode || !n) return null;
  return `${String(setCode).toUpperCase()}-${pad3(n)}`;
}

/**
 * Internal fetch wrapper.
 * Server-side only.
 */
async function apiFetch(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "User-Agent": USER_AGENT,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `TCGCSV request failed: ${response.status} ${response.statusText} (${path})`
    );
  }

  return response.json();
}

/**
 * Fetch all Pokémon groups.
 */
async function fetchGroups() {
  const data = await apiFetch(`/${POKEMON_CATEGORY}/groups`);

  return (data.results || []).sort(
    (a, b) => new Date(b.publishedOn) - new Date(a.publishedOn)
  );
}

/**
 * Fetch all products for a TCGPlayer group.
 */
async function fetchProducts(groupId) {
  const data = await apiFetch(`/${POKEMON_CATEGORY}/${groupId}/products`);
  return data.results || [];
}

/**
 * Fetch all prices for a TCGPlayer group.
 */
async function fetchPrices(groupId) {
  const data = await apiFetch(`/${POKEMON_CATEGORY}/${groupId}/prices`);
  return data.results || [];
}

/**
 * Build card map from products + prices.
 */
function buildCardMap(products, prices, setCode) {
  const priceMap = {};

  for (const p of prices) {
    if (!priceMap[p.productId]) priceMap[p.productId] = [];
    priceMap[p.productId].push(p);
  }

  const cardMap = new Map();

  for (const prod of products) {
    const ext = {};

    for (const e of prod.extendedData || []) {
      ext[e.name] = e.value;
    }

    if (!ext.Number) continue;

    const cid = canonicalId(setCode, ext.Number);
    if (!cid) continue;

    if (!cardMap.has(cid)) {
      cardMap.set(cid, {
        cardId: cid,
        number: ext.Number,
        products: [],
      });
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
      const an = parseInt(parseCardNumber(a[1].number), 10) || 0;
      const bn = parseInt(parseCardNumber(b[1].number), 10) || 0;
      return an - bn;
    })
  );
}

/**
 * Build final export payload.
 */
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
      note:
        "ids.tcgplayer contains all TCGPlayer productIds for this card (base + variant patterns). ids.base/additional are empty — merge with Cardmarket export. tcgplayerProducts has per-product detail including printing subtypes.",
    },
    stats: {
      mergedKeys: Object.keys(byCardId).length,
    },
    byCardId,
  };
}

/**
 * Export a full set by explicit groupId + setCode.
 */
async function exportSet({ groupId, setCode, groupName = "" }) {
  if (!groupId) {
    throw new Error("exportSet requires groupId");
  }

  if (!setCode) {
    throw new Error("exportSet requires setCode");
  }

  const [products, prices] = await Promise.all([
    fetchProducts(groupId),
    fetchPrices(groupId),
  ]);

  const normalizedSetCode = String(setCode).toUpperCase();
  const cardMap = buildCardMap(products, prices, normalizedSetCode);

  return buildExportPayload(
    cardMap,
    normalizedSetCode,
    groupId,
    groupName
  );
}

/**
 * Export a set by lookup against groupId / abbreviation / exact name.
 */
async function exportSetByLookup(lookup, setCodeOverride = "") {
  const groups = await fetchGroups();
  const q = String(lookup).trim().toLowerCase();

  const group = groups.find((g) => {
    return (
      String(g.groupId) === q ||
      String(g.abbreviation || "").toLowerCase() === q ||
      String(g.name || "").toLowerCase() === q
    );
  });

  if (!group) {
    throw new Error(`No TCGPlayer group found for lookup "${lookup}"`);
  }

  const setCode = (setCodeOverride || group.abbreviation || "SET").toUpperCase();

  return exportSet({
    groupId: group.groupId,
    setCode,
    groupName: group.name,
  });
}

/**
 * Pretty stringify helper for file output / clipboard / logging.
 */
function stringifyExport(payload) {
  return JSON.stringify(payload, null, 2);
}

export {
  API_BASE,
  POKEMON_CATEGORY,
  USER_AGENT,
  pad3,
  parseCardNumber,
  canonicalId,
  fetchGroups,
  fetchProducts,
  fetchPrices,
  buildCardMap,
  buildExportPayload,
  exportSet,
  exportSetByLookup,
  stringifyExport,
};
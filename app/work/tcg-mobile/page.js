// app/work/tcg-mobile/page.js
import CaseStudy from "../../../components/CaseStudy";

export const metadata = {
  title: "SixByFive TCG Mobile — SixByFive Studio",
  description: "Android companion app for the SixByFive TCG platform — full feature parity built with Expo and React Native.",
};

const data = {
  title: "SixByFive TCG Mobile",
  tagline: "Full feature parity with the TCG platform — on Android, with a native feel.",
  type: "Mobile app",
  role: "Built & maintained",
  status: "Beta",
  year: "2024–present",

  problem: [
    "The web platform works well on desktop, but collectors use their phones — at card shows, pulling up a binder to show someone, checking a price before buying a card across a table. A browser tab on mobile is functional but it's not the right experience for those moments.",
    "The goal wasn't a stripped-down companion app or a marketing page that links to the web. It was full parity: everything you can do on the web platform, working natively on Android, using the same data and the same account.",
  ],

  approach: {
    body: [
      "Expo was the right choice for a team already working primarily in React and TypeScript — the component model is familiar, the tooling is mature, and the managed workflow means we're not maintaining native build infrastructure as a side job. React Native's bridge to the platform gives us access to native APIs where we need them without writing Java or Kotlin.",
      "The GraphQL API that backs the web platform serves the mobile app directly — no separate mobile backend, no API versioning split to maintain. The data layer is shared; only the presentation layer is different.",
    ],
    decisions: [
      "Expo managed workflow — avoids native build complexity, keeps the focus on product rather than toolchain",
      "Shared GraphQL API — one backend, one source of truth, no mobile-specific endpoints to maintain",
      "Android-first — single platform to start, ship something solid before expanding",
      "React Navigation for routing — familiar mental model, good performance on Android",
      "Feature parity as the target — no artificial limitations relative to the web platform",
    ],
  },

  built: {
    items: [
      "Card and set search — full-text and filtered search with the same index as the web platform",
      "Collection tracker — add cards by variant, update quantities, view portfolio valuation",
      "Binder builder — organise and browse a binder layout natively on-screen",
      "Live pricing — Cardmarket and TCGPlayer prices per variant, updated by the same daily pipeline",
      "Account sync — shared account with the web platform, collection and binders available on both",
      "Offline-tolerant browsing — recently viewed sets and collection data available without a connection",
    ],
  },

  whatWasHard: [
    {
      title: "Making search feel right on mobile",
      body: "Search on a phone is a different interaction to search on desktop. The keyboard takes up half the screen, results need to load fast enough that the experience feels responsive, and the information density per result has to be lower — you can't show the same amount per card as a desktop table row. Redesigning the search result format for a narrow screen without losing the information that makes a result useful (set, variant type, price) took more iteration than expected.",
    },
    {
      title: "Binder layout on a small screen",
      body: "The binder builder on web shows a grid of cards you can arrange and browse. On mobile, that grid has to work at a much smaller scale — cards are tiny, drag-and-drop is replaced by tap interactions, and the navigation between binder pages needs to feel natural on a touchscreen. Getting this right meant rethinking the interaction model rather than porting the web version directly.",
    },
    {
      title: "Expo build pipeline and OTA updates",
      body: "Expo's managed workflow handles a lot, but the build and submission pipeline for Android still has sharp edges — keystore management, versioning, EAS Build configuration. Setting this up in a way that's repeatable and doesn't require archaeological knowledge of what was done last time took careful documentation. Over-the-air updates via Expo are valuable for shipping fixes without a full store submission, but they require care about what can and can't be updated OTA.",
    },
  ],

  stack: [
    { label: "Framework",  value: "Expo · React Native" },
    { label: "Language",   value: "TypeScript" },
    { label: "Navigation", value: "React Navigation" },
    { label: "API",        value: "GraphQL — shared with web platform" },
    { label: "Auth",       value: "Shared account system — same session as web" },
    { label: "Build",      value: "EAS Build · OTA updates via Expo" },
    { label: "Platform",   value: "Android (iOS planned)" },
  ],

  outcomes: [
    "Full feature parity with the web platform on Android",
    "Single GraphQL API serving both web and mobile — no backend duplication",
    "Shared account and collection sync across web and mobile",
    "OTA update capability for fixes without full store submissions",
    "Foundation in place for iOS expansion without significant rework",
  ],

  note: "Currently in beta. Android-only for now — iOS is the natural next step once the Android experience is fully stable.",

  nextProject: { href: "/work/3d-printing-portal", title: "3D Printing Portal" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}
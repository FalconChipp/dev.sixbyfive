// app/work/kora/page.js
import CaseStudy from "@/app/components/CaseStudy";

export const metadata = {
  title: "Kora — SixByFive Studio",
  description: "An outcomes platform built for residential young person care — shifting teams from manual paperwork to automatic insight.",
};

const data = {
  title: "Kora",
  tagline: "An outcomes platform for residential young person care — moving teams from manual paperwork to automatic insight.",
  type: "Vertical SaaS",
  role: "Built & maintained",
  status: "Pre-launch",
  year: "2026",
  externalHref: "https://koraplatform.co.uk",
  externalLabel: "Visit Kora ↗",

  problem: [
    "Residential care teams for young people generate enormous volumes of data — daily logs, incident reports, medication records, school attendance, family contact — but the recording process is entirely disconnected from any analytical layer. Teams write it all down and none of it talks to anything else. The insights that could change how a young person is supported stay buried in individual log entries.",
    "The result is that practitioners spend a significant part of each shift on recording and reporting rather than on direct care — and yet still lack the visibility to identify patterns early, prepare for inspections confidently, or demonstrate placement stability to funding bodies with evidence. The problem isn't effort. It's that the tools in use require humans to do what software should be doing automatically.",
  ],

  approach: {
    body: [
      "The starting point was direct observation of how residential care teams actually work day to day — not the idealised process from a policy document, but the real sequence of recording tasks from shift handover to incident follow-up. From this we built a data model that treats the young person's profile as the centre of everything, with all recording activity feeding into a single timeline rather than living in isolated forms.",
      "The analytical layer was designed from the outset to run automatically. Practitioners record in the normal flow of their shift, and the platform surfaces pattern detection, correlations, and alerts without any additional reporting effort. The goal was to make insight emerge from work teams are already doing, rather than adding a separate analysis step on top.",
    ],
    decisions: [
      "Living profiles as the primary data model — all records anchor to the young person, not the form type or date",
      "Shift-based daily logs with structured fields — fast, predictable input that produces consistent structured data",
      "Automatic pattern detection over manual reporting — correlations between mood, incidents, sleep, and contact surface without configuration",
      "Role-based access with five permission levels — staff, seniors, managers, placing authorities, and read-only inspection access",
      "Multi-home isolation at the database level — homes share no data by default",
      "Offline-capable desktop app — care homes have unreliable connectivity; recording must work regardless",
      "UK data residency and GDPR tooling built in from the start, not retrofitted",
    ],
  },

  built: {
    body: [
      "The platform covers the full recording and insight lifecycle for a residential care home: daily shift recording, statutory compliance, and the analytical layer that connects them.",
    ],
    items: [
      "Living Profiles — continuously updated records per young person covering goals, achievements, education, health, family contact, and wellbeing",
      "Timeline view — chronological display of all records including incidents, moods, notes, school reports, and contact logs",
      "Daily logs — shift-based structured recording covering mood, behaviour, sleep, appetite, and activity",
      "Incident recording — structured forms with severity grading, body maps, immediate actions, and timestamped follow-up tracking",
      "Medication tracking — administered doses, PRN usage, refusals, and auto-generated weekly summaries",
      "School attendance — records attendance, engagement, and communication; correlates school patterns with home data",
      "Family contact log — documents contact frequency, type, and quality with automatic mood and behaviour correlation",
      "Goal tracking — short and long-term objectives with automatic evidence surfacing over time",
      "Automated pattern detection — identifies correlations across sleep, mood, behaviour, incidents, and contact data",
      "Behaviour dashboards — visual trend displays with drill-down across configurable timeframes",
      "Alert thresholds — custom automated alerts triggered by preset conditions",
      "One-click report generation — LAC reviews and statutory summaries produced in seconds",
      "Inspection-ready exports — outcome evidence formatted for regulatory inspection",
      "Funding body reports — placement authority documentation with stability and cost data",
      "Audit trail — timestamped, attributed, immutable records on every change",
      "Role-based access — five permission levels from frontline staff to inspection read-only",
      "Multi-home isolation — separate database boundaries per home",
      "Offline capability — desktop app records without connectivity and syncs automatically",
    ],
  },

  whatWasHard: [
    {
      title: "Designing for genuinely constrained environments",
      body: "Residential care homes are not office environments. Staff are physically active, often managing a young person's immediate needs, and using the platform on a shared device between tasks. Every recording flow had to be fast to start, tolerant of interruption, and completable in under a minute for routine entries. The incident recording flow — often filled in immediately after a difficult situation — needed to be structured enough to capture the legally required information while being achievable under stress. Getting this right required direct observation and significant iteration on the input flows.",
    },
    {
      title: "Automatic pattern detection that earns trust",
      body: "Surfacing automated correlations in a care context carries real responsibility. If the platform flags a pattern incorrectly, or frames a correlation in a way that leads to a wrong conclusion about a young person, the consequences matter. We had to think carefully about how correlations are presented — the difference between 'there is a pattern here worth looking at' and 'this is the cause' — and design the visualisation and language around that distinction. Alert thresholds are configurable rather than fixed, and dashboards always show underlying data alongside the inferred pattern.",
    },
    {
      title: "Statutory reporting that matches real forms",
      body: "LAC reviews, placement stability reports, and funding body documentation have specific formats that vary by local authority. One-click generation only works if the output matches what the recipient expects. Building the templating layer required working through real examples of each report type, mapping which fields correspond to which recorded data, and extending the data model where the standard daily log didn't capture something the report required.",
    },
    {
      title: "Offline-first with reliable sync",
      body: "Care homes often have poor or intermittent connectivity, so offline recording is a hard requirement rather than a nice-to-have. The sync layer needed to handle conflict resolution when the same record is updated in two places — particularly relevant for shift handovers where multiple staff might log entries in overlapping windows. Getting this to be invisible and reliable rather than a source of friction required careful design of the sync protocol and thorough testing across connectivity scenarios.",
    },
  ],

  stack: [
    { label: "Platform",    value: "Desktop app · web portal · offline-capable" },
    { label: "Backend",     value: "REST API · Node.js" },
    { label: "Database",    value: "PostgreSQL · per-home isolation · audit schema" },
    { label: "Reporting",   value: "Templated statutory report generation" },
    { label: "Auth",        value: "Role-based access · five permission levels" },
    { label: "Compliance",  value: "UK data residency · GDPR tooling · immutable audit trail" },
    { label: "Sync",        value: "Offline-first · automatic background sync" },
  ],

  outcomes: [
    "Full residential care recording workflow from shift log to statutory report in a single platform",
    "Automated pattern detection surfacing correlations that teams previously identified manually — or missed entirely",
    "One-click statutory report generation reducing hours of preparation to seconds",
    "Inspection-ready evidence exports giving homes confidence ahead of regulatory visits",
    "Offline-capable recording ensuring no data loss in low-connectivity environments",
    "Role-based access model covering all stakeholder types from frontline staff to funding bodies",
  ],

  notBuilt: [
    "Financial management or full placement costing — funding body reports show stability data, not full cost modelling",
    "Multi-agency case management — Kora is scoped to the residential home, not the wider multi-agency team",
    "Direct API integration with local authority systems — exports are structured for submission, not live-connected",
  ],

  nextProject: { href: "/work/3d-printing-portal", title: "3D Printing Portal" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}

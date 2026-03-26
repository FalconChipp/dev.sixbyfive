// app/work/3d-printing-portal/page.js
import CaseStudy from "../../../components/CaseStudy";

export const metadata = {
  title: "3D Printing Portal — SixByFive Studio",
  description: "A workflow portal replacing spreadsheets and email for a 3D printing service business.",
};

const data = {
  title: "3D Printing Portal",
  tagline: "A workflow portal that replaced spreadsheets and email with a system that actually fits how the business operates.",
  type: "Vertical SaaS",
  role: "Built & maintained",
  status: "Live",
  year: "2024",
  externalHref: "https://3dprinting.sixbyfive.com",
  externalLabel: "View portal ↗",

  problem: [
    "The client ran a 3D printing service handling print-on-demand requests for customers — custom parts, models, and prototypes. The operation was entirely manual: quote requests came in by email, files were attached to threads, status updates were sent by hand, and job tracking lived in a spreadsheet that only one person could update at a time.",
    "As volume grew, this stopped working. Jobs got missed. Customers chased status. The team spent significant time each week on coordination that a system should be handling. The client needed something that matched how print jobs actually flow — from request to quote to production to delivery — without forcing them into a generic project management tool that didn't fit.",
  ],

  approach: {
    body: [
      "The first step was mapping the existing process accurately — not the idealised version, but what actually happened day to day, including the edge cases and the workarounds. From that, we defined the job lifecycle: the states a job passes through, who can transition it, and what information is needed at each stage.",
      "We built the customer-facing flow and the admin flow as distinct surfaces with a shared data model. Customers see a simple request form and a status page. Operators see the full queue with all the detail they need to act. Neither surface is cluttered with things that aren't relevant to that role.",
    ],
    decisions: [
      "Model job states explicitly rather than using free-form status fields — prevents ambiguity and makes the audit trail reliable",
      "File upload at request time — customers attach print files with their initial request, not in a follow-up email",
      "Email notifications at each state transition — customers get updates without needing to log in and check",
      "Audit trail on every state change — who changed it, when, and from what state",
      "Admin view as the operational source of truth — the dashboard replaces the spreadsheet entirely",
    ],
  },

  built: {
    body: [
      "Two main surfaces: a customer-facing request and status flow, and an admin dashboard for operators. Both backed by the same job model and transition logic.",
    ],
    items: [
      "Customer quote request form — material, quantity, notes, and file upload in one flow",
      "File handling — uploads stored reliably, accessible to operators throughout the job lifecycle",
      "Job status page — customers see current status without needing to contact the team",
      "Admin job queue — full list of active and historical jobs with filters by status and date",
      "State transition UI — operators move jobs through the lifecycle with a single action, triggering downstream effects",
      "Automated email notifications — sent to customers at each stage: received, quoted, in production, dispatched",
      "Audit log — every state change recorded with timestamp and actor",
      "Quote response flow — operators can send a quote back to the customer directly from the admin view",
    ],
  },

  whatWasHard: [
    {
      title: "Modelling the real job lifecycle",
      body: "The first version of the state machine didn't match reality. There were edge cases the client handled regularly that the initial model didn't account for — jobs that needed re-quoting after a file revision, orders that split into multiple print runs, requests that were declined before quoting. Getting this right required going back to the actual process rather than the idealised version, and building enough flexibility into the state model to handle the variants without making it complicated to use day-to-day.",
    },
    {
      title: "File handling reliability",
      body: "Customers upload print files that can be large — STL and similar formats for 3D models aren't small. The upload flow needed to handle slow connections, large files, and the occasional failure gracefully, with clear feedback and retry capability. Files also needed to remain accessible to operators throughout the job lifecycle, which means storage handling that doesn't lose things when a job changes state.",
    },
    {
      title: "Email that actually gets sent",
      body: "Transactional email sounds simple until you've dealt with deliverability, template consistency, and the operational anxiety of not knowing whether a notification went out. We set up a proper transactional email provider, structured the notification triggers to be idempotent (so a retry doesn't send duplicate emails), and added visibility in the admin view showing what notifications have been sent for each job.",
    },
  ],

  stack: [
    { label: "Frontend",  value: "Next.js · React" },
    { label: "Backend",   value: "Node.js · REST API" },
    { label: "Database",  value: "PostgreSQL · job and audit log schema" },
    { label: "Files",     value: "Cloud storage · multipart upload handling" },
    { label: "Email",     value: "Transactional provider · templated notifications" },
    { label: "Auth",      value: "Customer accounts · admin role separation" },
  ],

  outcomes: [
    "Quote request to dispatch handled entirely within the portal — no email coordination required",
    "Customers self-serve status checks rather than chasing the team",
    "Full audit trail on every job — who did what and when",
    "Significant reduction in time spent on operational coordination each week",
    "System that scales with volume without adding admin overhead",
  ],

  notBuilt: [
    "Payment processing — quotes are agreed off-platform, invoiced separately",
    "Inventory or material management — out of scope for this engagement",
    "Customer accounts with order history — all jobs accessible to operators, customers access via job link",
  ],

  nextProject: { href: "/work/admin-dashboard", title: "TCG Admin Dashboard" },
};

export default function Page() {
  return <CaseStudy data={data} />;
}
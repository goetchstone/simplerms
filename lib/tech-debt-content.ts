// lib/tech-debt-content.ts
// Source data for the Tech Debt Checklist PDF and the 1-hour consultation
// framework. Same data structure pattern as framework-content.ts so the PDF
// generator can stay focused on layout. Keep content here; layout lives in
// server/pdf/tech-debt.tsx.

export interface ChecklistCategory {
  number: number;
  title: string;
  intro: string;
  questions: string[];
}

export const TECH_DEBT_CATEGORIES: ChecklistCategory[] = [
  {
    number: 1,
    title: "The Hardware",
    intro:
      "Every piece of equipment whose failure stops the business or slows it down. Tablets, laptops, desktops, routers, printers, terminals, the kitchen display, the camera box. List them. Then ask each question for each piece.",
    questions: [
      "What does this piece do, and who depends on it day-to-day?",
      "How old is it? When was it purchased?",
      "Is the warranty still active? When does it expire?",
      "When does the manufacturer stop releasing security updates, firmware, or replacement parts?",
      "What happens to operations the day this piece fails?",
      "Has a replacement been identified and budgeted, with a target date?",
    ],
  },
  {
    number: 2,
    title: "The Software",
    intro:
      "Every program the business actually runs on — point-of-sale, accounting, payroll, scheduling, inventory, the random utility nobody remembers installing.",
    questions: [
      "What software does each business function depend on?",
      "Which licenses are tied to specific hardware — dongles, registry keys, device IDs?",
      "Which licenses are tied to specific user accounts? What happens if that person leaves?",
      "Are you actually using everything you're paying for?",
      "Is the version you're running still supported by the vendor? When does that end?",
      "If the vendor disappeared tomorrow, do you have what you need to keep running?",
    ],
  },
  {
    number: 3,
    title: "The Data",
    intro:
      "Customer records, transaction history, accounting, payroll, scheduling, email. Anything the business would be in trouble without.",
    questions: [
      "Where does each kind of business data live? (Local device, server, cloud service, vendor system.)",
      "Is each location backed up?",
      "Where do the backups live — same building, cloud, offsite?",
      "When was the backup last tested with an actual restore? Not just \"are backups running.\" Actually restored.",
      "Who has the credentials to recover the data if the primary copy is lost?",
      "If the device storing this data dies tonight, what's lost and how long is recovery?",
    ],
  },
  {
    number: 4,
    title: "The Network",
    intro:
      "Internet, router, firewall, wireless. The plumbing that everything else depends on.",
    questions: [
      "What internet service(s) does the business have? Single provider or failover?",
      "Who maintains the router and firewall? When did they last receive a firmware update?",
      "Are the guest and internal wireless networks separated?",
      "Is the wireless using current encryption? Are the default admin passwords changed?",
      "What's the public-facing presence — website, online ordering, customer portal? Who maintains it?",
      "If the internet goes down tomorrow, can the business still process payments?",
    ],
  },
  {
    number: 5,
    title: "The Vendors",
    intro:
      "Every recurring charge on the bank statement. Every auto-renewing contract. Every subscription paid out of habit.",
    questions: [
      "List every recurring charge — software subscriptions, equipment leases, processing fees, hosting, monitoring, anything.",
      "For each: when did it start, and when was the rate last reviewed?",
      "Payment processor: what's your current effective rate? When did you last benchmark against the market?",
      "Equipment leases: are you still using everything you're paying for? Anything left over from a closed location?",
      "Software subscriptions: any orphaned, duplicate, or genuinely unused?",
      "Auto-renewal terms: when does each next renew, and how much notice is required to cancel?",
    ],
  },
  {
    number: 6,
    title: "The Identity & Access",
    intro:
      "Who controls the keys. The single most overlooked piece of small-business IT — and the most expensive to recover from when it goes wrong.",
    questions: [
      "Who controls the domain name (yourbusiness.com)? When does it renew?",
      "Who has admin access to the business email account?",
      "Who has admin access to the cloud platforms — Google, Microsoft, Apple Business?",
      "What happens if the person with admin access leaves tomorrow? Is there a documented handover?",
      "Is multi-factor authentication enabled on the email, the bank, the payment processor, and every cloud admin account?",
      "Is there a password manager in use, or are passwords in a shared notebook / spreadsheet / nobody's-sure-where?",
    ],
  },
  {
    number: 7,
    title: "The Security",
    intro:
      "Not theoretical security — real questions about what's protecting the business right now.",
    questions: [
      "Are credit card payments processed? What's the PCI scope, and when was it last reviewed?",
      "Is there health data, financial data, or other regulated information being handled? What compliance obligations apply?",
      "Are operating systems and key software receiving current security patches?",
      "Is endpoint protection (antivirus, MDM, EDR) in place and updated on every device that handles business data?",
      "The camera or surveillance system: is it actually recording? When was the footage last verified? Where do the recordings live?",
      "Has anyone tested what would happen if a device was lost or stolen — can it be locked or wiped remotely?",
    ],
  },
  {
    number: 8,
    title: "The People & Knowledge",
    intro:
      "The system runs on people who know how it works. When they're unavailable, the system stops being a system.",
    questions: [
      "For each critical system, who knows how it works well enough to fix it?",
      "What happens if that person is unavailable for a week?",
      "Is anything documented — passwords stored safely, vendor contacts, recovery procedures, account numbers?",
      "Who is the backup for each critical role?",
      "Are vendor contact details current? When did you last verify the support phone number actually reaches someone?",
      "If you sold the business tomorrow, what would you hand to the new owner?",
    ],
  },
];

export interface PrincipleRow {
  principle: string;
  body: string;
}

export const PRINCIPLES: PrincipleRow[] = [
  {
    principle: "Plan replacements before they're emergencies.",
    body:
      "Replacement was always going to be needed. Planning is the difference between a Tuesday and a five-figure Friday-night phone call.",
  },
  {
    principle: "Audit recurring costs once a year.",
    body:
      "Vendors that made sense five years ago might not now. Rates creep. Subscriptions get forgotten. One pass a year catches both.",
  },
  {
    principle: "Test the backup, not just whether it runs.",
    body:
      "\"Backups are running\" is not the same thing as \"we can recover.\" Test a real restore at least once a year on the data that actually matters.",
  },
  {
    principle: "Own your accounts and identities.",
    body:
      "The domain, the email, the cloud admin — if any of these are tied to a personal account or a former employee, fix it before it's an emergency.",
  },
  {
    principle: "Write it down.",
    body:
      "The system in your head is not the system. If you can't hand a one-page document to a stranger and have them run the place, you don't have a system — you have a habit.",
  },
];

export interface UsageNote {
  title: string;
  body: string;
}

export const HOW_TO_USE: UsageNote[] = [
  {
    title: "Walk through it once",
    body:
      "First pass: don't try to fix anything. Just answer the questions. The gaps will surface on their own.",
  },
  {
    title: "Mark what's at risk",
    body:
      "Anything you couldn't answer, or answered with \"I don't know,\" is at risk. Circle it.",
  },
  {
    title: "Sort by what would hurt most",
    body:
      "Not everything is equally urgent. A POS without a backup plan is higher-priority than a printer at end-of-life. Sort accordingly.",
  },
  {
    title: "Pick three things to fix this quarter",
    body:
      "Don't try to solve everything. Three things, three months, then run the checklist again.",
  },
  {
    title: "Run it once a year",
    body:
      "Tech debt creeps in slowly. An annual pass catches it before it gets expensive.",
  },
];

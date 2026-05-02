// lib/checklist-content.ts
// The actual content of the Vendor Independence Checklist PDF.
// Kept here (not hard-coded in the PDF generator) so we can re-use the same
// data for the web version, the email, and any future formats.

export interface ChecklistQuestion {
  question: string;
  why: string;
}

export interface ChecklistCategory {
  title: string;
  intro: string;
  questions: ChecklistQuestion[];
}

export const CHECKLIST: ChecklistCategory[] = [
  {
    title: "Domain & DNS",
    intro:
      "If your domain or DNS isn't in your name, your business can go dark overnight. This is the most common ownership gap we find — and the easiest to fix.",
    questions: [
      {
        question: "Is your business the registrant on every domain you use?",
        why: "If your IT provider, web designer, or marketing agency registered the domain, they technically own it. Transferring it back can take days or weeks — and sometimes a fight.",
      },
      {
        question: "Can you log in to the domain registrar (GoDaddy, Cloudflare, Namecheap, etc.) right now?",
        why: "Knowing the domain is in your name isn't the same as having access. If you can't log in, you can't transfer, renew, or change DNS.",
      },
      {
        question: "Do you control the DNS records — not just the domain registration?",
        why: "DNS lives in a separate console (often Cloudflare or your registrar). Whoever has DNS controls where your email and website point, regardless of who 'owns' the domain.",
      },
      {
        question: "Are your DNS records documented somewhere YOU control?",
        why: "When you switch DNS providers, you'll need to recreate every record. If only your IT provider has the list, you're stuck with them or you start from scratch.",
      },
      {
        question: "Are SPF, DKIM, and DMARC records in place — and do you understand what they do?",
        why: "These prove your email is legitimate to receiving servers. If they're misconfigured or missing, your email lands in spam. If they're in someone else's name, only that person can change them.",
      },
    ],
  },
  {
    title: "Identity & Workspace",
    intro:
      "The super-admin account on your Google Workspace or Microsoft 365 tenant is the single most powerful credential in your business. Whoever holds it can lock you out of everything.",
    questions: [
      {
        question: "Who is the super-admin on your Google Workspace or Microsoft 365 tenant?",
        why: "The super-admin can reset every user, lock you out, or transfer the entire tenant. If it's your IT provider's account — even with the best intentions — you don't control your own identity layer.",
      },
      {
        question: "Do you have at least one super-admin account that's an internal employee, not a vendor?",
        why: "Best practice is two: an internal owner and a backup. If both are vendor-controlled, you have no recovery path.",
      },
      {
        question: "Is your Apple Business / Apple Business Manager account in your business's name?",
        why: "Like Workspace, the Apple Business primary admin can transfer the entire account. If your IT provider set it up under their account, your devices are tied to them.",
      },
      {
        question: "Are managed Apple IDs provisioned by you, not pre-provisioned by a vendor?",
        why: "Vendor-provisioned Apple IDs can be deleted by that vendor. User data goes with them.",
      },
    ],
  },
  {
    title: "Cloud Accounts",
    intro:
      "AWS, Azure, Google Cloud, and similar accounts have a 'root' or 'owner' credential that supersedes everything else. If you don't hold it, you don't own the account.",
    questions: [
      {
        question: "Who controls the root credentials on your AWS / Azure / GCP account?",
        why: "Root can do anything — including close the account, transfer billing, or delete everything. If your developer or MSP has root and you don't, you're a guest in your own infrastructure.",
      },
      {
        question: "Is the billing payment method on the cloud account in your business's name?",
        why: "If the credit card is your IT provider's, the account is technically theirs — they're just letting you use it. When the relationship ends, the account goes with them.",
      },
      {
        question: "Can you export your cloud data without your current vendor's involvement?",
        why: "Most cloud providers allow data export, but the process is non-trivial. If you've never tested it, you don't actually know if you can.",
      },
    ],
  },
  {
    title: "Backups & Data",
    intro:
      "Backups that live with your IT provider die with your IT provider. The whole point of backups is they're available when something fails — including the failure of the vendor that holds them.",
    questions: [
      {
        question: "Where do your backups physically live?",
        why: "If the answer is 'I think they're at the IT company,' you don't have backups. You have hopes.",
      },
      {
        question: "Can you restore from those backups WITHOUT your current IT provider?",
        why: "A backup you can't restore independently isn't a backup — it's a leverage point for the vendor that holds it.",
      },
      {
        question: "Do you have at least one copy of business-critical data outside any vendor's control (e.g., on a drive in your office or a personal cloud account)?",
        why: "The 3-2-1 backup rule exists because vendors fail. One copy outside every vendor relationship is the floor.",
      },
      {
        question: "Do you know how long it would take to restore your business from a clean backup?",
        why: "If you've never measured this, the answer in a real disaster is 'longer than you can afford.'",
      },
    ],
  },
  {
    title: "Credentials & Secrets",
    intro:
      "Every shared password, every API key, every recovery email is a key to something. You should know where they all live — and have copies.",
    questions: [
      {
        question: "Is there a business password manager (1Password, Bitwarden, etc.) — and are YOU the org owner?",
        why: "If your IT provider set up 1Password under their account, every credential they shared with you can be revoked.",
      },
      {
        question: "Do you have recovery contact information for every critical service set to internal staff, not vendors?",
        why: "When you click 'forgot password,' the recovery email goes somewhere. If it goes to your IT provider, they can reset accounts you depend on.",
      },
      {
        question: "Do you have a written record of every API key, integration token, and webhook secret in use?",
        why: "Integrations break silently when keys rotate or vendors change them. If only the vendor knows what's plugged in where, you find out by what stops working.",
      },
    ],
  },
  {
    title: "Vendor Contracts & Exit",
    intro:
      "The fine print of every vendor contract has an exit clause. Reading them before you need them is much cheaper than reading them after.",
    questions: [
      {
        question: "What's the cancellation window for your IT services contract?",
        why: "Standard MSP contracts are 36 months with a 60-90 day cancellation window. Miss the window, you auto-renew for another 36.",
      },
      {
        question: "What's the data return / handover process if you cancel?",
        why: "Many contracts say 'all data returned' but don't specify the format, timeline, or completeness. A zip file of database exports is technically 'data returned' — and useless.",
      },
      {
        question: "Is your business profile on Apple Maps, Google Business, and Meta in your name with internal owner access?",
        why: "Marketing agencies and SEO firms commonly create these in their own accounts. When you fire them, your map listing goes too.",
      },
      {
        question: "If your IT provider disappeared tomorrow, what's the FIRST thing that would stop working?",
        why: "Most owners haven't thought about this. Walking through it specifically — not abstractly — surfaces the real dependencies.",
      },
    ],
  },
];

export function totalQuestions(): number {
  return CHECKLIST.reduce((sum, c) => sum + c.questions.length, 0);
}

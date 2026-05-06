// prisma/seed-blog-ai-rollout.ts
// One-time script to seed the AI rollout blog post. Run with: npx tsx prisma/seed-blog-ai-rollout.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "There's a version of \"AI rollout\" happening at most small and mid-sized businesses right now that goes like this: leadership signs up for ChatGPT Business, sends out invites, and announces the company is now \"using AI.\" That's not a rollout. That's a software purchase. The rollout — the part that actually determines whether AI helps or hurts the business — hasn't started yet. Most companies never get to it.",
  },
  {
    type: "paragraph",
    content:
      "AI is a tool. Tools require operators who know what they're doing. The companies that get AI right are not the ones with the most AI subscriptions. They're the ones with the right people using those subscriptions, supervised by the right systems, with the right policies on what gets sent where. Everything else is theater that produces polished-looking work that often falls apart on inspection.",
  },
  {
    type: "heading",
    level: 2,
    content: "Rolling out AI is not a software purchase",
  },
  {
    type: "paragraph",
    content:
      "When a leadership team says \"we need to roll out AI,\" they usually mean \"we need to buy ChatGPT licenses.\" That's the easy part. It takes a credit card. The hard part — and the part that determines whether the AI investment pays back — is everything that should happen before, during, and after the licenses get distributed.",
  },
  {
    type: "paragraph",
    content:
      "A real rollout asks: Who uses AI for what? What kinds of work are inside the lane? Outside? What data is acceptable to put into a prompt? What isn't? Who reviews AI-generated work before it becomes a policy, a contract, a customer email, a deployment plan? When the AI gets it wrong — and it will, often — who notices? Who escalates? Who fixes it?",
  },
  {
    type: "paragraph",
    content:
      "These aren't questions the IT team can answer alone. They aren't questions the AI vendor will answer for you. They require leadership to think through how the business actually works and where AI fits inside it — which means thinking about people, processes, and accountability, not just software.",
  },
  {
    type: "heading",
    level: 2,
    content: "AI without your data is just a chat box",
  },
  {
    type: "paragraph",
    content:
      "There's a second gap that hits owners after the licenses are distributed. The AI doesn't know your customers. It doesn't know your calendar. It doesn't have access to your file storage, your CRM, your accounting system, your contracts, or your past customer support tickets. Out of the box, it's a separate browser tab where a powerful model sits ready to help — with no idea what your business actually looks like.",
  },
  {
    type: "paragraph",
    content:
      "Without integrations, AI is a slightly faster Google for the work you can describe in a prompt. The real productivity gains — the ones that justify the subscription cost and the rollout effort — come from connecting AI to the systems where your work actually lives. AI that can see your calendar can schedule meetings. AI connected to your CRM can draft customer-specific responses. AI with access to your project files can summarize them, find missing pieces, and surface what changed week to week.",
  },
  {
    type: "paragraph",
    content:
      "Setting that up is engineering work. It involves API authentication, OAuth flows, scoped permissions, data flow design, and ongoing maintenance when the underlying apps change their interfaces. It also opens new security surfaces — once an AI tool has access to your customer database, you've added a new place where customer data lives, and the same data sovereignty questions apply to that connection. Who's reviewing what data the AI sees? Who's logging the AI's actions on your behalf? What happens if the AI makes a mistake on a connected system?",
  },
  {
    type: "paragraph",
    content:
      "Most owners buying AI subscriptions don't have the technical staff to do this work, and the AI vendors don't make it obvious that the work is needed. The chat-tab experience is usable on day one. The integrations that turn the chat tab into a force multiplier are usually still ahead. Companies that have an internal IT team make this transition; companies without one tend to plateau at the chat-tab level and conclude AI didn't deliver. They were right that what they had didn't deliver. They were wrong about why.",
  },
  {
    type: "paragraph",
    content:
      "If you don't have an internal IT team — and most small businesses don't — this is exactly the kind of work a fractional or external technology partner exists to do. Not to use AI for you, but to set up the connections so your people can use AI well, with the right data flowing through and the right boundaries in place.",
  },
  {
    type: "heading",
    level: 2,
    content: "AI multiplies talent — but only talent",
  },
  {
    type: "paragraph",
    content:
      "The most useful framing we've seen for AI is this: it doesn't replace experience, it enhances it. A subject matter expert with AI is closer to a 10x version of themselves. They know what good output looks like, they know what to ask for, they know what to throw away, and they catch the inevitable confidently-wrong moments before those moments become decisions.",
  },
  {
    type: "paragraph",
    content:
      "The same AI in the hands of someone without that domain expertise produces output that looks the same and isn't. It uses the right vocabulary. It cites the right concepts. It even references how things are done at \"similar businesses.\" None of that means it's right. AI doesn't know what it doesn't know — and someone who doesn't know what the AI doesn't know is in no position to catch it.",
  },
  {
    type: "paragraph",
    content:
      "This isn't gatekeeping. Even people with deep domain experience produce work they're not proud of when they let AI do the thinking and don't review the output carefully. Anyone who's written AppScript for a quick automation has stories about scripts they were proud of in the moment and embarrassed by a year later. That's normal. The point isn't that experts are infallible. It's that experts know when to slow down — and that's the part that's hard to delegate to someone who doesn't have the same instincts.",
  },
  {
    type: "paragraph",
    content:
      "AI is a force multiplier. The thing it multiplies is whatever your people already are. Multiplying expertise produces leverage. Multiplying inexperience produces risk that looks like progress.",
  },
  {
    type: "heading",
    level: 2,
    content: "Shadow IT is becoming shadow everything",
  },
  {
    type: "paragraph",
    content:
      "Shadow IT used to mean an employee installed a tool the IT team hadn't approved. Today, AI has democratized the ability to look like an expert in any field, so the shadow has expanded. Shadow IT is becoming shadow legal, shadow HR, shadow security, shadow marketing, shadow compliance.",
  },
  {
    type: "paragraph",
    content:
      "We've seen the business manager writing legal briefs that an attorney would not put their name on. We've seen marketing teams producing loss prevention documents that would not survive a security audit. We've seen non-technical staff producing internal apps using AI-assisted code, all of them unsupervised, none of them following any standards, all of them quietly running on company data. Each artifact looks professional. Each one solves an immediate problem for the person who made it. None of them got reviewed by anyone qualified to catch what's wrong.",
  },
  {
    type: "paragraph",
    content:
      "The dangerous part isn't the bad output. Bad output that obviously looks bad gets rejected on sight. The dangerous part is good-looking output that's wrong in ways the maker can't see. A polished policy that can't actually be enforced. A compliance plan that contradicts itself. An app that leaks customer data because the AI's first suggestion was a permissive default and nobody knew enough to question it.",
  },
  {
    type: "paragraph",
    content:
      "Companies end up with hundreds of unmanaged internal artifacts — apps, scripts, policies, decks, contracts, emails — each one created with the best of intentions and zero of the standards a domain expert would have applied. The cost shows up later, in the form of compliance findings, security incidents, customer disputes, and quiet inefficiency that nobody can quite point to but everyone feels.",
  },
  {
    type: "heading",
    level: 2,
    content: "Your employees are pasting customer data into AI right now",
  },
  {
    type: "paragraph",
    content:
      "The data sovereignty problem is the part most leadership teams haven't considered. When an employee pastes a customer's information into an AI tool to draft a response, where does that data go? What's the vendor doing with it? Is it training on it? Is it logged? For how long? Who at the vendor has access to it?",
  },
  {
    type: "paragraph",
    content:
      "The honest answer depends entirely on which tier of which tool the employee happens to be using — and most employees are using whatever they signed up for personally, on their own account, with consumer terms. The differences matter. As of May 2026:",
  },
  {
    type: "paragraph",
    content:
      "ChatGPT Free uses your conversations to train its models by default. The opt-out exists but is buried in settings most users never visit. ChatGPT now also personalizes ads based on conversation content for free-tier users, with that toggle on by default.",
  },
  {
    type: "paragraph",
    content:
      "Microsoft 365 Copilot, under the commercial enterprise data protection terms, does not use prompts, responses, or data accessed through Microsoft Graph to train foundation models. Your administrative settings, sensitivity labels, and retention policies carry through. This is the right tier for businesses with regulated data — but it requires a paid Microsoft 365 plan with the Copilot add-on, which most small businesses haven't moved to yet.",
  },
  {
    type: "paragraph",
    content:
      "The Anthropic API does not use commercial inputs or outputs to train models by default, with 7-day log retention. Zero-data-retention agreements are available for enterprise customers. Note that Anthropic's consumer products (Claude Free, Pro, Max) shifted to opt-out training in 2025 — the API and consumer accounts are not the same product from a data perspective.",
  },
  {
    type: "paragraph",
    content:
      "Google Gemini's free tier has a training opt-out that exists but is similarly buried. The defaults favor Google's data interests, not yours. Vendor terms also change frequently — what's true in one quarter may not be true in the next, which means a one-time evaluation isn't enough.",
  },
  {
    type: "paragraph",
    content:
      "Most employees don't read terms of service. Most aren't checking which tier their company has paid for, or whether their personal account is on a plan that uses their inputs to train. They're solving a problem in the moment. They're not thinking about whether the customer record they just pasted into a prompt is now part of a training dataset they have no visibility into. This is happening today, in your business, regardless of whether anyone has set a policy about it.",
  },
  {
    type: "paragraph",
    content:
      "The compliance implications are real. HIPAA-covered data, attorney-client privilege, payment card data, EU resident data under GDPR — all of these have specific rules about where data can flow and who can see it. A consumer AI tool that trains on user inputs is not a compliant destination for any of them. \"My team uses ChatGPT\" can quietly become \"my team has been creating undisclosed data breaches for six months.\"",
  },
  {
    type: "heading",
    level: 2,
    content: "You bought ChatGPT. Now what?",
  },
  {
    type: "paragraph",
    content:
      "If you're already past the licenses-distributed stage, the rollout is still ahead of you. Here's what it actually involves.",
  },
  {
    type: "paragraph",
    content:
      "Write a real AI use policy. Not a 30-page legal document — one page that any employee can read in five minutes and remember. What's allowed (drafting, summarizing, brainstorming, ideation). What requires review by a domain expert before use (anything customer-facing, anything legal or compliance, anything that becomes policy). What's prohibited (regulated data, customer PII, anything covered by NDA or attorney-client privilege). Which AI tools are approved and which aren't. What to do when you're not sure.",
  },
  {
    type: "paragraph",
    content:
      "Identify the subject matter experts in your business and tell them they are the AI quality control for their domain. The compliance officer reviews AI-generated compliance work. The IT team reviews AI-generated technical plans. The legal counsel reviews AI-generated contract language. Make this part of their role explicitly, with the time and authority to actually do it. Don't let polished AI work flow past them and then ask why something broke.",
  },
  {
    type: "paragraph",
    content:
      "Evaluate the vendors you actually use. Read the data terms — current ones, not the ones from when you signed up. Make sure the tier your team is using matches the kind of data they're putting into it. If your finance team uses ChatGPT Free with bank account numbers, that's a problem you're already living with whether you've named it or not.",
  },
  {
    type: "paragraph",
    content:
      "Train the people who weren't hired to be AI evaluators. The expectation that everyone in the building should now know how to use AI safely is unrealistic. The expectation that everyone should know when to stop and ask a human is achievable, but it requires actual training — not a single email saying \"please be thoughtful with AI.\"",
  },
  {
    type: "paragraph",
    content:
      "Schedule a review every six months. Vendor terms shift. Models shift. New tools emerge. Whatever you decide today is likely wrong in some way 12 months from now. The companies that get this right are the ones that revisit it as a discipline, not a one-time project.",
  },
  {
    type: "heading",
    level: 2,
    content: "The principle, not the tools",
  },
  {
    type: "paragraph",
    content:
      "AI is a real tool with real benefits when it's used well. We use it ourselves — every day, including for work that goes to clients. The point of this post isn't to talk anyone out of AI. It's to point out that the tool only multiplies what's already there. Companies with strong domain expertise and clear standards get a force multiplier. Companies without those things get a confidently-wrong document mill that runs in the background until something visible breaks.",
  },
  {
    type: "paragraph",
    content:
      "If your business is in the second category — and most are, today — the way out isn't fewer AI subscriptions. It's the rollout that hasn't happened yet: the policies, the SMEs, the data hygiene, the training, the ongoing review. Boring stuff that sounds like overhead. It's not. It's the difference between AI as a force multiplier and AI as an expensive way to manufacture liability.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "We help leadership teams put guardrails on AI use — policies, workflow review, vendor evaluation, training. The point isn't to be anti-AI. It's to make sure AI works for your business instead of generating polished problems that surface six months later.",
    ctaText: "AI Risk & Guardrails",
    ctaHref: "/ai-risk",
  },
  {
    type: "cta",
    content:
      "For the related piece on what happens when polished AI documents beat expert vetoes in the room — see the Prompt Jockey post.",
    ctaText: "Read: Prompt Jockeys and the PCI Nightmare",
    ctaHref: "/blog/prompt-jockeys-and-the-pci-nightmare",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "ai-multiplies-talent-it-doesnt-replace-it" },
    update: {
      title: "AI Multiplies Talent. It Doesn't Replace It.",
      excerpt:
        "Rolling out AI is not a software purchase. Most companies are at the licenses-distributed stage and haven't started the actual rollout — the policies, SMEs, data hygiene, and training that determine whether AI is a force multiplier or a polished-problem manufacturer.",
      content: content as never,
      status: "PUBLISHED",
      // Canonical publish date — pinned so re-seeding doesn't drift
      publishedAt: new Date("2026-05-06T10:00:00-04:00"),
    },
    create: {
      title: "AI Multiplies Talent. It Doesn't Replace It.",
      slug: "ai-multiplies-talent-it-doesnt-replace-it",
      excerpt:
        "Rolling out AI is not a software purchase. Most companies are at the licenses-distributed stage and haven't started the actual rollout — the policies, SMEs, data hygiene, and training that determine whether AI is a force multiplier or a polished-problem manufacturer.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-06T10:00:00-04:00"),
    },
  });

  console.log(`Blog post created: ${post.title} (${post.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

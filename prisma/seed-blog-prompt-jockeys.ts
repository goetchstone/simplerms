// prisma/seed-blog-prompt-jockeys.ts
// One-time script to seed the Prompt Jockey blog post. Run with: npx tsx prisma/seed-blog-prompt-jockeys.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "AI use in business is accelerating. Used well, it's a real force multiplier. Used badly, it produces confidently wrong output that looks more credible than the subject matter expert trying to correct it. We have a name for that second case: the prompt jockey problem. It's already a factor inside organizations, and it's going to get worse before it gets better.",
  },
  {
    type: "heading",
    level: 2,
    content: "What a prompt jockey is",
  },
  {
    type: "paragraph",
    content:
      "A prompt jockey is someone who learned that AI produces confident-looking output and stopped there. They don't have the domain knowledge to evaluate what the AI produced. They don't know what they don't know. And they treat AI output as equivalent to expert judgment — because on the page, it looks that way.",
  },
  {
    type: "paragraph",
    content:
      "The trap isn't laziness. It's that polished-and-wrong output is the hardest failure mode to spot. A bad answer that sounds stupid gets rejected on sight. A bad answer written in the voice of a senior consultant gets forwarded up the chain and acted on.",
  },
  {
    type: "heading",
    level: 2,
    content: "A compliance example",
  },
  {
    type: "paragraph",
    content:
      "Consider a common scenario. A leadership team wants to change how the business handles customer payment information. They have a goal in mind, they want to move quickly, and they don't pull in the compliance function first. Instead, they open a general-purpose AI tool and write a prompt that reads something like:",
  },
  {
    type: "paragraph",
    content:
      "\"Create a PCI compliant plan for employees to take customer credit card information and store it on the processor's servers. Since the processor will be storing the number we will be PCI compliant and we will need to follow all the basic rules.\"",
  },
  {
    type: "paragraph",
    content:
      "The AI produces a document. It's well-written. It references SAQ categories, tokenization, written authorization, and individual logins. It may even claim the approach is \"widely used\" in similar businesses — based on nothing in particular, but it reads as validation. The document looks like a compliance plan.",
  },
  {
    type: "paragraph",
    content:
      "Leadership forwards it to the compliance officer. The compliance officer reads it and says, \"This is a compliance nightmare.\" Five words. One sentence. Correct.",
  },
  {
    type: "heading",
    level: 2,
    content: "Why those five words don't land",
  },
  {
    type: "paragraph",
    content:
      "The compliance officer is the subject matter expert. She's right. The plan she's objecting to routes cardholder data through general-purpose employee devices on a shared network — which is exactly what PCI DSS exists to prevent. But the AI document is eight pages. Hers is one sentence.",
  },
  {
    type: "paragraph",
    content:
      "In the conference room, the polished document wins. Not because it's correct. Because it looks more like a plan than the veto does. Leadership sends it out in an email. The plan moves forward. The SME is now not just wrong in the eyes of the room — she's the obstacle.",
  },
  {
    type: "paragraph",
    content:
      "That's the real cost of the prompt jockey problem. Domain expertise used to be enough. The words \"this is a compliance nightmare\" used to land. They don't anymore — not against a professional-looking AI document that namedrops the right terminology.",
  },
  {
    type: "heading",
    level: 2,
    content: "What the expert now has to do",
  },
  {
    type: "paragraph",
    content:
      "Being the expert is no longer sufficient. The SME now has to produce a counter-document that matches the AI document in polish and exceeds it in specifics. Their domain knowledge is still the foundation — but they also have to operate at the same surface-level production speed as the prompt jockey, or the truth loses on optics alone.",
  },
  {
    type: "paragraph",
    content:
      "Ironically, the tool for that is the same AI. Used differently — grounded in real regulations, real constraints, real knowledge. Not \"write me a compliant plan.\" Something closer to: \"I am a compliance officer reviewing a proposed workflow that routes cardholder data through employee devices on a shared network. Walk through each SAQ scenario that applies, identify every DSS requirement this workflow violates, and list the compliant alternatives in order from lowest scope to highest.\"",
  },
  {
    type: "paragraph",
    content:
      "That prompt produces a document grounded in the real compliance landscape, not invented from training data. Same AI. Different use. The difference is who's driving.",
  },
  {
    type: "heading",
    level: 2,
    content: "What the compliant version actually looks like",
  },
  {
    type: "paragraph",
    content:
      "Back to the original goal — employees collecting payment information from customers. A real compliance path doesn't require an eight-page document. It fits in a paragraph.",
  },
  {
    type: "paragraph",
    content:
      "If employees are genuinely going to handle cardholder data on company devices, each user needs a unique login, they need a dedicated terminal that does nothing else, and the customer needs to give written authorization. That's the highest SAQ, the highest ongoing compliance burden, and the highest breach liability. It's possible, but it's the most expensive path.",
  },
  {
    type: "paragraph",
    content:
      "A better option: use Stripe or an equivalent processor with payment links. The customer clicks a link sent by text or email, enters their card data on the processor's infrastructure, and no employee ever touches it. That reduces PCI scope to SAQ A — the simplest category — because no cardholder data enters your network. Lower compliance surface, lower audit cost, lower breach liability.",
  },
  {
    type: "paragraph",
    content:
      "If the first option is required for business reasons, limit access to one or two designated people on dedicated hardware. Don't put every employee in scope. Every device and every user added to the cardholder environment multiplies the audit work and the risk.",
  },
  {
    type: "paragraph",
    content:
      "None of that came from asking AI to write a compliance plan. It came from knowing the regulation, knowing the business, and knowing how to reduce scope — then using AI as a drafting tool, not a decision-maker.",
  },
  {
    type: "heading",
    level: 2,
    content: "If you run a business",
  },
  {
    type: "paragraph",
    content:
      "You're going to see AI documents cross your desk. Some will be useful. Some will be disasters dressed in the voice of a Big Four consultant. The job isn't to ban AI — that doesn't scale. It's to know which documents need a real subject matter expert to sign off before they become policy.",
  },
  {
    type: "paragraph",
    content:
      "Compliance documents. Security plans. Deployment strategies. Contract language. Technical architectures. These are the ones that require domain review no matter how polished the AI draft looks. If the worst case is \"we get fined, breached, or sued,\" the document needs a human expert's name on it — not just confidence that the AI sounded sure of itself.",
  },
  {
    type: "heading",
    level: 2,
    content: "If you are the subject matter expert",
  },
  {
    type: "paragraph",
    content:
      "The job has changed. \"This is wrong\" is no longer a sufficient veto when the thing being vetoed looks like a finished document. The expert has to match the format and exceed the substance. That's more work. It's also the only way the right answer wins in an environment where the loudest, most polished answer now comes free from a chat window.",
  },
  {
    type: "paragraph",
    content:
      "Learn the tool. Ground it in constraints. Make it produce documents that are right — not just documents that sound right. That's the defensible position against prompt jockey output: use the same tool, better.",
  },
  {
    type: "heading",
    level: 2,
    content: "The quiet part, out loud",
  },
  {
    type: "paragraph",
    content:
      "The people who are going to get hurt by AI aren't the ones who never use it. They're the ones who use it without understanding what it is. An AI that predicts the next likely token has no mechanism to know when it's wrong. It's going to sound confident either way. The only guardrail is someone with domain knowledge reading the output and either correcting it or throwing it away.",
  },
  {
    type: "paragraph",
    content:
      "Without that person in the loop, AI isn't saving time. It's manufacturing liabilities at scale and making them look professional on the way out.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Want an honest read on your current tech stack — including whether the AI-generated documents on your desk are pointing you somewhere you don't want to go?",
    ctaText: "Book a free consultation",
    ctaHref: "/book",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "prompt-jockeys-and-the-pci-nightmare" },
    update: {
      title: "Prompt Jockeys and the PCI Nightmare: When AI Output Beats Expert Judgment",
      excerpt:
        "AI produces confidently wrong documents that can look more credible than the SME correcting them. A scenario every business will face — and what subject matter experts have to do differently now.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-04-23T09:30:00-04:00"),
    },
    create: {
      title: "Prompt Jockeys and the PCI Nightmare: When AI Output Beats Expert Judgment",
      slug: "prompt-jockeys-and-the-pci-nightmare",
      excerpt:
        "AI produces confidently wrong documents that can look more credible than the SME correcting them. A scenario every business will face — and what subject matter experts have to do differently now.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-04-23T09:30:00-04:00"),
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

// prisma/seed-blog-bar-of-soap.ts
// One-time script to seed the $600 bar of soap blog post.
// Run with: npx tsx prisma/seed-blog-bar-of-soap.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "A plumber came to my house. He was fast. Professional. Carried the right tools. Fixed the problem in ten minutes. I handed him my credit card feeling like I'd been raked over the coals.",
  },
  {
    type: "paragraph",
    content:
      "He did nothing wrong. The business model did.",
  },
  {
    type: "heading",
    level: 2,
    content: "The morning",
  },
  {
    type: "paragraph",
    content:
      "I get up at 4 AM. The day started with a slow toilet. The plunger was broken — rubber separated from the handle, useless. The toilet was slow enough that I managed to clear it without one, finished my morning routine, woke up my wife with the great news, and went to work.",
  },
  {
    type: "paragraph",
    content:
      "One toilet in the house. Four people. Wife working from home. Kids needing to get to school.",
  },
  {
    type: "paragraph",
    content:
      "She battled it through the morning. Bought a new plunger. Battled it more. Nothing. I got home that evening, grabbed my skinny auger, got intimate with the porcelain, scratched the hell out of it in the process. Still nothing.",
  },
  {
    type: "paragraph",
    content:
      "At a loss and really needing a working toilet, I googled local plumbers.",
  },
  {
    type: "heading",
    level: 2,
    content: "The offer",
  },
  {
    type: "paragraph",
    content:
      "The first company I called had a deal. $100 to come out and quote me the fix.",
  },
  {
    type: "paragraph",
    content:
      "Desperate, I agreed.",
  },
  {
    type: "paragraph",
    content:
      "The guy was at my door inside 30 minutes. Polite. Professional. Carried his tools in, looked at the toilet, asked me a few questions about what I'd already tried. Two minutes later he had a diagnosis: clogged toilet.",
  },
  {
    type: "paragraph",
    content:
      "I had been trying for a day. I knew it was clogged. I'd assumed it was further down the line, past where my consumer-grade auger could reach.",
  },
  {
    type: "paragraph",
    content:
      "For the low, low price of $600, he could fix it.",
  },
  {
    type: "paragraph",
    content:
      "I was four people deep in one bathroom. I agreed.",
  },
  {
    type: "paragraph",
    content:
      "Ten minutes later he was gone. Problem fixed. It was a bar of soap. My son, for reasons known only to him, had thrown a bar of soap into the toilet. A $1 bar of soap had cost me $600.",
  },
  {
    type: "heading",
    level: 2,
    content: "He did everything right",
  },
  {
    type: "paragraph",
    content:
      "I want to be clear: the plumber was good at his job. He arrived on time. He was respectful in my home. He carried the right auger — the one I should have owned. He fixed the actual problem in ten minutes. He didn't pad the time. He didn't invent extra work. He didn't damage anything. The scratches on the bowl were mine, courtesy of my wrong-sized tool from earlier.",
  },
  {
    type: "paragraph",
    content:
      "By every reasonable measure of \"did the professional do the work?\" — yes, he did.",
  },
  {
    type: "paragraph",
    content:
      "And I felt awful handing him my credit card.",
  },
  {
    type: "heading",
    level: 2,
    content: "The business model is what stung",
  },
  {
    type: "paragraph",
    content:
      "Three things made it bad, in order of how much they hurt.",
  },
  {
    type: "paragraph",
    content:
      "First, the diagnosis was bundled with the commitment. The $100 to come out wasn't really a diagnostic fee. It was a sunk cost designed to make walking away harder once he was there. Once he'd driven over, once I'd paid the $100, the options were \"agree to whatever he quotes, or stay clogged AND lose the $100.\" That's not a real choice. That's a corner.",
  },
  {
    type: "paragraph",
    content:
      "Second, the knowledge gap was the product. The plumber knew immediately that the fix was a bigger auger and ten minutes of work. I didn't know. He sold me my ignorance at a 1,400 percent markup over the actual fix. He carried that information for free; I bought it for $560 above what the tool would have cost me at the hardware store.",
  },
  {
    type: "paragraph",
    content:
      "Third, there was no \"you don't need me for this\" path. A plumber with integrity, knowing what he knew when he walked into my bathroom, could have said: \"Look, this is a clog. You need a bigger auger than what you've got — forty dollars at the hardware store. I can show you how to use it. Or I can do it now for $600. Your call.\"",
  },
  {
    type: "paragraph",
    content:
      "If he'd done that, I might have still hired him. I was tired. Wife was tired. Kids needed the bathroom. The $600 was the price of being done with the problem. But I would have walked away feeling like the choice was genuinely mine — like I'd been treated with respect — and I'd have called him every time something broke for the next twenty years.",
  },
  {
    type: "paragraph",
    content:
      "He chose the model that maximizes one transaction. The honest version maximizes a relationship.",
  },
  {
    type: "heading",
    level: 2,
    content: "What this has to do with IT consulting",
  },
  {
    type: "paragraph",
    content:
      "Everything.",
  },
  {
    type: "paragraph",
    content:
      "Most IT consulting works the way that plumbing company worked.",
  },
  {
    type: "paragraph",
    content:
      "You don't know what's wrong with your systems. You can't diagnose it yourself. The professional gets to charge you for the diagnosis — and once they're on-site, the options collapse to \"agree or stay broken.\" Vendor lock-in works this way. Per-user MSP pricing works this way. Long contracts work this way. Discovery fees, assessment fees, kickoff fees, \"audit packages\" — they all do the same job. The whole industry is built around making sure the customer never has the information that would let them say \"I don't actually need you for this.\"",
  },
  {
    type: "paragraph",
    content:
      "We don't work this way. The reason isn't strategy. It's the toilet.",
  },
  {
    type: "heading",
    level: 2,
    content: "Why we do the Free Hour",
  },
  {
    type: "paragraph",
    content:
      "The Free Hour exists for exactly the reason the plumber's \"$100 to come out\" should have. We diagnose for free. We tell you exactly what's wrong. We tell you what it would cost to fix. We tell you whether you actually need us at all.",
  },
  {
    type: "paragraph",
    content:
      "If a $40 tool and an afternoon would solve your problem, we say so. If you'd be better off hiring someone else, we say that too. If your existing vendor is the right fit and we couldn't do better, we'll tell you to stay where you are.",
  },
  {
    type: "paragraph",
    content:
      "You walk away with a written summary either way. Yours to keep. Yours to act on. You don't owe us anything for the hour. No $100 to come out. No obligation to use us if we showed up. No follow-up sales sequence dripping into your inbox.",
  },
  {
    type: "paragraph",
    content:
      "If you want our help after that, the prices are published. Project work is flat-fee. Retainers are scoped by what your business actually needs, not by user count. Vendor costs pass through at cost. Everything that ends up on your invoice is on your invoice — line by line, every charge visible. You can walk away anytime. We don't write long contracts. We don't charge exit fees. The whole engagement is designed to make leaving easy, because we'd rather earn the relationship monthly than trap you into one.",
  },
  {
    type: "heading",
    level: 2,
    content: "The vow",
  },
  {
    type: "paragraph",
    content:
      "I never want any of my customers to have that feeling.",
  },
  {
    type: "paragraph",
    content:
      "I don't want anyone handing over their credit card thinking they could have done it themselves for forty dollars. I don't want anyone feeling cornered into an invoice because there was no good path between \"stay broken\" and \"agree to whatever they quote.\" I don't want anyone looking at the receipt the next day wondering if they got the truth, the whole truth, or just the truth that was convenient for the firm.",
  },
  {
    type: "paragraph",
    content:
      "We will always do our best to make sure you feel like you got value, and not raked over the coals.",
  },
  {
    type: "paragraph",
    content:
      "That doesn't mean we're the cheapest. Sometimes the right answer is expensive. Migrations are expensive. Custom software is expensive. A full year of retained partnership is expensive. We're not a discount IT firm and we won't pretend to be.",
  },
  {
    type: "paragraph",
    content:
      "But when an answer is cheap — when the answer is \"buy this $40 tool and use it like this\" — we'll tell you. Every time. Even when telling you costs us the engagement.",
  },
  {
    type: "paragraph",
    content:
      "The plumber would have made $600 either way. So would we. The difference is which credit card swipe leaves you feeling good about it.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Free 1-hour consultation. We walk your environment with you, tell you what we see, what it would cost to fix, and whether you actually need us. You leave with a written summary. No $100 to come out. No obligation. No sales sequence.",
    ctaText: "Book your free hour",
    ctaHref: "/book",
  },
  {
    type: "cta",
    content:
      "More on why our pricing is structured the way it is — flat-fee projects, scoped retainers, vendor costs pass through at cost, no per-user games.",
    ctaText: "How we price",
    ctaHref: "/pricing",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "the-600-bar-of-soap" },
    update: {
      title: "The $600 Bar of Soap",
      excerpt:
        "A plumber came to my house. He was fast, professional, fixed the toilet in ten minutes. I handed him my credit card feeling like I'd been raked over the coals. He did nothing wrong — the business model did. Here's what I learned, and why Akritos is built the way it is.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-22T09:00:00-04:00"),
    },
    create: {
      title: "The $600 Bar of Soap",
      slug: "the-600-bar-of-soap",
      excerpt:
        "A plumber came to my house. He was fast, professional, fixed the toilet in ten minutes. I handed him my credit card feeling like I'd been raked over the coals. He did nothing wrong — the business model did. Here's what I learned, and why Akritos is built the way it is.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-22T09:00:00-04:00"),
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

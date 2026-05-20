// prisma/seed-blog-tech-debt.ts
// One-time script to seed the tech debt / 5-year vision blog post.
// Run with: npx tsx prisma/seed-blog-tech-debt.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "How old is the iPad running your point of sale? Honest answer. When was the last time anyone in your business asked the question?",
  },
  {
    type: "paragraph",
    content:
      "It's the kind of question that's easy to skip until the day it isn't. The tablet on the counter, the laptop in the back office, the desktop in the kitchen — they work, so nobody touches them. Until one day they don't. That's when the call comes in, and it's almost always the worst possible time.",
  },
  {
    type: "heading",
    level: 2,
    content: "Free pizza until they retired",
  },
  {
    type: "paragraph",
    content:
      "Roughly eighteen years ago, a local pizza joint called me. They had a two-station point-of-sale system. One station had gone down — the kind of hardware failure that doesn't announce itself. The other station was holding the entire business together, which it wasn't designed to do, and everyone knew it was a matter of time before it followed.",
  },
  {
    type: "paragraph",
    content:
      "They didn't know who to call. Their original installer was long gone. The software vendor had either folded or moved on to selling something newer that wouldn't run on their hardware. Replacing the whole system — new software, new hardware, new staff training — was thousands of dollars they didn't have, and a week of operating in panic mode they couldn't afford.",
  },
  {
    type: "paragraph",
    content:
      "The POS used a hardware-based license key — a dongle — plus a registry entry that tied the software to that exact drive. To bring the station back, we had to recover the drive data first, then rebuild on top of it. I spent over a week letting the recovery run, one block at a time. When it finished, we had the drive image we needed. The registry came back with it. The hardware key still worked. We rebuilt the station on top of the recovered drive and brought it back online.",
  },
  {
    type: "paragraph",
    content:
      "The two-station POS was back to two stations, on hardware that should have been replaced years before, running software nobody supported anymore.",
  },
  {
    type: "paragraph",
    content:
      "They couldn't afford what I should have charged. We worked out a different arrangement. Free pizza until they retired.",
  },
  {
    type: "paragraph",
    content:
      "That was eighteen years ago. They retired not too long ago. The POS ran the whole time.",
  },
  {
    type: "heading",
    level: 2,
    content: "Every small business has one",
  },
  {
    type: "paragraph",
    content:
      "The story's funny in the telling. It is not funny in the living. And every small business we walk into has a version of it sitting in the corner right now — the system the business is depending on without realizing how dependent on it the business actually is.",
  },
  {
    type: "paragraph",
    content:
      "It might be the iPad running the register. The laptop the bookkeeper has been using since 2018. The desktop in the back office that handles payroll. The router that's been blinking in a closet for as long as anyone remembers. The security cameras that may or may not actually be recording — nobody's checked the footage in years and nobody's sure the backups still run. The payment processor charging rates that were competitive eight years ago and aren't anymore. The cloud account the previous owner set up with a personal Gmail address that nobody has the password to. The equipment lease that's been auto-renewing on hardware the business stopped using two locations ago.",
  },
  {
    type: "paragraph",
    content:
      "None of these things announce themselves. None of them ask for attention. None of them get budgeted for. They run. Until the day they don't.",
  },
  {
    type: "heading",
    level: 2,
    content: "Why it gets to this point",
  },
  {
    type: "paragraph",
    content:
      "Three reasons, in roughly this order.",
  },
  {
    type: "paragraph",
    content:
      "One: most small businesses don't have anyone whose job is to think about this. The owner is running the business. The staff is doing the work. The tech is the tech — it works, so it isn't a problem. Until it's the only problem.",
  },
  {
    type: "paragraph",
    content:
      "Two: there's no budget line for it. Real budgets have categories for payroll, inventory, marketing, rent. Very few have a line for \"replace the thing the business runs on before it breaks.\" If it isn't budgeted, it doesn't get planned. If it doesn't get planned, it doesn't get replaced. If it doesn't get replaced, it eventually fails.",
  },
  {
    type: "paragraph",
    content:
      "Three: if it ain't broke, don't touch it. The instinct is right for most things. It's wrong for hardware and software lifecycles. The hardware doesn't care that you don't want to touch it. The vendor doesn't care that your version still works on the day they stop supporting it. Wear and obsolescence happen on a schedule that has nothing to do with whether anyone is paying attention.",
  },
  {
    type: "heading",
    level: 2,
    content: "What it costs to let it ride",
  },
  {
    type: "paragraph",
    content:
      "The cost isn't the eventual replacement. Replacement was always going to be needed. The cost is everything that happens because the replacement wasn't planned.",
  },
  {
    type: "paragraph",
    content:
      "Downtime, when the failure lands at the worst possible moment — which is usually a Friday afternoon, or the day before a holiday, or right at the start of your busiest week. Emergency premium pricing on hardware, software, and labor, because everyone competent enough to help is busy with their planned work and you need them now. Lost customers during the outage, because a restaurant with a broken POS can't take cards and a service business with no scheduling system can't book appointments. Lost data, when the recovery isn't possible. Staff overtime as people work around the broken thing. The owner's weekend, every weekend, until it's resolved.",
  },
  {
    type: "paragraph",
    content:
      "None of that shows up in the original \"we don't have budget to replace it\" calculation. All of it shows up the day the calculation comes due.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Recognize any of this in your own business? Free one-hour consultation, using a checklist we've built from eighteen-plus years of walking small businesses through exactly this conversation. You leave the call with the checklist filled in — whether you hire us or not.",
    ctaText: "Book the hour",
    ctaHref: "/book",
  },
  {
    type: "heading",
    level: 2,
    content: "What planning actually looks like",
  },
  {
    type: "paragraph",
    content:
      "This isn't complicated. It isn't jargon. A five-year tech vision for a small business is a short list of plain-English answers to plain-English questions.",
  },
  {
    type: "paragraph",
    content:
      "What hardware does the business actually depend on right now? List it. The tablets, the laptops, the desktops, the routers, the printers, the back-office machine, the credit card terminal, the receipt printer, the cash drawer, the camera system. Every piece of equipment whose failure stops the business or slows it down.",
  },
  {
    type: "paragraph",
    content:
      "How old is each piece? When does the vendor stop supporting it? When does it stop being repairable? When does the warranty run out? When does the operating system stop receiving security updates?",
  },
  {
    type: "paragraph",
    content:
      "Where's the data? If the device dies tonight, what's lost? Is there a backup? Has anyone tested restoring from the backup recently? Who has the credentials to the cloud accounts where the data lives, and what happens if that person leaves?",
  },
  {
    type: "paragraph",
    content:
      "What's the replacement plan? Not in detail — just: when does each thing get replaced, who handles it, and how is it budgeted? A small business that knows it's replacing the front-of-house tablets in two years and has the money set aside for it is not in crisis when that day comes. A small business that hasn't asked the question is.",
  },
  {
    type: "paragraph",
    content:
      "Are you still paying for what you signed up for? Vendors that made sense five years ago might not now. Payment processors that quoted competitive rates back then may have crept upward without anyone noticing. Equipment leases auto-renewing on things nobody uses anymore. Camera systems that might not actually be recording. Software subscriptions paid out of habit. Every recurring line item on your bank statement deserves the same question as your hardware: do we still need this, at this price, from this vendor?",
  },
  {
    type: "paragraph",
    content:
      "That's the tech vision. Once it's written down, it doesn't take a specialist to maintain. It takes one to write it the first time — because most owners don't know what to put on the list, don't know what timelines to plan against, and don't know which recurring charges have quietly become bad deals.",
  },
  {
    type: "heading",
    level: 2,
    content: "How we work this",
  },
  {
    type: "paragraph",
    content:
      "We offer the first conversation as a free one-hour consultation. We come with a tech debt checklist we've built and refined over eighteen-plus years of walking small businesses through exactly this exercise. On the call, we go through your environment together — every piece of hardware the business depends on, every recurring vendor charge, where your data actually lives, what's at end-of-life and what's quietly creeping up on it.",
  },
  {
    type: "paragraph",
    content:
      "You leave the call with the checklist filled in, a clear list of what needs attention now versus what can wait, and a rough sense of what a full written roadmap would cost if you want one. The checklist is yours either way. You can hand it to whoever runs your IT — internal staff, your existing provider, the family member who's good with computers, whoever. Or you can come back to us to build the roadmap, handle the replacements, or just be your call-when-something-breaks backup. No retainer. No lock-in. No follow-up sales push.",
  },
  {
    type: "paragraph",
    content:
      "If we end the hour and you decide you don't need us, that's a successful call. You walked in with a vague worry. You walk out with a list, a timeline, and a plan you can act on. We trade an hour to be useful. Sometimes that hour turns into work for us. Sometimes it doesn't. Either way the math works.",
  },
  {
    type: "paragraph",
    content:
      "The discipline of looking at your own equipment and saying \"this dies in eighteen months and here's the plan\" is the difference between running a business and the business running you.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Let us help find your tech debt before it's too late. Free one-hour consultation with our tech debt checklist. We walk your environment together, fill in the checklist as we go, and tell you what a written plan would actually cost. You leave with the checklist filled in either way.",
    ctaText: "Book your free hour",
    ctaHref: "/book",
  },
  {
    type: "cta",
    content:
      "More on how we approach vendor independence and tech roadmapping — including the principle that you own everything we build, and nothing locks you in.",
    ctaText: "Ownership and vendor independence",
    ctaHref: "/ownership",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "how-old-is-the-ipad-running-your-pos" },
    update: {
      title: "How Old Is the iPad Running Your POS?",
      excerpt:
        "A pizza joint called me eighteen years ago when their two-station POS lost one station. They didn't know who to call, couldn't afford a new system, didn't know how close they were to losing the whole business. Free pizza until they retired. Every small business has one of these stories waiting to happen — and a five-year tech vision is what stops it.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-15T09:30:00-04:00"),
    },
    create: {
      title: "How Old Is the iPad Running Your POS?",
      slug: "how-old-is-the-ipad-running-your-pos",
      excerpt:
        "A pizza joint called me eighteen years ago when their two-station POS lost one station. They didn't know who to call, couldn't afford a new system, didn't know how close they were to losing the whole business. Free pizza until they retired. Every small business has one of these stories waiting to happen — and a five-year tech vision is what stops it.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-15T09:30:00-04:00"),
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

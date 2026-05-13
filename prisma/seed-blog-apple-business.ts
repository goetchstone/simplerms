// prisma/seed-blog-apple-business.ts
// One-time script to seed the Apple Business consolidation blog post.
// Run with: npx tsx prisma/seed-blog-apple-business.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "If your business runs Apple devices — five of them or five hundred — Apple just changed how you manage them, and the rollout was quiet enough that most teams missed it. In April 2026, three separate Apple products became one platform called Apple Business. Same login. One place. Still free.",
  },
  {
    type: "paragraph",
    content:
      "Doesn't matter how big you are. If you're managing iPhones, iPads, or Macs for work, the ground under that work just shifted. For smaller businesses, it's the first time Apple has shipped a stack that can stand on its own. For larger ones, there's real value sitting in an account you already have — value that wasn't there a couple of months ago.",
  },
  {
    type: "heading",
    level: 2,
    content: "What got consolidated",
  },
  {
    type: "paragraph",
    content:
      "Three Apple products merged into one. They used to each do their own job — one handled device deployment, one was small-business management with storage and support, one was your business's brand presence across Apple's surfaces. Now they live behind one console. The login you used yesterday for the old product still works. The difference is what's on the other side of it.",
  },
  {
    type: "heading",
    level: 2,
    content: "What's actually different",
  },
  {
    type: "paragraph",
    content:
      "It's not just three logins becoming one. The capability inside each piece got stronger in the consolidation. We're not going to walk through feature names — Apple renames things, and what they call something today may not be what they call it next year. What matters is the shape:",
  },
  {
    type: "paragraph",
    content:
      "The device management side got more automated. Setting up the first device and setting up the hundredth take the same effort. Configurations apply by role, not by hand.",
  },
  {
    type: "paragraph",
    content:
      "Real Apple-backed support is bundled in. Not a separate purchase, not a per-device add-on. There's now an escalation path that doesn't run through a reseller.",
  },
  {
    type: "paragraph",
    content:
      "Storage for your team scaled up to something you can actually run a business on — not just sync a few documents to.",
  },
  {
    type: "paragraph",
    content:
      "Identity works with whatever you already use. If you've got Google Workspace or Microsoft's identity layer, Apple Business plugs into it. If you don't, the platform gives you one.",
  },
  {
    type: "paragraph",
    content:
      "How your business shows up across Apple — on Maps, in Mail, in Wallet — became one configuration instead of three. Payment acceptance happens on the device you already carry.",
  },
  {
    type: "paragraph",
    content:
      "And there's now a real way for other software to work with it. That matters less for smaller businesses, more for organizations with systems that need to talk to each other.",
  },
  {
    type: "heading",
    level: 2,
    content: "The macOS Server comparison nobody is making",
  },
  {
    type: "paragraph",
    content:
      "If you've been in Apple administration long enough, this should feel familiar. macOS Server — the product Apple wound down over several years — used to do most of this. Email on your domain. Calendars. Shared contacts. A directory. File sharing. Device management profiles. You ran it yourself on a Mac mini in a closet, kept it patched, and prayed the hardware didn't die.",
  },
  {
    type: "paragraph",
    content:
      "What Apple Business now does is the same kind of stack, except Apple hosts it. You don't run the server. You don't manage the mail engine. You don't patch your own directory. Apple does that, and the platform is free.",
  },
  {
    type: "paragraph",
    content:
      "We'd been waiting on Apple to do something like this for years. Now they did.",
  },
  {
    type: "heading",
    level: 2,
    content: "Where Apple Business stands on its own",
  },
  {
    type: "paragraph",
    content:
      "Size isn't the right question. Fit is.",
  },
  {
    type: "paragraph",
    content:
      "Apple Business is enough on its own when your tech footprint is mostly Apple, you're not already living in Google Workspace or Microsoft 365, you don't have regulatory constraints that demand advanced policy controls, and you've got at least one person who can run the day-to-day. That can describe a five-person studio. It can also describe a fifty-person practice. It rarely describes an enterprise with mixed-device fleets, deep compliance, and existing identity infrastructure — for them, Apple Business is part of the stack, not the whole stack.",
  },
  {
    type: "paragraph",
    content:
      "For the businesses where it does fit standalone, it replaces things you might be paying for separately: a third-party device management platform, a cloud document service, a payment terminal, sometimes your email and calendar host. That's a real category change.",
  },
  {
    type: "heading",
    level: 2,
    content: "Where it isn't enough on its own",
  },
  {
    type: "paragraph",
    content:
      "Honest about the limits — because if we don't say them, nobody will:",
  },
  {
    type: "paragraph",
    content:
      "Email hosted by Apple is the piece we're cautious about. It's there, it works, it's on your domain. But how it stacks up against a mature provider — for deliverability, for the way email actually integrates with the tools your team already uses, for the track record on downtime — needs real-world miles before we'd move a business that depends on email reliability. We're running it ourselves first. If your email is mission-critical today, keep it where it lives and connect Apple Business to your existing identity instead.",
  },
  {
    type: "paragraph",
    content:
      "If you're already on Workspace or Microsoft 365, don't migrate to Apple email just because you can. Connect the two, keep email and documents where they are, and use Apple Business for what it's actually best at.",
  },
  {
    type: "paragraph",
    content:
      "If you're in a regulated industry — payment processing at scale, healthcare data, finance — you'll still want a dedicated enterprise management layer on top of Apple Business. The built-in management is good for most cases, not all cases.",
  },
  {
    type: "paragraph",
    content:
      "If your fleet is mixed Apple and Windows or Android, Apple Business doesn't manage the non-Apple side. You still need a Windows or Android management plane alongside it.",
  },
  {
    type: "heading",
    level: 2,
    content: "What's hard about setting it up",
  },
  {
    type: "paragraph",
    content:
      "Day-to-day Apple Business is genuinely usable by an internal team, including one that's never run Apple at scale before. Enrolling devices, pushing apps, running support tickets — none of that requires a specialist once the foundation is in place.",
  },
  {
    type: "paragraph",
    content:
      "The foundation is where the work lives. Identity decisions. Automation, so the hundredth device is no harder than the first. Roles, so the right configurations and apps reach the right people. The choice between Apple's built-in management and a dedicated third-party tool. Migration from whatever you have now. Compliance scope where payment or regulated data is in play.",
  },
  {
    type: "paragraph",
    content:
      "None of it is insurmountable. All of it is easy to do half-right. Half-right setup means redoing the foundation in a year — which is the most expensive way to use Apple Business.",
  },
  {
    type: "heading",
    level: 2,
    content: "How we work with you",
  },
  {
    type: "paragraph",
    content:
      "Three ways. Pick the one that fits where you are.",
  },
  {
    type: "paragraph",
    content:
      "1) We set it up. You run it. We do the initial configuration correctly, document every decision, train your team for 30 days, and hand it off. You own the platform. You own the documentation. We're done. Typical engagement is around 8 hours for a clean setup, more for migrations, all quoted as a flat number after a free consultation. After handoff, we're not on your invoice anymore.",
  },
  {
    type: "paragraph",
    content:
      "2) We set it up. We manage it. Same setup, but we stay on as your Apple Business operator. Device enrollment, app deployment, policy updates, quarterly reviews, escalation backup for your team. Your team handles day-to-day; we own the platform. $35 per user per month, no contract beyond the onboarding period. Most useful for smaller businesses without dedicated internal Apple expertise — but the offer's open at any size.",
  },
  {
    type: "paragraph",
    content:
      "3) You set it up yourselves. We're here if you want. If your team wants to run point on the build, we can be a paid advisor when you hit a hard question. No retainer, no minimum, no contract. $225 per hour when you call. Most teams who go this route call us two or three times during setup, then never again, and that's exactly how it should work.",
  },
  {
    type: "paragraph",
    content:
      "None of these lock you in. You can change paths anytime. If you start managed and decide you want to run it yourself, we hand it off and walk away. If you start on your own and want help later, you call us. Same rates, same approach, same no-contract terms.",
  },
  {
    type: "heading",
    level: 2,
    content: "Why no lock-in",
  },
  {
    type: "paragraph",
    content:
      "Long contracts exist to protect the firm, not the client. We don't write them. The onboarding minimum on managed plans isn't a lock — it's the time it takes to learn your environment well enough to do the work right. After that, you stay because it's working, not because you're trapped.",
  },
  {
    type: "paragraph",
    content:
      "You own everything we build. The documentation, the configuration, the policies — all yours. If you leave, we hand it over and help with the transition to whoever comes next. We don't hold your environment hostage and we don't charge exit fees. It's your business.",
  },
  {
    type: "heading",
    level: 2,
    content: "If you're already on the old platform",
  },
  {
    type: "paragraph",
    content:
      "You don't have to do anything dramatic. The old logins should still work. Existing devices and configurations carry through. What changed is what's now available to you that wasn't before — and that's where most of the value is sitting.",
  },
  {
    type: "paragraph",
    content:
      "Most accounts we'll look at are using a fraction of what's now in there. The rest is configuration work, not migration work. If it's been a while since you sat with your account, it's worth a sit-down — not because anything is broken, but because there's real value waiting in a platform you already have.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Want help thinking through whether Apple Business fits your team, which of the three paths makes sense for your situation, or what's hiding in an account you already have? Free 30-minute consultation, no obligation, real numbers walked through with you on the call.",
    ctaText: "Book a free consultation",
    ctaHref: "/book",
  },
  {
    type: "cta",
    content:
      "More on how we approach Apple Business setup, migration, and ongoing management.",
    ctaText: "Apple Business services",
    ctaHref: "/apple-business",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "apple-business-one-platform-replaces-three" },
    update: {
      title: "Apple Business: One Platform Replaces Three",
      excerpt:
        "Apple just consolidated three products into one platform. If you manage Apple devices for a business — any size — this changed the ground under your feet. Here's what's actually different, where it stands on its own, where it doesn't, and the three ways we can help: set it up, manage it, or back you up while your team runs it.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-13T09:30:00-04:00"),
    },
    create: {
      title: "Apple Business: One Platform Replaces Three",
      slug: "apple-business-one-platform-replaces-three",
      excerpt:
        "Apple just consolidated three products into one platform. If you manage Apple devices for a business — any size — this changed the ground under your feet. Here's what's actually different, where it stands on its own, where it doesn't, and the three ways we can help: set it up, manage it, or back you up while your team runs it.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-13T09:30:00-04:00"),
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

// prisma/seed-blog-security.ts
// One-time script to seed the "security is inconvenient" blog post.
// Run with: npx tsx prisma/seed-blog-security.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "Think about your house. The front door is locked. Maybe there's a deadbolt above the regular lock. Maybe an alarm system that beeps when you walk in and that you have to disarm with a code while juggling grocery bags. Maybe a Ring doorbell. None of it is convenient. All of it is a hassle. You do it anyway.",
  },
  {
    type: "paragraph",
    content:
      "And the joke version of this we tell each other is that the locks only keep honest people out. Anyone who really wants to get in is going to get in. Which is technically true. And we lock the door anyway, because deterring the casual problem is most of the job.",
  },
  {
    type: "paragraph",
    content:
      "Now look at your business.",
  },
  {
    type: "heading",
    level: 2,
    content: "The IT version of an unlocked door",
  },
  {
    type: "paragraph",
    content:
      "Cameras on every wall. Probably a different brand in three of the four corners because each system was added in a different year by a different person. All four of them on the same shared login that gets handed to anyone who needs to check the footage. The password on the camera DVR is still the one it came with from the manufacturer — \"admin\" or \"12345\" or \"password\" — because nobody ever changed it and nobody is sure how.",
  },
  {
    type: "paragraph",
    content:
      "The point-of-sale terminal. Same login for everyone on shift. The cleaning crew at night. The teenager you hired last month who lasted three weeks. Whoever was here when the receipt printer got plugged into the wrong outlet.",
  },
  {
    type: "paragraph",
    content:
      "The Wi-Fi the guests use is the same Wi-Fi the cash register runs on. The router admin page is still on the default credentials printed on a sticker on the bottom of the router, which sits visible on a shelf in the back office.",
  },
  {
    type: "paragraph",
    content:
      "The locks on your house are doing more security work than your business is.",
  },
  {
    type: "heading",
    level: 2,
    content: "Who deleted Wednesday's footage?",
  },
  {
    type: "paragraph",
    content:
      "The night deposit on Wednesday was short. Not by much, but enough to notice. The manager goes to the camera system the next morning to pull the footage from the back office between ten and midnight.",
  },
  {
    type: "paragraph",
    content:
      "The footage from Wednesday isn't there.",
  },
  {
    type: "paragraph",
    content:
      "Nobody knows when it disappeared. The system doesn't tell you. Nobody knows who deleted it because everyone uses the same login. The system doesn't record that either. The cleaning crew, the closing shift, the opening shift, the owner, the night auditor — any of them could have. Or it could have been a glitch. Or the drive could have filled up. Or the camera in that corner was pointed wrong. Or, or, or.",
  },
  {
    type: "paragraph",
    content:
      "You will never know. The information that would have answered the question never existed in the first place.",
  },
  {
    type: "paragraph",
    content:
      "That's not a camera failure. That's a security failure. Cameras you can't trust to tell you who looked at the footage and when are just expensive wallpaper.",
  },
  {
    type: "heading",
    level: 2,
    content: "The bare minimum that isn't",
  },
  {
    type: "paragraph",
    content:
      "Five things every small business should have in place. None of them are exotic. All of them are commonly skipped.",
  },
  {
    type: "paragraph",
    content:
      "1. Default passwords changed. On everything. The router, the camera DVR, the printer, the smart thermostat, the doorbell. Every device shipped with a default password, and every device's default password is in a public list anyone can find in 30 seconds.",
  },
  {
    type: "paragraph",
    content:
      "2. Individual logins, not shared logins, for anything that matters. Camera systems. Bank accounts. Point-of-sale. Email. The cloud accounts the business runs on. Shared logins are convenient until the day you need to know who did what.",
  },
  {
    type: "paragraph",
    content:
      "3. Multi-factor authentication on the accounts that hurt to lose. Bank. Payment processor. Email. Domain registrar. Cloud admin. If someone gets the password, MFA is the second wall.",
  },
  {
    type: "paragraph",
    content:
      "4. Guest Wi-Fi separated from business Wi-Fi. The credit card terminal should not be on the same network as the customer's phone. Most consumer routers can do this with a checkbox; many businesses just never checked it.",
  },
  {
    type: "paragraph",
    content:
      "5. An audit trail on the things that need one. Who deleted the footage. Who voided the sale. Who logged into the bank account. You don't need it for everything — but for the things where the question \"who did this?\" might come up later, you need to be able to answer.",
  },
  {
    type: "paragraph",
    content:
      "None of these are expensive. None of them require buying a new system. All of them are usually achievable in an afternoon on equipment you already own. The reason they're not done isn't cost. It's that nobody made it their job.",
  },
  {
    type: "heading",
    level: 2,
    content: "Where shared logins are actually fine",
  },
  {
    type: "paragraph",
    content:
      "We're not going to pretend every system needs individual accounts. Some genuinely don't.",
  },
  {
    type: "paragraph",
    content:
      "The label printer in the back. The conference room TV. The Spotify account playing music in the dining room. The display monitor at the front desk. If the worst-case answer to \"who did this?\" is \"someone who works here changed the music,\" the shared login is fine.",
  },
  {
    type: "paragraph",
    content:
      "The question is always: what does this system protect? If the answer is \"nothing the business would care about,\" shared is fine. If the answer is \"money, customer data, or the evidence of who did what,\" shared is a future problem.",
  },
  {
    type: "heading",
    level: 2,
    content: "The other extreme — and why we're not advocating for it",
  },
  {
    type: "paragraph",
    content:
      "Here's the part you won't get from a typical IT firm: more security is not always better.",
  },
  {
    type: "paragraph",
    content:
      "We've worked in places that watch their employees through cameras in every room. That log every keystroke. That require complicated badge readers for every door. That mandate password rotations so frequent that the staff just writes the current week's password on a sticky note next to the monitor — defeating the entire point.",
  },
  {
    type: "paragraph",
    content:
      "Security that makes life impossible doesn't get followed. Security that watches everything makes employees feel like suspects. The cameras-everywhere world is not a world most of us actually want to live in. Some of us own businesses partly to NOT work in that world.",
  },
  {
    type: "paragraph",
    content:
      "Ben Franklin's line: those who would give up essential liberty to purchase a little temporary safety deserve neither. He was writing about something specific in 1755, but the line holds. A business so locked down nobody trusts anyone is a business that lost something more valuable than whatever it was trying to protect.",
  },
  {
    type: "heading",
    level: 2,
    content: "What the right level looks like",
  },
  {
    type: "paragraph",
    content:
      "Calibrated. That's the word.",
  },
  {
    type: "paragraph",
    content:
      "Real security on the things that matter. The bank account has individual logins and multi-factor auth. The camera system records who logged in and when. The point-of-sale tracks every void, every refund, every register-open by the person who did it. The Wi-Fi separates guest traffic from business traffic. The default passwords are gone.",
  },
  {
    type: "paragraph",
    content:
      "Lighter touch on the things that don't. The music account is shared. The conference room TV is shared. The label printer doesn't have a password at all. Nobody is going to commit fraud through the label printer.",
  },
  {
    type: "paragraph",
    content:
      "And a culture that doesn't treat the staff as suspects. The cameras are at the entrances, exits, and the cash register. Not over the lunch table. Not in the break room. Not tracking what page of the manual someone is reading. The point of security is to protect the business from outside threats and to answer specific accountability questions when they come up — not to surveil the people who work there.",
  },
  {
    type: "paragraph",
    content:
      "Get those proportions right and the staff actually follows the security that's in place, because the security makes sense to them. Get it wrong — too much friction, too much surveillance, too little trust — and the security degrades on its own. People work around what they can't live with.",
  },
  {
    type: "heading",
    level: 2,
    content: "How we work this",
  },
  {
    type: "paragraph",
    content:
      "Same way we work everything else. We ask questions.",
  },
  {
    type: "paragraph",
    content:
      "What systems does the business have right now? Who has access to each one? When was the last time the access list was reviewed? What are the default passwords still in place? Where would a malicious outsider start? Where would a malicious insider start? What's the worst-case scenario you actually worry about — and how would you know if it happened?",
  },
  {
    type: "paragraph",
    content:
      "From the answers, we figure out where the gaps are that genuinely matter. Default passwords get changed. Individual logins get set up where they're load-bearing. MFA gets enabled on the accounts that would ruin your week to lose. The Wi-Fi gets separated. The camera system gets audit logging turned on so the next time someone asks \"who deleted Wednesday's footage,\" the answer exists.",
  },
  {
    type: "paragraph",
    content:
      "And we explicitly tell you what NOT to bother with. The systems that don't need individual logins. The accounts that don't need MFA because the worst case isn't worth the friction. The cameras that already cover what they need to cover. The places where adding more security would just make life worse without making the business any safer.",
  },
  {
    type: "paragraph",
    content:
      "The job isn't to give you maximum security. It's to give you the security that fits the business you're actually running.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Worried about the default passwords, shared logins, or cameras you can't quite trust? Free one-hour consultation. We walk your environment, find the actual gaps, and tell you what to fix in what order — without trying to sell you the surveillance state.",
    ctaText: "Book your free hour",
    ctaHref: "/book",
  },
  {
    type: "cta",
    content:
      "More on how we think about the whole technology picture — security included — as part of the broader partnership.",
    ctaText: "How we work",
    ctaHref: "/services",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "security-is-inconvenient" },
    update: {
      title: "Security Is Inconvenient. That's the Point.",
      excerpt:
        "Your house has locks, a deadbolt, maybe an alarm. All inconvenient, all worth it. Most small businesses skip the IT equivalent — default passwords still in place, cameras on shared logins, no audit trail when Wednesday's footage disappears. Here's how to get security right without becoming the surveillance state your employees won't actually follow.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-29T09:00:00-04:00"),
    },
    create: {
      title: "Security Is Inconvenient. That's the Point.",
      slug: "security-is-inconvenient",
      excerpt:
        "Your house has locks, a deadbolt, maybe an alarm. All inconvenient, all worth it. Most small businesses skip the IT equivalent — default passwords still in place, cameras on shared logins, no audit trail when Wednesday's footage disappears. Here's how to get security right without becoming the surveillance state your employees won't actually follow.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-29T09:00:00-04:00"),
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

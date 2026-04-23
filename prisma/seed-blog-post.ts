// prisma/seed-blog-post.ts
// One-time script to seed the first blog post. Run with: npx tsx prisma/seed-blog-post.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "heading",
    level: 2,
    content: "The Setup",
  },
  {
    type: "paragraph",
    content:
      "In the summer of 2021, the company I was running IT for partnered with a regional apparel retailer. We'd been running the apparel side for over a decade, and while it showed a profit on paper, it was draining us on cash flow. The idea was to bring in a seasoned retail partner to fix the cash issues and grow the business.",
  },
  {
    type: "paragraph",
    content:
      "I had impostor syndrome immediately. Multiple stores, established brand — they must have a real IT team. I better be on my A game.",
  },
  {
    type: "paragraph",
    content:
      'So I emailed their tech contact and asked a simple question: "What do you need from me? What would you expect from a tech partner at this point?"',
  },
  {
    type: "paragraph",
    content: "I didn't hear back.",
  },
  {
    type: "heading",
    level: 2,
    content: "Months of Silence",
  },
  {
    type: "paragraph",
    content:
      "Months went by with no response. Then, about two months before the switchover, iPads and payment hardware showed up at our door. I was thrilled. iPads — this would be easy.",
  },
  {
    type: "paragraph",
    content:
      'At the time, our internal network used 802.1X with certificate-based authentication. Not because we needed to — it was more of a "can I do this?" project, one of the perks of being a department of one. Since it was a 50/50 partnership and the owner wanted to share resources, we kept their devices on our network instead of setting up a separate one.',
  },
  {
    type: "paragraph",
    content:
      "Assuming they had Apple Business and an MDM in place, I sent over the certificates needed to join the network. I even sent generic configuration profiles they should have been able to deploy if they had the right tools.",
  },
  {
    type: "heading",
    level: 2,
    content: "Changeover Day",
  },
  {
    type: "paragraph",
    content:
      "Their team shows up — six people, POS terminals, new store design, the whole deal. This should have been a couple of hours: turn on the iPads, join the guest network, let enrollment kick in, updates install, apps deploy via MDM. We even had a local caching server to speed things up.",
  },
  {
    type: "paragraph",
    content:
      'I was on-site that morning. Asked them multiple times: "Need anything from me?" "Nope, we\'re all good." So I leave at 2:30 like normal.',
  },
  {
    type: "heading",
    level: 2,
    content: "The 4:30 Call",
  },
  {
    type: "paragraph",
    content:
      '"The iPads aren\'t working. They won\'t connect. We can\'t run anything."',
  },
  {
    type: "paragraph",
    content:
      '"Did they use the setup instructions I sent over?" "They couldn\'t connect. Nothing\'s installed."',
  },
  {
    type: "paragraph",
    content:
      'I told the team: "Have them use the guest network for now. Leave the devices on my desk. I\'ll look tomorrow."',
  },
  {
    type: "heading",
    level: 2,
    content: "The Next Morning",
  },
  {
    type: "paragraph",
    content:
      "I opened one up and the full picture came together.",
  },
  {
    type: "paragraph",
    content:
      "What I assumed they had: Apple Business. An MDM platform. Managed Apple IDs. Configuration profiles. A basic understanding of device management.",
  },
  {
    type: "paragraph",
    content:
      "What they actually had: every iPad logged into the same personal Apple ID. No Apple Business. No MDM — not Jamf, not Mosyle, not anything. No way to deploy network profiles. No way to push apps. No concept of what any of this meant.",
  },
  {
    type: "paragraph",
    content:
      "I had overestimated them entirely. A multi-store retailer with physical locations, employees, and POS systems — and not a single managed device.",
  },
  {
    type: "heading",
    level: 2,
    content: "The Fix",
  },
  {
    type: "paragraph",
    content:
      "I had a choice: stick to my secure, segmented 802.1X setup and fight them tooth and nail, or make life easier and get this working. I went with option two.",
  },
  {
    type: "paragraph",
    content:
      "Created a temporary WPA3 network. Pushed a new configuration profile to our managed devices. Noted the four devices that didn't receive it. Reconfigured the primary network to WPA3. Sent a new profile to the fleet with the updated settings. Noted any devices that missed the payload. Removed the temporary network.",
  },
  {
    type: "paragraph",
    content:
      "Then came the manual work: adding Wi-Fi settings to their unmanaged iPads one by one. Updating POS systems. Manually installing the POS app on every single iPad using a shared Apple ID — because without Apple Business, there was no way to push apps. Without an MDM, there was no way to push anything at all.",
  },
  {
    type: "paragraph",
    content:
      "Every manual step, every security compromise, every hour of firefighting — all because they didn't have Apple Business and they didn't have an MDM.",
  },
  {
    type: "heading",
    level: 2,
    content: "The Lesson",
  },
  {
    type: "paragraph",
    content:
      "This wasn't a small startup operating out of a garage. This was an established, multi-location retailer. And their entire Apple device strategy was: buy iPads, log in with a personal Apple ID, and figure it out.",
  },
  {
    type: "paragraph",
    content:
      "That's not unusual. That's typical.",
  },
  {
    type: "paragraph",
    content:
      "Most businesses we talk to are in some version of this situation. Maybe not as dramatic, but the fundamentals are the same: devices purchased without Apple Business enrollment. No MDM, or Intune being stretched across both Windows and Apple (which introduces its own problems). Personal Apple IDs on company devices. No way to remotely manage, update, or wipe anything. No zero-touch deployment — every device hand-configured.",
  },
  {
    type: "paragraph",
    content:
      "The fix isn't complicated. Apple Business is free. MDM platforms cost a few dollars per device per month. Zero-touch deployment means a new hire opens their device and it's ready to go — no IT visit, no manual setup.",
  },
  {
    type: "paragraph",
    content:
      "But you have to set it up before you buy the devices. And that's where most companies get stuck. Not because it's hard — because nobody told them it was necessary.",
  },
  {
    type: "divider",
  },
  {
    type: "paragraph",
    content:
      "We set up Apple Business, deploy the right MDM for your environment, and train your IT team to manage it all. So the next time someone shows up with iPads on changeover day, every device enrolls itself — and your team knows exactly what to do.",
  },
  {
    type: "cta",
    content:
      "If any of this sounds familiar, we should talk.",
    ctaText: "Book a free consultation",
    ctaHref: "/book",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "ipad-deployment-without-apple-business-manager" },
    update: {
      title: "No Apple Business. No MDM. No Plan. A Real iPad Deployment Story.",
      excerpt:
        "A multi-store retailer shows up on changeover day with unmanaged iPads, a shared personal Apple ID, and no idea what MDM stands for. Here's what happened — and what should have been in place.",
      content: content as never,
      status: "PUBLISHED",
      // Canonical publish date — fixed, not new Date(). Setting in both update
      // and create keeps the seed idempotent and restores any prior drift.
      publishedAt: new Date("2026-04-09T10:00:00-04:00"),
    },
    create: {
      title: "No Apple Business. No MDM. No Plan. A Real iPad Deployment Story.",
      slug: "ipad-deployment-without-apple-business-manager",
      excerpt:
        "A multi-store retailer shows up on changeover day with unmanaged iPads, a shared personal Apple ID, and no idea what MDM stands for. Here's what happened — and what should have been in place.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-04-09T10:00:00-04:00"),
    },
  });

  console.log(`Blog post created: ${post.title} (${post.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

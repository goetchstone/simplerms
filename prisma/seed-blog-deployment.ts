// prisma/seed-blog-deployment.ts
// One-time script to seed the deployment blog post. Run with: npx tsx prisma/seed-blog-deployment.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "Most businesses deploy Apple devices by hand — one iPad at a time, personal Apple IDs, no management. We've seen it. This is what it looks like when you do it right.",
  },
  {
    type: "heading",
    level: 2,
    content: "The Purchase",
  },
  {
    type: "paragraph",
    content:
      "We created a proposal through the Apple e-commerce portal for two iPads. Leadership approved the purchase. We logged back in, pulled up the proposal, and hit order. That was the hard part.",
  },
  {
    type: "heading",
    level: 2,
    content: "What Happened Next — Without Anyone Touching Anything",
  },
  {
    type: "paragraph",
    content:
      "The iPads were automatically assigned to the MDM through Apple Business. We'd already added the new employees to the identity provider. Federation between the workspace and MDM synced users to both the MDM and Apple Business automatically.",
  },
  {
    type: "paragraph",
    content:
      "One iPad got our standard register configuration — a guest account with the company's security and network requirements baked in. The other got a shared iPad enrollment profile. Users were assigned by group, so the shared iPad already knew who was allowed to log in.",
  },
  {
    type: "paragraph",
    content:
      "All of this happened before the devices left the warehouse.",
  },
  {
    type: "heading",
    level: 2,
    content: "Deployment Day",
  },
  {
    type: "paragraph",
    content:
      "When the iPads showed up, the entire deployment was three steps: open the box, join an open Wi-Fi network, and let automated device enrollment take over.",
  },
  {
    type: "paragraph",
    content:
      "Profiles pushed. Apps installed. Bookmarks arrived via Chrome management. The shared iPad was automatically configured with login access for the predefined user group. We were live in under an hour.",
  },
  {
    type: "paragraph",
    content:
      "No tech driving to the site. No duct tape. No fire drill. As close to zero-touch as it gets.",
  },
  {
    type: "heading",
    level: 2,
    content: "The Audible",
  },
  {
    type: "paragraph",
    content:
      "Then we used them. And within a few weeks, we realized the iPads were actually slowing down our checkout lanes. They were the wrong tool for the job. So we switched to iMacs.",
  },
  {
    type: "paragraph",
    content:
      "Ordered them through the same portal. Assigned them their own MDM profiles for their POS role. Through the MDM, we set up generic logins — StorePrefixRegister1, StorePrefixRegister2 — with passwords defined in the enrollment profile. We set an admin user too, and for enhanced security, we let the MDM generate and hold the admin password. That's a pain when you need it, but security is often a pain in the ass. That's how you know it's working.",
  },
  {
    type: "paragraph",
    content:
      "Devices came online. Profiles applied. Apps deployed. Bookmarks there. Everything current. No delays. No exceptions. And now we can ensure they stay updated — when software updates cooperate, they actually do.",
  },
  {
    type: "heading",
    level: 2,
    content: "The Difference",
  },
  {
    type: "paragraph",
    content:
      "The entire pivot from iPads to iMacs took less time than the iPad deployment in the last post — the one where nothing was managed and every device had to be configured by hand.",
  },
  {
    type: "paragraph",
    content:
      "That's what infrastructure does. When Apple Business and an MDM are in place, changing hardware is a Tuesday. When they're not, it's a two-day disaster.",
  },
  {
    type: "paragraph",
    content:
      "The setup takes a few hours. The portal is free. The MDM costs a few dollars per device per month. And the next time your team needs to deploy, replace, or pivot — they order the hardware and the system handles the rest. That's what it means to own your infrastructure.",
  },
  {
    type: "divider",
  },
  {
    type: "paragraph",
    content:
      "We set up Apple Business, deploy the right MDM, and train your team to run it. So the next deployment looks like this one — not the last one.",
  },
  {
    type: "cta",
    content:
      "Want your deployments to work like this?",
    ctaText: "Book a free consultation",
    ctaHref: "/book",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "apple-device-deployment-done-right" },
    update: {
      title: "Two iPads, One Hour, Zero Site Visits. Then We Switched to iMacs.",
      excerpt:
        "What deployment looks like when Apple Business and an MDM are already in place. Order, enroll, deploy — and pivot to different hardware without breaking a sweat.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    create: {
      title: "Two iPads, One Hour, Zero Site Visits. Then We Switched to iMacs.",
      slug: "apple-device-deployment-done-right",
      excerpt:
        "What deployment looks like when Apple Business and an MDM are already in place. Order, enroll, deploy — and pivot to different hardware without breaking a sweat.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date(),
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

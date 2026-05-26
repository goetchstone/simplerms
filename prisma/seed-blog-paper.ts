// prisma/seed-blog-paper.ts
// One-time script to seed the "back to paper" blog post.
// Run with: npx tsx prisma/seed-blog-paper.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "Last week I watched someone print 100 copies of a customer service intake form. The forms will be filled in by hand at the front desk, then someone — maybe the same person, maybe not — will retype the data into the customer service program later. Twice the work. Half the speed. From a pure efficiency standpoint, it's nonsense.",
  },
  {
    type: "paragraph",
    content:
      "And it happens everywhere. A new team takes over and the binder comes back out. A system change goes sideways and the filing cabinets get hauled into the front office. A digital form gets quietly bypassed by a printout taped to the wall. Every time, the IT person watching shakes their head and wonders why anyone would do this on purpose.",
  },
  {
    type: "paragraph",
    content:
      "There's an answer. It's almost never the one IT expects.",
  },
  {
    type: "heading",
    level: 2,
    content: "The X-Y Problem, in real life",
  },
  {
    type: "paragraph",
    content:
      "There's a name for the pattern. It's called the X-Y problem.",
  },
  {
    type: "paragraph",
    content:
      "People come to you with the solution they've already decided on (Y) instead of the actual problem (X). They don't say \"I can't find the customer's file when I need it during a call.\" They say \"let's just go back to paper.\" They don't say \"the new system makes me feel stupid every time I try to enter a new client.\" They say \"this used to be easier on paper.\"",
  },
  {
    type: "paragraph",
    content:
      "Once the workaround gets said out loud, the workaround starts to feel like the diagnosis. The conversation becomes \"paper versus digital\" instead of \"what's wrong with the digital workflow.\" The actual problem — the one that would unlock everything — never gets named.",
  },
  {
    type: "paragraph",
    content:
      "Going back to paper isn't a solution. It's a symptom. And the symptom is telling you something specific if you listen for it.",
  },
  {
    type: "heading",
    level: 2,
    content: "Five reasons people actually revert to paper",
  },
  {
    type: "paragraph",
    content:
      "When someone in a small business decides to print 100 forms, one of these is usually the real reason. Each one points to a different fix.",
  },
  {
    type: "paragraph",
    content:
      "1. They don't know how. The system was deployed but never taught. Or it was taught once, two years ago, to a person who has since left. The current staff is guessing. Paper is what they default to because at least with paper they know what they're doing. Training problem — usually fixable in an afternoon if anyone takes the time.",
  },
  {
    type: "paragraph",
    content:
      "2. The digital form takes too many clicks. Twelve fields, three required, two dropdowns that take forever to load, a save button that's not obvious. Paper takes 30 seconds; the digital version takes three minutes. From the user's seat, paper is rational. Workflow problem — fixable with field defaults, a streamlined entry view, or removing required fields that don't have to be required.",
  },
  {
    type: "paragraph",
    content:
      "3. The digital form demands information that doesn't exist yet at the moment of intake. The customer hasn't told you their email yet, but the form requires it. The phone number isn't known, but the form won't save. So someone prints a form they CAN fill in with what they have, and worries about typing it in later. Process problem — the digital form was designed by someone who didn't understand the actual workflow.",
  },
  {
    type: "paragraph",
    content:
      "4. They tried it once, made a mistake, and nobody helped them recover. Maybe they entered a customer twice. Maybe they couldn't find the record they just created. Maybe a manager noticed something missing and got frustrated. Now they don't trust the system, and paper feels like the safe choice. Permission problem — when people feel like the digital system punishes mistakes, they revert to the tool that doesn't.",
  },
  {
    type: "paragraph",
    content:
      "5. The system is genuinely slow or broken at the moment of use. Internet is unreliable. The application takes 90 seconds to launch. The credit card terminal is on a different network. Real technical problem — and an excellent one to discover, because at least it has a name.",
  },
  {
    type: "paragraph",
    content:
      "Five different problems. Five different fixes. None of them are \"buy a better system.\" None of them are \"force the staff to stop using paper.\" Both of those responses make it worse.",
  },
  {
    type: "heading",
    level: 2,
    content: "It's not analytical. It's emotional.",
  },
  {
    type: "paragraph",
    content:
      "Most IT people miss this part. They look at the duplicate data entry, calculate the labor cost, and conclude the person printing 100 forms is making an irrational choice. They're wrong.",
  },
  {
    type: "paragraph",
    content:
      "People don't choose paper because of a cost-benefit analysis. They choose it because paper feels safe.",
  },
  {
    type: "paragraph",
    content:
      "You can hold it. You can lose it without leaving an audit trail. You can scribble on it, cross things out, write a note in the margin. You can throw it out and start over with no system telling you the deletion was logged. The digital system feels like it's watching — every click recorded, every save tracked, every mistake visible to whoever owns the database. Most people would rather pay the duplicate-data-entry tax than feel watched while they're trying to do their job.",
  },
  {
    type: "paragraph",
    content:
      "There's also a dignity component. Paper doesn't punish you for being new. The system, badly deployed, does. People learn to avoid the things that make them feel stupid. Paper is what they're avoiding the digital system to feel less stupid about.",
  },
  {
    type: "paragraph",
    content:
      "Until you address that, you're not going to solve it with a better-designed form.",
  },
  {
    type: "heading",
    level: 2,
    content: "What paper actually costs",
  },
  {
    type: "paragraph",
    content:
      "Once the regression is in place, the costs compound. Most owners don't see them all at once, which is why the paper habit persists.",
  },
  {
    type: "paragraph",
    content:
      "Double data entry. Every form filled in on paper has to be typed into the system anyway, by someone, at some point. That's labor billed twice for the same information.",
  },
  {
    type: "paragraph",
    content:
      "Errors at the seam. The handoff between paper and digital is where data goes wrong. Handwriting misread. Fields skipped. Customers entered with two slightly different spellings of their name, creating duplicate records that nobody catches until they cause a billing problem six months later.",
  },
  {
    type: "paragraph",
    content:
      "Lost searchability. Paper records can't be searched. The information exists, but finding it requires walking to a filing cabinet, knowing how it was filed, and physically locating the right page. Multiply that by every customer interaction, every month, forever.",
  },
  {
    type: "paragraph",
    content:
      "No audit trail. Who took the intake? When? What was the customer told? If a dispute comes up later, paper offers no answer. Digital systems leave timestamps, edit histories, user IDs. Paper offers a stack and a guess.",
  },
  {
    type: "paragraph",
    content:
      "Single point of failure. The filing cabinet is in one office. A pipe leaks, a fire happens, the office moves and the boxes get misplaced — and the records are gone. Digital systems with backups don't have this failure mode.",
  },
  {
    type: "paragraph",
    content:
      "Lost analytics. You can't run a report on a stack of intake forms. The data exists, but it's invisible to anyone trying to understand the business. How many new customers this month? Which referral source is best? What's the average intake-to-first-service time? Paper hides every one of those answers.",
  },
  {
    type: "paragraph",
    content:
      "These costs are real. They're also invisible to the person printing 100 forms — because that person is solving a local, immediate problem (the system isn't working for me right now), not optimizing the global cost structure of the business.",
  },
  {
    type: "heading",
    level: 2,
    content: "How we work this",
  },
  {
    type: "paragraph",
    content:
      "We don't walk in and tell the person printing the forms they're doing it wrong. That's the fastest way to make them double down — and it usually means the actual problem never surfaces.",
  },
  {
    type: "paragraph",
    content:
      "We ask questions.",
  },
  {
    type: "paragraph",
    content:
      "Why are you doing it this way? What happens if you don't print the form? When did this start? What did you used to do? What does the form let you do that the system doesn't? Where does the printed form go next? Who's the last person to touch it? Has anyone ever lost one? What's the worst thing that's happened?",
  },
  {
    type: "paragraph",
    content:
      "Most of the time, by question four or five, the actual problem starts to show up. The person knows what's wrong — they just hadn't been asked. \"I can't find the customer's record when they call back.\" \"The form makes me put in things I don't have yet.\" \"My manager yelled at me when I entered a duplicate and I just stopped using it.\" Now we have something to fix.",
  },
  {
    type: "paragraph",
    content:
      "Then we find the actual problem. Sometimes it's training — schedule an hour, walk through the workflow, give people permission to ask questions. Sometimes it's workflow — the form was built wrong, or the required fields are wrong, or the search is genuinely useless. Sometimes it's process — the digital workflow doesn't match how people actually work and never could. Sometimes it's all three at once.",
  },
  {
    type: "paragraph",
    content:
      "And then we develop the solution and the training together. Not a 60-page documentation binder nobody reads. A short walkthrough, a one-page reference, a thirty-minute session with the people who actually do the work. The fix isn't successful until the person who was printing 100 forms doesn't need to print them anymore. That's the only measure that matters.",
  },
  {
    type: "paragraph",
    content:
      "The paper doesn't disappear because we banned it. It disappears because the digital workflow finally became easier than the workaround. That's the whole job.",
  },
  {
    type: "heading",
    level: 2,
    content: "When paper is actually the right answer",
  },
  {
    type: "paragraph",
    content:
      "We'll be honest: there are a few. Quick scratch notes during a phone call where digital entry would be a distraction. A signed customer authorization on paper because some industries still require a wet signature. A whiteboard in the back office that lives faster than a digital tool ever will. A backup paper process for the day the internet goes down at the worst possible moment.",
  },
  {
    type: "paragraph",
    content:
      "But \"my team has reverted to printing 100 intake forms a week and re-entering them later\" is not one of those situations. That's a symptom. The symptom is telling you something. Listen for it.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Watching paper creep back into your business and not sure why? We come in, ask the questions, find the actual problem, and develop the solution and the training together. Free one-hour consultation. We walk your environment, listen to your team, and tell you what the workaround is actually trying to fix.",
    ctaText: "Book your free hour",
    ctaHref: "/book",
  },
  {
    type: "cta",
    content:
      "More on how we approach process and workflow problems — not just technology problems. The two are connected, and most IT firms only see one of them.",
    ctaText: "How we work",
    ctaHref: "/services",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "when-your-team-goes-back-to-paper" },
    update: {
      title: "When Your Team Goes Back to Paper, They're Telling You Something",
      excerpt:
        "Last week I watched someone print 100 copies of a customer service intake form — forms that would be re-entered into the customer service program later. From a pure efficiency standpoint, it's nonsense. It also happens everywhere. The reversion to paper isn't stupidity. It's a signal. Here's what your team is actually saying when they go back to paper, and how to fix the real problem instead of the symptom.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-23T09:00:00-04:00"),
    },
    create: {
      title: "When Your Team Goes Back to Paper, They're Telling You Something",
      slug: "when-your-team-goes-back-to-paper",
      excerpt:
        "Last week I watched someone print 100 copies of a customer service intake form — forms that would be re-entered into the customer service program later. From a pure efficiency standpoint, it's nonsense. It also happens everywhere. The reversion to paper isn't stupidity. It's a signal. Here's what your team is actually saying when they go back to paper, and how to fix the real problem instead of the symptom.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-23T09:00:00-04:00"),
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

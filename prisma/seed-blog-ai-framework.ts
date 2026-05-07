// prisma/seed-blog-ai-framework.ts
// One-time script to seed the AI framework blog post. Run with: npx tsx prisma/seed-blog-ai-framework.ts
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const content = [
  {
    type: "paragraph",
    content:
      "Most AI output is mediocre because the prompts that produced it didn't give the AI enough to work with. The model has to fill the gaps from training data, which means it fills them with whatever sounds right — confident, generic, often wrong in ways the prompter can't see. The fix isn't a smarter model. It's a habit of giving the model the information it needs before asking it for something.",
  },
  {
    type: "paragraph",
    content:
      "This is the framework I use. It's also what I teach in the AI workshop at PSU MacAdmins. There's a longer 9-layer version that goes section by section in a workshop setting — useful for teaching the underlying ideas, less useful for daily work. What follows is the daily-use version: five parts to build the prompt, five checks to evaluate the output. Symmetric, memorable, useful Tuesday.",
  },
  {
    type: "heading",
    level: 2,
    content: "A worked example before the framework",
  },
  {
    type: "paragraph",
    content:
      "Imagine an executive team that decides to change how the business takes payments. They want to capture credit cards from sales staff in the field. They want to move quickly. Nobody calls the compliance officer. Someone opens ChatGPT and types: \"Create a PCI compliant plan for our employees to take customer credit card information.\"",
  },
  {
    type: "paragraph",
    content:
      "The AI returns an eight-page document. It uses the right vocabulary. It mentions SAQ categories, tokenization, written authorization. It even cites that the approach is \"widely used among premium retailers\" — based on nothing in particular, but the phrase reads like validation. The plan ships. The compliance officer sees it later and says, \"This is a compliance nightmare.\" She's right. The plan describes a workflow that PCI DSS exists to prevent. But her five-word veto can't beat the eight-page document on optics, and the plan moves forward anyway. (I wrote about that side of the problem in detail in the Prompt Jockey post.)",
  },
  {
    type: "paragraph",
    content:
      "The interesting question isn't what went wrong with the document — it's what would have gone right if the same person had used the framework before they hit Enter. So let's run that scenario through.",
  },
  {
    type: "heading",
    level: 2,
    content: "Building the prompt: 5 parts",
  },
  {
    type: "paragraph",
    content:
      "The five parts are WHO, WHAT, DATA, SHAPE, ITERATE. Each one is genuinely distinct from the others. Skip any of them and the output gets worse in a specific way — usually a way that's hard to spot in the polished result.",
  },
  {
    type: "heading",
    level: 3,
    content: "1. WHO",
  },
  {
    type: "paragraph",
    content:
      "Who you are, and who the output is for. This shapes vocabulary, detail level, and assumptions. \"I'm a Mac admin writing this for my director, who needs to approve a budget,\" produces different output than \"I'm a director writing this for the technical staff who'll implement it.\" Same task, different audience, different output.",
  },
  {
    type: "paragraph",
    content:
      "For the PCI example, the right WHO might be: \"I'm an operations manager at a 25-person retail business, drafting an internal memo for the leadership team. Our compliance officer will review it before we act.\" That single line forces the model to write for a specific reader and respect that the document will be reviewed by someone who knows things the prompter doesn't.",
  },
  {
    type: "heading",
    level: 3,
    content: "2. WHAT",
  },
  {
    type: "paragraph",
    content:
      "The actual task — and what decision or action should follow. \"Write me a thing\" is not enough. The model needs to know what success looks like for the reader.",
  },
  {
    type: "paragraph",
    content:
      "For the PCI example: \"Outline the options for accepting credit card payments from field sales staff, including the compliance implications of each, so leadership can pick the option with the best balance of business need and PCI scope.\" That's a real task. The prompter has decided what the document should help someone do. The model now has a target.",
  },
  {
    type: "heading",
    level: 3,
    content: "3. DATA",
  },
  {
    type: "paragraph",
    content:
      "This is the layer where most prompts fall apart. The model needs the actual facts of your situation — names, numbers, constraints, the things that distinguish your business from a generic example. If you don't give it real data, it will fill in plausible-sounding fiction. That's not the model being malicious; it's doing exactly what it was trained to do: predict what would come next.",
  },
  {
    type: "paragraph",
    content:
      "For the PCI example, the data should include: \"We currently use Stripe for online payments. Our processor is FIS. We have 8 sales reps in the field. They use company iPhones running our MDM. Our current PCI scope is SAQ A. We do not want to expand it. We have no dedicated security staff.\" Now the model has actual constraints. It can reason about whether each option fits.",
  },
  {
    type: "paragraph",
    content:
      "This is also where you tell the model what NOT to invent. \"If you don't have this information, say so. Do not invent customer counts, dollar amounts, regulatory citations, or specific tool names. If a recommendation requires data you don't have, name what's missing.\" One sentence prevents half the hallucinations.",
  },
  {
    type: "heading",
    level: 3,
    content: "4. SHAPE",
  },
  {
    type: "paragraph",
    content:
      "Format, tone, stakes, where it'll be used, when it's done. Everything about the output's form rather than its content. Bullet points or paragraphs? Email or formal memo? Short or long? Diplomatic or blunt? What does \"finished\" look like?",
  },
  {
    type: "paragraph",
    content:
      "For the PCI example: \"Format as a memo with three sections: (1) Options summary table, (2) Pros and cons of each option with PCI scope implication, (3) Recommendation with the assumption that the compliance officer will review. Tone should be analytical, not promotional. The document is finished when leadership can read it in 10 minutes and pick an option to discuss with the compliance officer.\"",
  },
  {
    type: "paragraph",
    content:
      "If you can't describe what finished looks like, the model can't either. SHAPE forces you to think about the reader before you write the prompt.",
  },
  {
    type: "heading",
    level: 3,
    content: "5. ITERATE",
  },
  {
    type: "paragraph",
    content:
      "Almost nobody does this part, and it's the part that turns mediocre output into useful output. After the first response, ask: \"What's wrong with this output?\" Then: \"What's missing?\" Then: \"What could fail if we acted on this?\" Then: \"Steelman the strongest objection to this approach.\"",
  },
  {
    type: "paragraph",
    content:
      "These four questions force the model out of its default people-pleasing mode. The model won't volunteer problems. It writes for approval. When you ask it to critique its own work, it becomes much sharper. The PCI plan asked this way often catches its own contradiction — the workflow that the plan describes literally violates the PCI requirements the plan claims to satisfy. The model can see this when asked. It just won't say it without being asked.",
  },
  {
    type: "paragraph",
    content:
      "Iteration also lets you tighten without starting over. The model is holding all the context from your earlier prompt. Use it. Don't open a new chat just because the first answer wasn't quite right.",
  },
  {
    type: "heading",
    level: 2,
    content: "The fast version",
  },
  {
    type: "paragraph",
    content:
      "The full five-part framework is for medium-to-high stakes work. When the stakes are low and the domain is well-known, three questions are enough:",
  },
  {
    type: "paragraph",
    content:
      "WHO is this for? WHAT is the actual job? WHAT data must it use?",
  },
  {
    type: "paragraph",
    content:
      "Drafting an internal FAQ? Summarizing a meeting? Generic password-policy training? Just answer those three. SHAPE and ITERATE add overhead that doesn't pay back when the worst-case is \"this email got slightly reworded.\" The framework isn't bureaucracy — it scales to the stakes.",
  },
  {
    type: "heading",
    level: 2,
    content: "When to use which version",
  },
  {
    type: "paragraph",
    content:
      "Match the effort to the consequences of being wrong.",
  },
  {
    type: "paragraph",
    content:
      "Low stakes (internal FAQ, meeting summary, password training, brainstorming): just ask. Three questions if you want a small floor. Bad output here costs you a few minutes.",
  },
  {
    type: "paragraph",
    content:
      "Medium stakes (SOPs, client emails, troubleshooting docs, internal policies): use the full five-part framework. Bad output here costs you reputation, time, or a small amount of money.",
  },
  {
    type: "paragraph",
    content:
      "High stakes (compliance plans, deployment configs, security policies, contract language): full framework PLUS subject matter expert review of the output before it leaves your hands. Bad output here costs you fines, breaches, lawsuits, or your business.",
  },
  {
    type: "paragraph",
    content:
      "If you can't tell which bucket you're in, default to one bucket up.",
  },
  {
    type: "heading",
    level: 2,
    content: "Evaluating the output: 5 checks",
  },
  {
    type: "paragraph",
    content:
      "Building the prompt is half the work. The other half is evaluating what comes back. This is where most people stop — the output looks finished, the formatting is clean, it sounds confident, so they accept it and move on. That's the gap the framework is built to close.",
  },
  {
    type: "paragraph",
    content:
      "Five checks. Run them in order. Stop at the first one the output fails.",
  },
  {
    type: "heading",
    level: 3,
    content: "1. Accuracy",
  },
  {
    type: "paragraph",
    content:
      "Are there specific facts, names, dates, numbers, or citations? Verify every one. If the output references a tool, confirm the tool exists and works the way the output describes it. If it references a regulation or standard, look up the actual text. The model is fluent at citing things that don't exist or paraphrasing them inaccurately. The fluency is the trap.",
  },
  {
    type: "heading",
    level: 3,
    content: "2. Contradictions",
  },
  {
    type: "paragraph",
    content:
      "Read it twice. Does any section contradict another? Does the recommendation actually achieve the stated goal, or does it undermine it? The PCI example is the textbook case — the plan claimed to be PCI compliant while describing a workflow that PCI exists to prohibit. Internal contradictions like that are common in long AI outputs, and they're invisible if you only read the document once for general impression.",
  },
  {
    type: "heading",
    level: 3,
    content: "3. AI slop",
  },
  {
    type: "paragraph",
    content:
      "Are there phrases that sound authoritative but say nothing? \"Leveraging best practices.\" \"Industry-standard approach.\" \"As is widely understood.\" \"Stakeholders will benefit from.\" These are filler that confident-sounds-right mode produces when the model has nothing specific to say. If you can replace a paragraph with a single sentence and lose nothing, the paragraph is slop. Cut it.",
  },
  {
    type: "paragraph",
    content:
      "Other tells: unnecessary emojis, comments that just restate what the next line obviously does, parenthetical asides that don't add information, formatting choices that scream auto-generated. None of these are deal-breakers individually, but stacked together they signal the output wasn't written for a specific reader.",
  },
  {
    type: "heading",
    level: 3,
    content: "4. The hard questions",
  },
  {
    type: "paragraph",
    content:
      "Ask the model directly: \"What's wrong with this?\" \"What's missing?\" \"What could fail if we acted on this?\" \"Steelman the strongest objection.\" The same iteration questions from when you built the prompt — used here to pressure-test the output. The model is much better at criticism when invited than at proactive volunteering.",
  },
  {
    type: "heading",
    level: 3,
    content: "5. The gut check",
  },
  {
    type: "paragraph",
    content:
      "Would you stake your name on this output in a meeting? If your compliance officer, security auditor, or boss read this, would it hold up? Did you actually read it, or did it just look finished?",
  },
  {
    type: "paragraph",
    content:
      "The honest answer to that last question is the most valuable. Output that just looks finished is the most dangerous thing the framework is trying to catch. Confident-sounding wrong output that gets approved because nobody actually read it.",
  },
  {
    type: "heading",
    level: 2,
    content: "The one rule",
  },
  {
    type: "paragraph",
    content:
      "If the output looks finished but you can't explain WHY each recommendation is correct, it's not done. It's just polished. Polished is not the same as right. The whole framework — the five build parts, the five evaluation checks — exists to keep that distinction sharp.",
  },
  {
    type: "heading",
    level: 2,
    content: "Why this isn't bureaucracy",
  },
  {
    type: "paragraph",
    content:
      "The framework looks like overhead the first few times you use it. It's not. It's the part of thinking that you'd do anyway if you were asked to brief the same topic to a smart person who didn't know your business. WHO they are, WHAT they need to do, what DATA they should have, what SHAPE the answer should take, what to do if the first cut isn't right. You'd think through all of that for a human. You're just usually skipping it for AI because the AI doesn't push back when you don't.",
  },
  {
    type: "paragraph",
    content:
      "Once the habit is internalized, the five parts run in your head in seconds. You don't fill out a worksheet. You think about your reader, the task, the data, the format, and the iteration loop — and the prompt comes out clean. The bureaucracy version (a literal worksheet) is for the high-stakes cases where you want to be sure you didn't miss a layer. The internalized version is what daily use looks like.",
  },
  {
    type: "heading",
    level: 2,
    content: "The principle, not the prompts",
  },
  {
    type: "paragraph",
    content:
      "AI is a real tool with real benefits when it's used well. The framework isn't anti-AI — it's pro-thinking. The model doesn't know what's true. It knows what's statistically likely. Those are very different things, and the gap between them is where polished-sounding wrong output lives. The framework is the discipline that closes the gap.",
  },
  {
    type: "paragraph",
    content:
      "The people who get hurt by AI aren't the ones who never use it. They're the ones who use it without understanding what it is. Five parts to build. Five checks to evaluate. That's the whole framework. Everything else is variations on those ten things.",
  },
  {
    type: "divider",
  },
  {
    type: "cta",
    content:
      "Want this framework as a printable PDF? The 9-layer workshop version of the framework plus the full Definition of Done checklist. Free, no strings, no drip sequence.",
    ctaText: "Get the framework PDF",
    ctaHref: "/resources/ai-framework",
  },
  {
    type: "cta",
    content:
      "If you're rolling AI out across your business and want help putting guardrails in place — policy, workflow review, vendor evaluation, training — that's exactly what we do.",
    ctaText: "AI Risk & Guardrails",
    ctaHref: "/ai-risk",
  },
  {
    type: "cta",
    content:
      "Related: the case study of what goes wrong without this framework — when a polished AI document beats an expert's veto in the conference room.",
    ctaText: "Read: Prompt Jockeys and the PCI Nightmare",
    ctaHref: "/blog/prompt-jockeys-and-the-pci-nightmare",
  },
  {
    type: "cta",
    content:
      "And the systemic version: what happens when AI gets rolled out across a whole company without strategy.",
    ctaText: "Read: AI Multiplies Talent. It Doesn't Replace It.",
    ctaHref: "/blog/ai-multiplies-talent-it-doesnt-replace-it",
  },
];

async function main() {
  const post = await db.cmsPost.upsert({
    where: { slug: "ai-got-good-the-framework" },
    update: {
      title: "AI Got Good. Now What? A Framework for Using It Without Getting Burned.",
      excerpt:
        "Most AI output is mediocre because the prompts didn't give the AI enough to work with. Five parts to build the prompt, five checks to evaluate the output. Daily-use version of the workshop framework I teach at PSU MacAdmins.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-06T11:00:00-04:00"),
    },
    create: {
      title: "AI Got Good. Now What? A Framework for Using It Without Getting Burned.",
      slug: "ai-got-good-the-framework",
      excerpt:
        "Most AI output is mediocre because the prompts didn't give the AI enough to work with. Five parts to build the prompt, five checks to evaluate the output. Daily-use version of the workshop framework I teach at PSU MacAdmins.",
      content: content as never,
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-06T11:00:00-04:00"),
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

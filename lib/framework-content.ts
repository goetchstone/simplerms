// lib/framework-content.ts
// Source data for the AI Prompt Framework + Definition of Done PDF.
// Same data structure pattern as checklist-content.ts so the PDF generator can
// stay tightly focused on layout. Keep content here; layout in server/pdf/framework.tsx.

export interface FrameworkLayer {
  number: number;
  title: string;
  prompt: string;
  example: string;
  blanks?: string[]; // Number of fill-in lines for this layer
}

export const FRAMEWORK_LAYERS: FrameworkLayer[] = [
  {
    number: 1,
    title: "Who's asking, and for whom?",
    prompt: "I am ___, and this output is for ___.",
    example:
      "I'm a Mac admin writing this for my director who needs to approve a new MDM budget.",
    blanks: ["I am:", "This output is for:"],
  },
  {
    number: 2,
    title: "Where will this be used?",
    prompt: "Format / context where the output will land.",
    example:
      "Email? SOP? Troubleshooting doc? Slack message? Meeting prep? The format changes everything.",
    blanks: ["Format / context:"],
  },
  {
    number: 3,
    title: "What's the actual job?",
    prompt: "The task — and what decision or action should follow.",
    example:
      "Not 'write me a thing.' What should someone DO after reading this?",
    blanks: ["The task:", "Decision / action that follows:"],
  },
  {
    number: 4,
    title: "Tone and stakes",
    prompt: "Tone of the output. Stakes of getting it wrong.",
    example:
      "'This is high-stakes — wrong info here could cost us our ability to process payments.' vs. 'Quick internal note, low stakes.'",
    blanks: ["Tone:", "Stakes:"],
  },
  {
    number: 5,
    title: "Real data it must use (THE CRITICAL LAYER)",
    prompt:
      "Facts, numbers, constraints, names the AI must work from. If you don't give it real data, it WILL invent it.",
    example:
      "Names of tools you actually use. Numbers from your business. Constraints that distinguish your situation from generic.",
    blanks: ["", "", "", ""],
  },
  {
    number: 6,
    title: "Format and structure",
    prompt: "Output should be structured as ___.",
    example:
      "Bullet points? Numbered steps? Executive summary + detail? Table? Specific sections?",
    blanks: ["Output structure:"],
  },
  {
    number: 7,
    title: "What to do if info is missing",
    prompt:
      "If you don't have this information, say so. Do not invent it.",
    example:
      "List specific things NOT to fabricate (customer counts, dollar amounts, regulatory citations, etc.).",
    blanks: ["Don't fabricate:", ""],
  },
  {
    number: 8,
    title: "Definition of done",
    prompt: "This output is finished when ___.",
    example: "If you can't describe 'finished,' neither can the model.",
    blanks: ["Finished when:"],
  },
  {
    number: 9,
    title: "How to iterate",
    prompt:
      "After the first output, ask: What's wrong? What's missing? What could fail?",
    example:
      "Tighten in 1-2 follow-ups. Build on context — don't start over.",
    blanks: [],
  },
];

export const FAST_QUESTIONS: { number: number; question: string }[] = [
  { number: 1, question: "Who's this for?" },
  { number: 2, question: "What's the job?" },
  { number: 3, question: "What data must it use?" },
];

export interface StakesRow {
  level: string;
  approach: string;
  examples: string;
}

export const STAKES_MATRIX: StakesRow[] = [
  {
    level: "Low",
    approach: "Just ask",
    examples: "Password training, internal FAQ, meeting summary",
  },
  {
    level: "Medium",
    approach: "Use the framework",
    examples: "SOPs, client emails, troubleshooting docs",
  },
  {
    level: "High",
    approach: "Full context + SME review",
    examples: "Compliance plans, deployment configs, security policies",
  },
];

export interface ChecklistSection {
  title: string;
  intro?: string;
  items: string[];
}

export const DEFINITION_OF_DONE: ChecklistSection[] = [
  {
    title: "Accuracy Check",
    items: [
      "Does this contain specific facts, names, dates, or numbers? Verify every one.",
      "Are there claims that sound authoritative but aren't sourced? (e.g., \"widely used among premium retailers\")",
      "Does the output reference tools, policies, or processes that actually exist in your environment?",
      "If it describes a workflow, does every step actually work in sequence? Walk through it.",
    ],
  },
  {
    title: "Contradiction Check",
    items: [
      "Read it twice. Does any section contradict another section?",
      "Does the recommendation actually achieve the stated goal, or does it undermine it?",
      "If there are compliance or security claims, do the described actions match the requirements?",
    ],
  },
  {
    title: "AI Slop Check",
    items: [
      "Does it contain vague, confident-sounding language with no substance? (\"leveraging best practices,\" \"industry-standard approach\")",
      "Are there statements that could apply to literally any company or situation?",
      "Does it reference departments, roles, or resources that don't exist in your organization?",
      "Are there unnecessary emojis, excessive comments, or formatting that screams \"AI generated\"?",
    ],
  },
  {
    title: "The Hard Questions",
    items: [
      "Ask the AI: \"What's wrong with this output?\"",
      "Ask the AI: \"What's missing?\"",
      "Ask the AI: \"What could fail if we implemented this?\"",
      "Ask the AI: \"Steelman the strongest objection to this.\"",
    ],
  },
  {
    title: "The Gut Check",
    items: [
      "Would you stake your name on this output in a meeting?",
      "If a compliance officer / security auditor / your manager read this, would it hold up?",
      "Did you actually READ it, or did it just look finished?",
    ],
  },
];

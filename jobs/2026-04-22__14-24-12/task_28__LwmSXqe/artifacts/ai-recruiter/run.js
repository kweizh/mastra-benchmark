import { Agent } from '@mastra/core/agent';
import { Mastra } from '@mastra/core/mastra';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { InMemoryStore } from '@mastra/core/storage';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Agent ────────────────────────────────────────────────────────────────────

const recruiterAgent = new Agent({
  id: 'recruiter-agent',
  name: 'Recruiter Agent',
  instructions: 'You are an expert recruiter.',
  model: 'openai/gpt-4o-mini',
});

// ─── Steps ────────────────────────────────────────────────────────────────────

/**
 * Step 1 – Parse resume text and extract candidate profile
 */
const gatherCandidateInfo = createStep({
  id: 'gatherCandidateInfo',
  description: 'Parse resume text and extract candidate profile',
  inputSchema: z.object({
    resumeText: z.string(),
  }),
  outputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent('recruiter-agent');

    const prompt = `
You are parsing a candidate resume. Extract the following information and return ONLY a valid JSON object with no markdown, no code blocks, just raw JSON.

Resume:
${inputData.resumeText}

Return exactly this JSON structure:
{
  "candidateName": "<full name>",
  "isTechnical": <true if the role is engineering/software/technical, false otherwise>,
  "specialty": "<their main specialty or area of expertise>"
}
`.trim();

    const response = await agent.generate(prompt);
    const text = response.text.trim();

    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      candidateName: String(parsed.candidateName),
      isTechnical: Boolean(parsed.isTechnical),
      specialty: String(parsed.specialty),
    };
  },
});

/**
 * Step 2a – Technical branch: ask a question about their specialty
 */
const askAboutSpecialty = createStep({
  id: 'askAboutSpecialty',
  description: 'Generate a technical interview question based on specialty',
  inputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
  }),
  outputSchema: z.object({
    question: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent('recruiter-agent');

    const prompt = `
You are interviewing ${inputData.candidateName}, a technical candidate whose specialty is ${inputData.specialty}.
Generate one thoughtful, specific technical interview question about their specialty.
Return ONLY the question text, with no preamble.
`.trim();

    const response = await agent.generate(prompt);
    return { question: response.text.trim() };
  },
});

/**
 * Step 2b – Non-technical branch: ask what interests them in the role
 */
const askAboutRole = createStep({
  id: 'askAboutRole',
  description: 'Generate a role-interest question for a non-technical candidate',
  inputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
  }),
  outputSchema: z.object({
    question: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const agent = mastra.getAgent('recruiter-agent');

    const prompt = `
You are interviewing ${inputData.candidateName}, a non-technical candidate with expertise in ${inputData.specialty}.
Generate one engaging interview question asking what specifically interests them in this role.
Return ONLY the question text, with no preamble.
`.trim();

    const response = await agent.generate(prompt);
    return { question: response.text.trim() };
  },
});

// ─── Workflow ──────────────────────────────────────────────────────────────────

const recruiterWorkflow = createWorkflow({
  id: 'recruiter-workflow',
  inputSchema: z.object({
    resumeText: z.string(),
  }),
  outputSchema: z.object({
    candidateName: z.string().optional(),
    isTechnical: z.boolean().optional(),
    specialty: z.string().optional(),
    question: z.string().optional(),
  }),
  steps: [gatherCandidateInfo, askAboutSpecialty, askAboutRole],
});

recruiterWorkflow
  .then(gatherCandidateInfo)
  .branch([
    [
      async ({ inputData }) => inputData.isTechnical === true,
      askAboutSpecialty,
    ],
    [
      async ({ inputData }) => inputData.isTechnical === false,
      askAboutRole,
    ],
  ])
  .commit();

// ─── Mastra instance ──────────────────────────────────────────────────────────

const mastra = new Mastra({
  agents: {
    'recruiter-agent': recruiterAgent,
  },
  workflows: {
    'recruiter-workflow': recruiterWorkflow,
  },
  storage: new InMemoryStore(),
});

// ─── Execution ────────────────────────────────────────────────────────────────

async function runForCandidate(resumeText) {
  const workflow = mastra.getWorkflow('recruiter-workflow');
  const run = await workflow.createRun();
  const result = await run.start({ inputData: { resumeText } });
  return result;
}

async function main() {
  const candidates = [
    'Alice is a Software Engineer with 10 years of experience in React and Node.js.',
    'Bob is a Marketing Manager with 5 years of experience in SEO and content strategy.',
  ];

  const results = [];

  for (const resumeText of candidates) {
    console.log(`\nProcessing: "${resumeText}"`);
    try {
      const result = await runForCandidate(resumeText);
      console.log('Result:', JSON.stringify(result, null, 2));
      results.push(result);
    } catch (err) {
      console.error('Error processing candidate:', err);
      throw err;
    }
  }

  const outputPath = path.join(__dirname, 'output.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

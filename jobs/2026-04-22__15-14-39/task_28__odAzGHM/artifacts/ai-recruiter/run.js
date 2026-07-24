const { Agent } = require('@mastra/core/agent');
const { createStep, createWorkflow } = require('@mastra/core/workflows');
const { z } = require('zod');
const fs = require('fs/promises');

const recruiterAgent = new Agent({
  id: 'recruiter-agent',
  name: 'Recruiter Agent',
  instructions: 'You are an expert recruiter.',
  model: 'openai/gpt-4o-mini'
});

const candidateInfoSchema = z.object({
  candidateName: z.string(),
  isTechnical: z.boolean(),
  specialty: z.string()
});

const gatherCandidateInfo = createStep({
  id: 'gather-candidate-info',
  inputSchema: z.object({
    resumeText: z.string()
  }),
  outputSchema: candidateInfoSchema,
  execute: async ({ inputData }) => {
    const result = await recruiterAgent.generate(
      `Extract the candidate name, determine whether they are in a technical role, and summarize their specialty.\n\nResume: ${inputData.resumeText}`,
      {
        structuredOutput: {
          schema: candidateInfoSchema
        }
      }
    );

    if (!result.object) {
      throw new Error('Failed to parse candidate info.');
    }

    return result.object;
  }
});

const questionSchema = z.object({
  question: z.string()
});

const askAboutSpecialty = createStep({
  id: 'ask-about-specialty',
  inputSchema: candidateInfoSchema,
  outputSchema: questionSchema,
  execute: async ({ inputData }) => {
    const result = await recruiterAgent.generate(
      `Write one concise technical interview question for ${inputData.candidateName} about their specialty in ${inputData.specialty}.`,
      {
        structuredOutput: {
          schema: questionSchema
        }
      }
    );

    if (!result.object) {
      throw new Error('Failed to generate specialty question.');
    }

    return result.object;
  }
});

const askAboutRole = createStep({
  id: 'ask-about-role',
  inputSchema: candidateInfoSchema,
  outputSchema: questionSchema,
  execute: async ({ inputData }) => {
    const result = await recruiterAgent.generate(
      `Write one concise interview question for ${inputData.candidateName} about what interests them in the role and their specialty in ${inputData.specialty}.`,
      {
        structuredOutput: {
          schema: questionSchema
        }
      }
    );

    if (!result.object) {
      throw new Error('Failed to generate role question.');
    }

    return result.object;
  }
});

const recruiterWorkflow = createWorkflow({
  id: 'ai-recruiter-workflow',
  inputSchema: z.object({
    resumeText: z.string()
  }),
  outputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
    question: z.string()
  })
})
  .then(gatherCandidateInfo)
  .branch([
    [async ({ inputData }) => inputData.isTechnical, askAboutSpecialty],
    [async ({ inputData }) => !inputData.isTechnical, askAboutRole]
  ])
  .map({
    candidateName: { step: gatherCandidateInfo, path: 'candidateName' },
    isTechnical: { step: gatherCandidateInfo, path: 'isTechnical' },
    specialty: { step: gatherCandidateInfo, path: 'specialty' },
    question: { step: [askAboutSpecialty, askAboutRole], path: 'question' }
  })
  .commit();

async function run() {
  const resumes = [
    'Alice is a Software Engineer with 10 years of experience in React and Node.js.',
    'Bob is a Marketing Manager with 5 years of experience in SEO and content strategy.'
  ];

  const results = [];

  for (const resumeText of resumes) {
    const runInstance = await recruiterWorkflow.createRun();
    const runResult = await runInstance.start({ inputData: { resumeText } });

    if (runResult.status !== 'success') {
      throw new Error(`Workflow failed with status: ${runResult.status}`);
    }

    results.push(runResult.result);
  }

  await fs.writeFile(
    '/home/user/ai-recruiter/output.json',
    JSON.stringify(results, null, 2)
  );
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

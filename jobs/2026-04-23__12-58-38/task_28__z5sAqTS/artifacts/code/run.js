const { Mastra } = require('@mastra/core');
const { Agent } = require('@mastra/core/agent');
const { createStep, createWorkflow } = require('@mastra/core/workflows');
const { z } = require('zod');

// Helper function to extract JSON from markdown response
function extractJSON(text) {
  // Try to find JSON in markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[1] || jsonMatch[0];
  }
  return text;
}

// Initialize Mastra
const mastra = new Mastra();

// Create the recruiter agent
const recruiterAgent = new Agent({
  id: 'recruiter',
  name: 'Recruiter',
  instructions: 'You are an expert recruiter.',
  model: 'openai/gpt-4o-mini',
});

// Step 1: Gather candidate information
const gatherCandidateInfo = createStep({
  id: 'gather-candidate-info',
  description: 'Parse resume text and extract candidate information',
  inputSchema: z.object({
    resumeText: z.string(),
  }),
  outputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { resumeText } = inputData;

    const response = await recruiterAgent.generate(
      `Analyze the following resume text and extract the candidate's name, determine if they are technical (software engineer, developer, data scientist, etc.) or non-technical (marketing, sales, HR, etc.), and identify their specialty. Return the answer in the following JSON format: {"candidateName": "string", "isTechnical": boolean, "specialty": "string"}

Resume text: ${resumeText}`
    );

    const jsonText = extractJSON(response.text);
    const parsed = JSON.parse(jsonText);
    return {
      candidateName: parsed.candidateName,
      isTechnical: parsed.isTechnical,
      specialty: parsed.specialty,
    };
  },
});

// Step 2a: Ask about specialty (for technical candidates)
const askAboutSpecialty = createStep({
  id: 'ask-about-specialty',
  description: 'Generate a question about the candidate\'s technical specialty',
  inputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
  }),
  outputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
    question: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { candidateName, specialty } = inputData;

    const response = await recruiterAgent.generate(
      `Generate a specific interview question about ${candidateName}'s expertise in ${specialty}. The question should be technical and relevant to their specialty. Return just the question text, no additional formatting.`
    );

    return {
      ...inputData,
      question: response.text.trim(),
    };
  },
});

// Step 2b: Ask about role (for non-technical candidates)
const askAboutRole = createStep({
  id: 'ask-about-role',
  description: 'Generate a question about what interests them in the role',
  inputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
  }),
  outputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
    question: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { candidateName, specialty } = inputData;

    const response = await recruiterAgent.generate(
      `Generate a specific interview question about what interests ${candidateName} in this role, considering their background in ${specialty}. Return just the question text, no additional formatting.`
    );

    return {
      ...inputData,
      question: response.text.trim(),
    };
  },
});

// Create the workflow
const aiRecruiterWorkflow = createWorkflow({
  id: 'ai-recruiter-workflow',
  description: 'AI recruiter workflow that parses resumes and generates interview questions',
  inputSchema: z.object({
    resumeText: z.string(),
  }),
  outputSchema: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
    question: z.string(),
  }),
});

// Build and commit the workflow
const workflow = aiRecruiterWorkflow
  .then(gatherCandidateInfo)
  .branch([
    [
      (params) => params.inputData.isTechnical === true,
      askAboutSpecialty,
    ],
    [
      (params) => params.inputData.isTechnical === false,
      askAboutRole,
    ],
  ])
  .commit();

// Main execution function
async function main() {
  // Candidate 1: Technical
  const candidate1Input = {
    resumeText: 'Alice is a Software Engineer with 10 years of experience in React and Node.js.',
  };

  // Candidate 2: Non-technical
  const candidate2Input = {
    resumeText: 'Bob is a Marketing Manager with 5 years of experience in SEO and content strategy.',
  };

  console.log('Processing candidate 1: Alice');
  const run1 = await workflow.createRun();
  const result1 = await run1.start({ inputData: candidate1Input });
  console.log('Result 1:', result1);

  console.log('\nProcessing candidate 2: Bob');
  const run2 = await workflow.createRun();
  const result2 = await run2.start({ inputData: candidate2Input });
  console.log('Result 2:', result2);

  // Save results to JSON file
  const output = [result1, result2];
  const fs = require('fs');
  fs.writeFileSync('/home/user/ai-recruiter/output.json', JSON.stringify(output, null, 2));
  console.log('\nResults saved to output.json');
}

// Run the main function
main().catch(console.error);
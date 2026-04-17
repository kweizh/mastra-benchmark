# Mastra AI Recruiter Workflow

## Background
You need to build an AI recruiter workflow using Mastra. The workflow will parse a candidate's resume, determine if they are technical or non-technical, and generate a specific interview question based on their profile.

## Requirements
- Initialize a Node.js project at `/home/user/ai-recruiter`.
- Install `@mastra/core` and `zod`.
- Write a script `run.js` (or `run.ts` if you prefer, but ensure it can be run with `node` or `tsx`).
- Create a Mastra Agent using the `openai/gpt-4o-mini` model with the instruction "You are an expert recruiter.".
- Create a `gatherCandidateInfo` step that uses the Agent to parse `resumeText` and outputs `candidateName` (string), `isTechnical` (boolean), and `specialty` (string).
- Create an `askAboutSpecialty` step that takes the output of the first step and generates a question about their specialty.
- Create an `askAboutRole` step that takes the output of the first step and generates a question about what interests them in the role.
- Create a Workflow that takes `{ resumeText: z.string() }` as input.
- The workflow should start with `gatherCandidateInfo`, then use `.branch()` to conditionally route to `askAboutSpecialty` if `isTechnical` is true, or `askAboutRole` if `isTechnical` is false.
- Execute the workflow for two candidates:
  1. "Alice is a Software Engineer with 10 years of experience in React and Node.js."
  2. "Bob is a Marketing Manager with 5 years of experience in SEO and content strategy."
- Save the final workflow output (the `.result` object from both runs) as a JSON array to `/home/user/ai-recruiter/output.json`.

## Constraints
- Project path: `/home/user/ai-recruiter`
- Output file: `/home/user/ai-recruiter/output.json`
- Use `openai/gpt-4o-mini` for the agent model.
- Ensure `OPENAI_API_KEY` is available in the environment.

## Integrations
- OpenAI
# Mastra Calculator Agent

## Background
Mastra provides a unified ecosystem for building AI agents with tools. In this task, you will create a simple Calculator Tool and attach it to an agent.

## Requirements
- Initialize a Node.js project in `/home/user/calculator-agent`.
- Install `@mastra/core`, `zod`, and `tsx`.
- Create a file `index.ts` that defines a `calculatorTool` using `createTool` from `@mastra/core`.
- The tool should take an `inputSchema` with `a` (number), `b` (number), and `operation` (string: 'add', 'subtract', 'multiply', 'divide').
- The `execute` function should perform the calculation and return `{ result: number }`.
- Create an `Agent` using `@mastra/core/agent` with the `calculatorTool`.
- Use the model `openai/gpt-4o-mini` (or similar) and instruct it to use the calculator tool to answer math questions.
- The script should ask the agent "What is 15 multiplied by 7?" using `await agent.generate(...)`.
- Write the resulting text output to `/home/user/calculator-agent/output.log`.

## Constraints
- Project path: `/home/user/calculator-agent`
- Log file: `/home/user/calculator-agent/output.log`
- You must use `createTool` and `Agent` from Mastra.
- Set the `OPENAI_API_KEY` environment variable for the agent to work.
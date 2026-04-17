# Mastra Research Report for Evaluation Dataset
### 1. Library Overview
*   **Description**: Mastra is a high-performance TypeScript AI agent framework designed to bridge the gap between Python-heavy AI tooling and the modern web stack. It provides a unified ecosystem for building, deploying, and scaling AI-powered applications, featuring built-in support for agents, structured workflows, RAG, and observability.
*   **Ecosystem Role**: It acts as an orchestration layer on top of LLM providers (via Vercel AI SDK) and integrates deeply with TypeScript frameworks like Next.js, Hono, and Express. It competes with LangChain.js and CrewAI by offering a more "TypeScript-native" experience with strong type safety and a built-in development Studio.
*   **Project Setup**:
    1.  **CLI**: `npx create-mastra@latest` (interactive setup).
    2.  **Manual**:
        *   Install dependencies: `npm install @mastra/core @mastra/memory @mastra/rag zod`.
        *   Initialize: `npx mastra init`.
        *   Configure `package.json` with scripts: `"dev": "mastra dev"`, `"build": "mastra build"`.
        *   Set environment variables in `.env` (e.g., `OPENAI_API_KEY`).
### 2. Core Primitives & APIs
*   **Mastra Instance**: The central registry for agents, workflows, and storage.
    ```typescript
    import { Mastra } from '@mastra/core';
    import { Agent } from '@mastra/core/agent';
    export const mastra = new Mastra({
      agents: { myAgent: new Agent({ id: 'my-agent', model: 'openai/gpt-4o', instructions: '...' }) },
    });
    ```
*   **Agents**: Autonomous entities that use models and tools.
    *   [Agent Reference](https://mastra.ai/reference/agents/agent)
    ```typescript
    const agent = new Agent({
      id: 'chef-agent',
      model: 'anthropic/claude-3-5-sonnet-20240620',
      instructions: 'You are a professional chef.',
      tools: { weatherTool },
      memory: new Memory({ options: { lastMessages: 10 } })
    });
    const result = await agent.generate('What should I cook in sunny weather?');
    ```
*   **Workflows**: Structured, multi-step execution graphs with control flow.
    *   [Workflows Overview](https://mastra.ai/docs/workflows/overview)
    ```typescript
    const step1 = createStep({ id: 'fetch', execute: async ({ inputData }) => ({ data: '...' }) });
    const myWorkflow = createWorkflow({ id: 'my-flow' })
      .then(step1)
      .commit();
    const run = await myWorkflow.createRun();
    const result = await run.start({ inputData: { ... } });
    ```
*   **Tools**: Reusable functions that agents can call.
    *   [Tools Guide](https://mastra.ai/docs/agents/using-tools)
    ```typescript
    export const myTool = createTool({
      id: 'get-data',
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ inputData }) => ({ result: 'data' }),
    });
    ```
*   **Memory & Storage**: Persistent conversation state.
    *   [Memory Overview](https://mastra.ai/docs/memory/overview)
    ```typescript
    const storage = new LibSQLStore({ url: 'file:mastra.db' });
    const memory = new Memory({ options: { observationalMemory: true } });
    ```
### 3. Real-World Use Cases & Templates
*   **AI Recruiter Workflow**: A multi-step workflow that parses resumes, screens candidates via LLM, and schedules interviews. [Guide](https://mastra.ai/guides/guide/ai-recruiter)
*   **Chef Michel & Stock Agent**: Practical examples of agents using specialized instructions and real-time data tools. [Chef Guide](https://mastra.ai/guides/guide/chef-michel)
*   **Research Assistant (RAG)**: Implementation of a document indexing and retrieval pipeline using vector stores. [RAG Guide](https://mastra.ai/guides/guide/research-assistant)
*   **Mastra App Template**: A full-stack starter kit using Next.js and Assistant UI for building agentic interfaces. [Template](https://mastra.ai/templates)
### 4. Developer Friction Points
*   **Dependency Resolution (LibSQL)**: Common failures when initializing Mastra in Next.js projects due to native dependency resolution in `create-next-app` environments. [Issue #9289](https://github.com/mastra-ai/mastra/issues/9281)
*   **Inngest Integration**: Complexities in persisting `runtimeContext` between workflow steps when deployed on Inngest runners. [Issue #6371](https://github.com/mastra-ai/mastra/issues/6371)
*   **Monorepo Configuration**: `mastra dev` often struggles with dependency resolution and file watching in Yarn/PNPM monorepos without specific `tsconfig` adjustments. [Issue #1996](https://github.com/mastra-ai/mastra/issues/1996)
### 5. Evaluation Ideas
*   **Simple**: Create a "Calculator Tool" and attach it to an agent to solve multi-step math problems.
*   **Simple**: Set up a basic Mastra instance with a single agent and a LibSQL storage provider.
*   **Medium**: Build a RAG pipeline that chunks a provided markdown file and answers questions based on it.*   **Medium**: Implement a workflow with a conditional branch (`.branch()`) based on the output of an LLM step.
*   **Complex**: Create a "Human-in-the-loop" workflow that suspends execution and waits for an external approval signal.
*   **Complex**: Configure a Supervisor agent to coordinate two sub-agents (e.g., a "Coder" and a "Reviewer") with shared memory.
*   **Complex**: Set up a custom MCP server that allows a Mastra agent to read and write to the local filesystem securely.
### 6. Sources
1. [Mastra Root llms.txt](https://mastra.ai/llms.txt) - Central documentation index.
2. [Manual Install Guide](https://mastra.ai/docs/getting-started/manual-install) - Detailed setup and configuration instructions.
3. [Workflows Overview](https://mastra.ai/docs/workflows/overview) - Core concepts for structured task execution.
4. [Memory Overview](https://mastra.ai/docs/memory/overview) - Details on persistence and observational memory.
5. [RAG Overview](https://mastra.ai/docs/rag/overview) - Implementation details for retrieval-augmented generation.
6. [Mastra GitHub Issues](https://github.com/mastra-ai/mastra/issues) - Source for developer friction points and bugs.
7. [Mastra Blog/Changelog](https://mastra.ai/blog/changelog-2026-02-23) - Recent feature updates and performance fixes.
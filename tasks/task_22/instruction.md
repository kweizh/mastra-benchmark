# Setup Mastra with LibSQL Storage

## Background
Mastra is an AI agent framework. You need to initialize a basic Mastra instance equipped with an agent and configure it to use LibSQL for memory storage.

## Requirements
- Initialize a Node.js project in `/home/user/myproject`.
- Install `@mastra/core` and `@mastra/memory`.
- Create an `index.js` file that sets up a Mastra instance.
- The instance must include at least one agent (e.g., using `openai/gpt-4o` model).
- Configure the agent with a `Memory` instance that uses a `LibSQLStore` pointing to `file:mastra.db`.

## Implementation Guide
1. `cd /home/user/myproject` and run `npm init -y`.
2. Install the required dependencies: `npm install @mastra/core @mastra/memory`.
3. Create `index.js` with the Mastra setup, Agent creation, Memory, and LibSQLStore.
4. Ensure the script runs successfully with `node index.js` and creates the `mastra.db` file.

## Constraints
- Project path: /home/user/myproject
- The database file must be created at `/home/user/myproject/mastra.db`.

## Integrations
- None
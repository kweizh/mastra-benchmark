# Mastra Supervisor Agent Configuration - Project Summary

## Overview
This project demonstrates how to configure a Supervisor agent in Mastra that coordinates two sub-agents (Coder and Reviewer) using shared memory.

## Project Structure
```
/home/user/project/
├── src/
│   ├── index.ts          # Main configuration file with Mastra instance and three agents
│   └── run.ts            # Script to run the supervisor agent
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── README.md             # Project documentation
├── .env.example          # Environment variables template
└── output.txt            # Generated output (created after running)
```

## Components Created

### 1. Package Configuration (`package.json`)
- Initialized Node.js project
- Installed dependencies: `@mastra/core`, `@mastra/memory`, `zod`
- Added dev dependencies: `typescript`, `tsx`, `@types/node`
- Added `npm start` script to run the application

### 2. TypeScript Configuration (`tsconfig.json`)
- Configured for ES modules (`"type": "module"`)
- Set root directory to `./src`
- Set output directory to `./dist`

### 3. Main Configuration (`src/index.ts`)
Exports three agents with the following configuration:

#### Coder Agent
- **Name**: coder
- **Instructions**: Expert TypeScript developer focused on best practices, type safety, and maintainability
- **Model**: `openai/gpt-4o-mini`
- **Memory**: Shared with other agents

#### Reviewer Agent
- **Name**: reviewer
- **Instructions**: Code reviewer specializing in security vulnerabilities, performance issues, and best practices
- **Model**: `openai/gpt-4o-mini`
- **Memory**: Shared with other agents

#### Supervisor Agent
- **Name**: supervisor
- **Instructions**: Orchestrates the workflow between coder and reviewer to complete user requests
- **Model**: `openai/gpt-4o-mini`
- **Memory**: Shared with other agents

### 4. Run Script (`src/run.ts`)
- Initializes the Mastra system
- Retrieves the supervisor agent
- Sends a request: "Write a simple Express server and review it"
- Writes the final output to `/home/user/project/output.txt`

### 5. Documentation
- **README.md**: Comprehensive documentation of the project
- **.env.example**: Template for environment variables

## Architecture

```
User Request
    ↓
Supervisor Agent (coordinates workflow)
    ↓
    ├─→ Coder Agent (writes code)
    └─→ Reviewer Agent (reviews code)
    ↓
Final Response (written to output.txt)
```

All agents share the same `Memory` instance for context retention.

## How to Run

1. Set the OpenAI API key:
```bash
export OPENAI_API_KEY=your-api-key-here
```

2. Run the application:
```bash
cd /home/user/project
npm start
```

Or directly:
```bash
npx tsx src/run.ts
```

3. Check the output:
```bash
cat /home/user/project/output.txt
```

## Key Features

1. **Shared Memory**: All three agents share the same Memory instance, allowing them to maintain conversational context
2. **Agent Coordination**: The supervisor agent orchestrates the workflow between the coder and reviewer
3. **TypeScript Configuration**: Fully configured TypeScript project with proper type definitions
4. **Modular Design**: Each agent has clearly defined responsibilities and instructions
5. **Extensible**: Easy to add more agents or modify existing ones

## Files Preserved

All project files have been copied to `/logs/artifacts/code/` for preservation and inspection.
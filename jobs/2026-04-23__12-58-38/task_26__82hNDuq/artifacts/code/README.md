# Mastra Supervisor Agent Configuration

This project demonstrates how to configure a Supervisor agent in Mastra that coordinates two sub-agents (Coder and Reviewer) using shared memory.

## Project Structure

```
/home/user/project/
├── src/
│   ├── index.ts    # Exports Mastra instance with three agents
│   └── run.ts      # Script to run the supervisor agent
├── package.json
├── tsconfig.json
└── output.txt      # Generated output from the supervisor agent
```

## Agents

### 1. Coder Agent
- **Role**: Writes TypeScript code
- **Instructions**: Expert TypeScript developer focused on best practices, type safety, and maintainability
- **Model**: `openai/gpt-4o-mini`

### 2. Reviewer Agent
- **Role**: Reviews TypeScript code for security and performance
- **Instructions**: Code reviewer specializing in security vulnerabilities, performance issues, and best practices
- **Model**: `openai/gpt-4o-mini`

### 3. Supervisor Agent
- **Role**: Coordinates the Coder and Reviewer agents
- **Instructions**: Orchestrates the workflow between coder and reviewer to complete user requests
- **Model**: `openai/gpt-4o-mini`

## Shared Memory

All three agents share the same `Memory` instance, allowing them to maintain conversational context and coordinate effectively.

## Setup

1. Install dependencies:
```bash
cd /home/user/project
npm install
```

2. Set up the OpenAI API key:
```bash
export OPENAI_API_KEY=your-api-key-here
```

## Running the Project

Run the script using tsx:
```bash
npm start
```

Or directly:
```bash
npx tsx src/run.ts
```

## Output

The supervisor's response will be written to `/home/user/project/output.txt`.

## Example Request

The default request sent to the supervisor is:
```
"Write a simple Express server and review it"
```

The supervisor will:
1. Instruct the coder to write an Express server
2. Instruct the reviewer to review the code
3. Synthesize the results and provide a final response

## Architecture

```
User Request
    ↓
Supervisor Agent
    ↓
    ├─→ Coder Agent (writes code)
    └─→ Reviewer Agent (reviews code)
    ↓
Final Response
```

All agents share the same Memory instance for context retention.
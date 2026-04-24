# Mastra MCP Filesystem Integration

This project demonstrates how to integrate Mastra with the Model Context Protocol (MCP) filesystem server to create an AI agent that can interact with the local filesystem.

## Project Structure

```
/home/user/app/
├── package.json          # Node.js dependencies
├── output.log            # Script execution output
└── src/
    ├── mcp.ts           # MCP client configuration
    ├── agent.ts         # Mastra agent with MCP tools
    └── run.ts           # Execution script

/home/user/data/
└── hello.txt            # Created file with content "Hello from Mastra MCP"
```

## Implementation Details

### 1. Dependencies Installed
- `@mastra/core` - Core Mastra framework
- `@mastra/mcp` - MCP client integration
- `@ai-sdk/openai` - OpenAI AI SDK provider
- `tsx` - TypeScript execution runtime

### 2. MCP Configuration (`src/mcp.ts`)
Configured MCPClient to connect to the filesystem server using stdio transport:
```typescript
export const mcp = new MCPClient({
  servers: {
    filesystem: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user/data'],
    },
  },
});
```

### 3. Agent Setup (`src/agent.ts`)
Created a Mastra Agent with:
- OpenAI GPT-4o-mini model
- Filesystem tools from MCP client
- Instructions for file manipulation

### 4. Execution Script (`src/run.ts`)
Script that prompts the agent to create a file with specific content.

## Results

The agent successfully created `/home/user/data/hello.txt` with the content:
```
Hello from Mastra MCP
```

## Artifacts

All files from this implementation have been preserved in `/logs/artifacts/`:
- `/logs/artifacts/code/` - Source files and package.json
- `/logs/artifacts/data/` - Created data file
- `/logs/artifacts/logs/` - Execution output log

## Usage

To run the project:
```bash
cd /home/user/app
npx tsx src/run.ts
```

The agent will use the MCP filesystem tools to interact with files in `/home/user/data/`.
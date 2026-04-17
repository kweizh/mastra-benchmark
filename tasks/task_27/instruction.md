# Custom MCP Server for Local Filesystem with Mastra

## Background
Mastra supports connecting AI agents to external tools via the Model Context Protocol (MCP). You can use `MCPClient` from `@mastra/mcp` to connect to any MCP server and expose its tools to a Mastra `Agent`.

## Requirements
- You have an empty Node.js project in `/home/user/app` and an empty data directory at `/home/user/data`.
- Configure an `MCPClient` to use the `@modelcontextprotocol/server-filesystem` npx package, allowing access to the `/home/user/data` directory.
- Create a Mastra `Agent` that uses the filesystem tools provided by the MCP client.
- Write an execution script `src/run.ts` that prompts the agent to create a file `hello.txt` containing "Hello from Mastra MCP" in the `/home/user/data` directory.

## Implementation Guide
1. In `/home/user/app`, install `@mastra/core`, `@mastra/mcp`, `@ai-sdk/openai`, and `tsx`.
2. Create `src/mcp.ts` with the `MCPClient` configured for the `filesystem` server using `npx -y @modelcontextprotocol/server-filesystem /home/user/data`.
3. Create `src/agent.ts` that exports a Mastra `Agent` configured with `openai("gpt-4o-mini")` and the tools from the MCP client (e.g., `tools: await mcp.getTools()`).
4. Create `src/run.ts` that imports the agent and calls `agent.generate("Write 'Hello from Mastra MCP' to /home/user/data/hello.txt")`.
5. Run the script and save the output to `/home/user/app/output.log`.

## Constraints
- Project path: `/home/user/app`
- Log file: `/home/user/app/output.log`
- Data directory: `/home/user/data`
- Use `OPENAI_API_KEY` from the environment.

## Integrations
- OpenAI
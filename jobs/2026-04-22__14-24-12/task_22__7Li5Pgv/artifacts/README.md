# Mastra + LibSQL Setup

## Project Location
`/home/user/myproject`

## What was set up

A Node.js project initialised with:
- `@mastra/core` — core Mastra framework (Mastra instance, Agent)
- `@mastra/memory` — Memory class for agent memory management
- `@mastra/libsql` — LibSQLStore for SQLite-backed persistent storage

## File Structure

```
/home/user/myproject/
├── index.js        # Main entry point
├── package.json    # Project manifest
├── mastra.db       # LibSQL/SQLite database (created on first run)
└── node_modules/
```

## How to run

```bash
cd /home/user/myproject
node index.js
```

## Key components in index.js

| Component      | Package            | Purpose                              |
|----------------|--------------------|--------------------------------------|
| `LibSQLStore`  | `@mastra/libsql`   | SQLite storage backend (`file:mastra.db`) |
| `Memory`       | `@mastra/memory`   | Agent memory wired to storage        |
| `Agent`        | `@mastra/core/agent` | AI agent using `openai/gpt-4o`      |
| `Mastra`       | `@mastra/core`     | Top-level orchestrator               |

## Output on successful run

```
Mastra instance initialised successfully.
Agent: Assistant
Storage URL: file:mastra.db
Database file will be created at: mastra.db (relative to CWD)
```

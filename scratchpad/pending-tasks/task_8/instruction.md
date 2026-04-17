# Custom Local Tool with Mastra

## Background
You need to create a custom tool using Mastra that reads a local JSON file containing employee data and an agent that uses this tool to answer questions about the employees.

## Requirements
- Initialize a Node.js project in `/home/user/mastra-app`.
- Install the necessary Mastra dependencies (`@mastra/core`, `zod`, `tsx`, `typescript`, `@types/node`).
- Create a file `/home/user/mastra-app/employees.json` with the following content:
  ```json
  [
    { "id": "1", "name": "Alice", "role": "Engineer" },
    { "id": "2", "name": "Bob", "role": "Designer" }
  ]
  ```
- Create a script `index.ts` that:
  1. Defines a Mastra tool (using `createTool` from `@mastra/core/tools` or similar) with id `get-employee-role`. Its `inputSchema` should accept a `name` string. The tool should read `employees.json` and return the role of the given employee name.
  2. Creates an `Agent` using the `openai/gpt-4o-mini` model. Provide it with the tool.
  3. Calls `agent.generate('What is the role of Bob?')` and writes the output text to `/home/user/mastra-app/output.txt`.
- Ensure `tsconfig.json` is configured if necessary, so that `npx tsx index.ts` runs successfully.

## Constraints
- Project path: /home/user/mastra-app
- Log file: /home/user/mastra-app/output.txt
- The output file must contain the role "Designer".
- Use `npx tsx index.ts` to execute the script.
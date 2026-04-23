# Mastra Multi-Model Agents

This project demonstrates how to use Mastra to create multiple agents using different LLM providers (OpenAI and Anthropic).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your API keys to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Running the Script

Run the script using tsx:
```bash
npx tsx index.ts
```

## What It Does

The script creates two Mastra agents:
1. **OpenAI Agent** - Uses `openai/gpt-4o` with instructions "You are an OpenAI assistant."
2. **Anthropic Agent** - Uses `anthropic/claude-3-5-sonnet-20240620` with instructions "You are an Anthropic assistant."

Both agents are prompted with "Say hello" and their responses are saved to `output.log`.

## Output

The script generates an `output.log` file containing:
- Timestamp
- OpenAI agent's response
- Anthropic agent's response

## Project Structure

```
mastra-multi-model/
├── index.ts          # Main script with Mastra configuration
├── .env.example      # Example environment variables
├── .env              # Your actual API keys (not in git)
├── package.json      # Project dependencies
└── output.log        # Generated output from agents
```

## Dependencies

- `@mastra/core` - Core Mastra framework
- `@mastra/memory` - Memory management for agents
- `zod` - Schema validation
- `dotenv` - Environment variable management
- `tsx` - TypeScript execution (dev dependency)
- `typescript` - TypeScript compiler (dev dependency)
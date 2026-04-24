# Multi-Model Mastra Agents

This project demonstrates how to create a Mastra instance with two agents using different LLM providers - OpenAI and Anthropic.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your API keys:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your actual API keys.

3. Run the script:
   ```bash
   npx tsx index.ts
   ```

## Output

The script will:
- Create two agents (openai-agent and anthropic-agent)
- Prompt each agent with "Say hello"
- Save the responses to `output.log`

## Agents

### OpenAI Agent
- Model: `gpt-4o`
- Instructions: "You are an OpenAI assistant."

### Anthropic Agent
- Model: `claude-3-5-sonnet-20240620`
- Instructions: "You are an Anthropic assistant."
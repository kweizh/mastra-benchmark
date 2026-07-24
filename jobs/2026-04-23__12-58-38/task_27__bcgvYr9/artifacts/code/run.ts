import { filesystemAgent } from './agent';

async function main() {
  try {
    const result = await filesystemAgent.generate(
      "Write 'Hello from Mastra MCP' to /home/user/data/hello.txt"
    );
    console.log('Agent response:', result.text);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
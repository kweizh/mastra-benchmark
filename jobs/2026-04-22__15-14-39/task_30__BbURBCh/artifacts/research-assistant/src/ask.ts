import fs from "node:fs/promises";
import { mastra } from "./mastra/index.js";

const question = "What are the main advantages of the Transformer architecture?";

const main = async () => {
  const agent = mastra.getAgent("researchAgent");
  const result = await agent.generate(question);

  await fs.writeFile("/home/user/answer.txt", result.text, "utf-8");
  console.log("Saved answer to /home/user/answer.txt");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

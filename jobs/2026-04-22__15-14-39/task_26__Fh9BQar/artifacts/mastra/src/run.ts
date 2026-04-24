import { writeFile } from "node:fs/promises";
import { mastra } from "./index.js";

const OUTPUT_PATH = "/home/user/project/output.txt";

const run = async () => {
  const supervisor = mastra.getAgent("supervisor");
  const result = await supervisor.generate(
    "Write a simple Express server and review it"
  );

  await writeFile(OUTPUT_PATH, result.text, "utf8");
};

run().catch((error) => {
  console.error("Supervisor run failed:", error);
  process.exitCode = 1;
});

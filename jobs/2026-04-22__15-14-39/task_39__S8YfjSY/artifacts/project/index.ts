import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { readFile, writeFile } from "fs/promises";

const attemptsPath = "/home/user/project/attempts.txt";

const unstableStep = createStep({
  id: "unstable-step",
  inputSchema: z.object({}),
  outputSchema: z.object({
    status: z.literal("success"),
  }),
  execute: async () => {
    let currentAttempts = 0;

    try {
      const raw = await readFile(attemptsPath, "utf8");
      const trimmed = raw.trim();
      if (trimmed.length > 0) {
        const parsed = Number.parseInt(trimmed, 10);
        if (!Number.isNaN(parsed)) {
          currentAttempts = parsed;
        }
      }
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== "ENOENT") {
        throw err;
      }
    }

    const nextAttempts = currentAttempts + 1;
    await writeFile(attemptsPath, `${nextAttempts}`, "utf8");

    if (nextAttempts < 3) {
      throw new Error(`Unstable step failed on attempt ${nextAttempts}`);
    }

    return { status: "success" };
  },
});

const retryWorkflow = createWorkflow({
  id: "retry-workflow",
  inputSchema: z.object({}),
  outputSchema: z.object({
    status: z.literal("success"),
  }),
  retryConfig: {
    attempts: 5,
    delay: 100,
  },
})
  .then(unstableStep)
  .commit();

const main = async () => {
  await writeFile(attemptsPath, "0", "utf8");

  const run = await retryWorkflow.createRun();
  const result = await run.start();

  await writeFile(
    "/home/user/project/result.json",
    JSON.stringify(result, null, 2),
    "utf8"
  );
};

void main();

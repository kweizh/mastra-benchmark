import { writeFile } from "node:fs/promises";
import { myWorkflow } from "./workflow";

const run = async () => {
  const workflowRun = myWorkflow.createRun();

  const highResult = await workflowRun.run({ inputData: { value: 15 } });
  const lowResult = await workflowRun.run({ inputData: { value: 5 } });

  const results = [highResult.output, lowResult.output];

  await writeFile(
    new URL("../output.json", import.meta.url),
    `${JSON.stringify(results, null, 2)}\n`,
    "utf-8",
  );
};

run();

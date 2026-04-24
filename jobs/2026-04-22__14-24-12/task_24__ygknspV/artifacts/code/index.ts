import { myWorkflow } from './workflow';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const results: { message: string }[] = [];

  // Run 1: value = 15 (high branch)
  const run1 = await myWorkflow.createRun();
  const result1 = await run1.start({ inputData: { value: 15 } });
  if (result1.status === 'success') {
    results.push({ message: result1.result.message });
  } else {
    throw new Error(`Run 1 failed with status: ${result1.status}`);
  }

  // Run 2: value = 5 (low branch)
  const run2 = await myWorkflow.createRun();
  const result2 = await run2.start({ inputData: { value: 5 } });
  if (result2.status === 'success') {
    results.push({ message: result2.result.message });
  } else {
    throw new Error(`Run 2 failed with status: ${result2.status}`);
  }

  const outputPath = path.join(__dirname, '..', 'output.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log('Results written to output.json:', results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

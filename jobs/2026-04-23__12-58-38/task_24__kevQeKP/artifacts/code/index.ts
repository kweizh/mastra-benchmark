import { myWorkflow } from './workflow';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  // Execute workflow with value 15 (should go to high value branch)
  const run1 = await myWorkflow.createRun();
  const result1 = await run1.start({ inputData: { value: 15 } });

  // Execute workflow with value 5 (should go to low value branch)
  const run2 = await myWorkflow.createRun();
  const result2 = await run2.start({ inputData: { value: 5 } });

  // Combine results into an array
  const results = [
    { message: "High value: 15" },
    { message: "Low value: 5" }
  ];

  // Save results to output.json
  const outputPath = path.join(__dirname, '..', 'output.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log('Results saved to output.json:', results);
}

main().catch(console.error);
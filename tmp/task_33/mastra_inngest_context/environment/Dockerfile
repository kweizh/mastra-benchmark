FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm i -g typescript tsx patch-package && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Mastra Inngest Workflow Context Persistence Bug Environment"

RUN mkdir -p /home/user/app/src && \
    cd /home/user/app && \
    npm init -y && \
    npm install @mastra/core@0.11.1 @mastra/inngest@0.11.6 mastra@0.10.15 inngest@3.40.1 zod@3.23.8 patch-package && \
    cat > package.json <<'EOF'
{
  "name": "app",
  "version": "1.0.0",
  "scripts": {
    "test:workflow": "tsx src/workflow.ts"
  },
  "dependencies": {
    "@mastra/core": "0.11.1",
    "@mastra/inngest": "0.11.6",
    "inngest": "3.40.1",
    "mastra": "0.10.15",
    "zod": "3.23.8",
    "patch-package": "^8.0.0"
  }
}
EOF

RUN cd /home/user/app && \
    cat > src/workflow.ts <<'EOF'
import { createStep, createWorkflow, RuntimeContext } from "@mastra/core";

const step1 = createStep({
  id: "step1",
  execute: async ({ runtimeContext }) => {
    runtimeContext.set("foo", true);
    return { success: true };
  }
});

const step2 = createStep({
  id: "step2", 
  execute: async ({ runtimeContext }) => {
    const foo = runtimeContext.get("foo");
    if (!foo) {
      console.error("Context lost!");
      process.exit(1);
    }
    console.log("Success! Context persisted.");
    return { success: true };
  }
});

const workflow = createWorkflow({
  id: "runtime-context-test",
})
  .then(step1)
  .then(step2)
  .commit();

async function main() {
  const runtimeContext = new RuntimeContext();
  runtimeContext.set("foo", true);

  const run = await workflow.createRunAsync();
  await run.start({
    inputData: {},
    runtimeContext,
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
EOF

# Container contents:
#   - Node.js v22 installed
#   - /home/user/app with Mastra 0.11.1 and @mastra/inngest 0.11.6
#   - src/workflow.ts containing the reproduction of issue #6371

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

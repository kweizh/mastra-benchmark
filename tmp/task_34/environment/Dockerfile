FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Mastra PNPM monorepo environment with an intentional tsconfig resolution issue."

RUN mkdir -p /home/user/monorepo/packages/mastra-setup && \
    cd /home/user/monorepo && \
    cat > pnpm-workspace.yaml <<'EOF'
packages:
  - 'packages/*'
EOF
RUN cd /home/user/monorepo && \
    cat > package.json <<'EOF'
{
  "name": "monorepo-root",
  "private": true,
  "engines": {
    "node": ">=20"
  }
}
EOF
RUN cd /home/user/monorepo/packages/mastra-setup && \
    cat > package.json <<'EOF'
{
  "name": "mastra-setup",
  "version": "1.0.0",
  "scripts": {
    "dev": "mastra dev"
  },
  "dependencies": {
    "@mastra/core": "latest",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF
RUN cd /home/user/monorepo/packages/mastra-setup && \
    cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "skipLibCheck": true
  }
}
EOF
RUN cd /home/user/monorepo/packages/mastra-setup && \
    mkdir -p src/mastra && \
    cat > src/mastra/index.ts <<'EOF'
import { Mastra } from '@mastra/core';

export const mastra = new Mastra({});
EOF

RUN cd /home/user/monorepo && pnpm install

# Container contents:
#   - Node.js v24 and pnpm installed
#   - /home/user/monorepo - PNPM workspace root
#   - /home/user/monorepo/packages/mastra-setup - Mastra package with bad tsconfig.json

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

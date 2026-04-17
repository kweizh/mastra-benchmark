FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Mastra workflow task environment with Node.js v24 installed."

RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm init -y && \
    npm install @mastra/core zod tsx typescript @types/node && \
    mkdir -p src

# Container contents:
#   - always required libs: curl ca-certificates git python3 python3-pip python3-pytest bash
#   - Node.js v24 for the Mastra task environment
#   - /home/user/project: initialized Node.js project with @mastra/core and zod installed

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

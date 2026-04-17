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
LABEL Description="Mastra RAG pipeline task environment with Node.js v24 and an initial data.md file."

RUN mkdir -p /home/user/mastra-rag && \
    cd /home/user/mastra-rag && \
    cat >data.md <<'EOF'
# Mastra AI Framework

Mastra is an AI framework that provides a unified ecosystem for building, deploying, and scaling AI-powered applications.
It features built-in support for agents, structured workflows, RAG, and observability.
EOF

# Container contents:
#   - always required libs: curl ca-certificates git python3 python3-pip python3-pytest bash
#   - Node.js v24 for the Mastra task environment
#   - /home/user/mastra-rag: base directory for the project
#   - /home/user/mastra-rag/data.md: initial markdown file to be embedded

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

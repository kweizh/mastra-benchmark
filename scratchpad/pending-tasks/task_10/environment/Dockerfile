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
LABEL Description="Mastra RAG pipeline task with Node.js v24 installed and an initial knowledge.md file."

RUN mkdir -p /home/user/mastra-rag && \
    cd /home/user/mastra-rag && \
    cat >knowledge.md <<'EOF'
# Mastra Knowledge Base

Mastra is a high-performance TypeScript AI agent framework.
The main advantage of Mastra is its deep integration with TypeScript frameworks like Next.js, providing strong type safety and a seamless developer experience.
EOF

# Container contents:
#   - Node.js v24 installed
#   - /home/user/mastra-rag  — Base directory for the Mastra project
#   - knowledge.md with required test data

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

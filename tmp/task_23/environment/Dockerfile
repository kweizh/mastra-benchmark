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
LABEL Description="Mastra RAG pipeline task environment"

RUN mkdir -p /home/user/myproject && \
    cd /home/user/myproject && \
    cat >data.md <<'EOF'
# The History of the Plumbus

A Plumbus is a common household device used for various everyday tasks.
It is manufactured by first taking the dinglebop, and then smoothing it with a bunch of shleem.
The shleem is then repurposed for later batches.
EOF

# Container contents:
#   - Node.js v24 installed
#   - /home/user/myproject - the project directory
#   - /home/user/myproject/data.md - the input markdown file

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

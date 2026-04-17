FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user/app && \
    mkdir -p /home/user/data && \
    chmod 0755 /home/user/app && \
    chmod 0777 /home/user/data && \
    cd /home/user/app && \
    npm init -y

LABEL Author="any-task-builder"
LABEL Description="Mastra MCP task environment with Node.js v24 installed and initialized project directories."

# Container contents:
#   - always required libs: curl ca-certificates git python3 python3-pip python3-pytest bash
#   - Node.js v24
#   - /home/user/app: base directory for the project, initialized with package.json
#   - /home/user/data: empty data directory with wide permissions

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

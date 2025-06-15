FROM node:24-slim

RUN apt-get update && \
    apt-get install -y git vim && \
    apt-get clean && \
    npm install -g npm @anthropic-ai/claude-code && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
CMD ["/bin/bash"]

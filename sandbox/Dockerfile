FROM docker.io/cloudflare/sandbox:0.6.0

# Expose port 3000 for internal Sandbox communication (required)
EXPOSE 3000

# Expose port 3001 for Express server
EXPOSE 3001

# Set up workspace
WORKDIR /workspace/app

# Copy application files
COPY app/package.json app/tsconfig.json ./
COPY app/src ./src
COPY app/public ./public

# Install dependencies and build
RUN npm install && \
    npm run build && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Reset working directory
WORKDIR /workspace

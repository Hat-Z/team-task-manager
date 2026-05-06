FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy backend source
COPY backend/src ./src

# Build backend
RUN npm run build

# Set working directory back to app root
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./frontend/
COPY frontend/tsconfig*.json ./frontend/
COPY frontend/vite.config.ts ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Copy frontend source
COPY frontend/src ./src
COPY frontend/index.html ./

# Build frontend
RUN npm run build

# Final stage - serve backend with static frontend
WORKDIR /app/backend

# Copy built frontend to backend public directory
RUN mkdir -p /app/backend/public && \
    cp -r /app/frontend/dist/* /app/backend/public/

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "const port = process.env.PORT || 5000; require('http').get('http://localhost:' + port + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend server
CMD ["npm", "start"]

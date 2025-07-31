# --- Base image ---
FROM node:22.17.1-alpine AS base
WORKDIR /app

# Copy package.json and package-lock.json from root and subfolders
COPY package.json ./
COPY backend/package.json ./backend/
COPY backend/package-lock.json ./backend/
COPY frontend/package.json ./frontend/
COPY frontend/package-lock.json ./frontend/

# Install dependencies from root package.json
RUN npm install \
    && npm install --prefix backend \
    && npm install --prefix frontend \
    && rm -f package-lock.json

# --- Build stage ---
FROM base AS build

# Copy full source code
COPY . ./

# Generate Prisma client
RUN npm run prisma:generate --prefix backend

# Build both backend and frontend using root scripts
RUN npm run build

# --- Production image ---
FROM node:22.17.1-alpine AS runner
WORKDIR /app

# Copy build output from build stage
COPY --from=build /app ./

# Expose ports for backend and frontend (adjust if needed)
EXPOSE 3000
EXPOSE 4000

# Start both backend and frontend concurrently using root script
CMD ["npm", "run", "start"]
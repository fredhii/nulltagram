# Build stage for React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/ntagram

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Firebase config build args (Vite uses VITE_ prefix)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Set env vars for build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Copy frontend package files
COPY ntagram/package.json ./

# Install frontend dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy frontend source
COPY ntagram/ ./

# Build frontend
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy backend package files
COPY package.json pnpm-workspace.yaml ./

# Install backend dependencies only (production)
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy backend source
COPY app.js ./
COPY config/ ./config/
COPY routes/ ./routes/
COPY middleware/ ./middleware/

# Copy built frontend from build stage
COPY --from=frontend-build /app/ntagram/build ./ntagram/build

# Set production environment
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "app.js"]

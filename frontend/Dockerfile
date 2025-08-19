FROM node:22.17.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL} NEXT_PUBLIC_SITE_NAME=${NEXT_PUBLIC_SITE_NAME}

RUN npm run build

FROM node:22.17.1-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
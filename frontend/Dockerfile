FROM node:22.17.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV} NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL} NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}

RUN npm run build

FROM node:22.17.1-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
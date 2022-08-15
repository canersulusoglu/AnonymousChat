# Build Next.js
FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi
COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
RUN yarn export

# Serve static HTML files with nginx
FROM nginx:alpine AS publisher
COPY nginx /etc/nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder ./app/out /usr/share/nginx/html
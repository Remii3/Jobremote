FROM node:slim AS base

FROM base AS deps
WORKDIR /server
COPY package.json package-lock.json ./
RUN ls -al

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base AS dev
WORKDIR /server
COPY --from=deps /server/node_modules ./node_modules
COPY . .

FROM base AS builder
WORKDIR /server
COPY . .
COPY --from=deps /server/node_modules ./node_modules
RUN npm run build

FROM base AS runner
WORKDIR /server
COPY --from=builder /server/dist ./dist
COPY --from=deps /server/node_modules ./node_modules
COPY package*.json ./

USER node

EXPOSE 5000
CMD ["npm", "run", "start"]
FROM --platform=$BUILDPLATFORM node:18 AS base
WORKDIR /app

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN npm i -g pnpm

FROM base AS prod-deps
RUN pnpm install --production --frozen-lockfile

FROM base AS dev-deps
RUN pnpm install --frozen-lockfile

FROM dev-deps AS build
COPY . .
ENV DATABASE_URL=file:./data/db.sqlite
RUN mkdir -p data
RUN pnpm drizzle-kit push:sqlite
RUN pnpm run build

FROM --platform=$BUILDPLATFORM node:18-alpine AS runtime
COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/package.json package.json
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/data/db.sqlite /data/db.sqlite

ARG GIT_SHA
ENV NODE_ENV=production
ENV DATABASE_URL=file:./data/db.sqlite
ENV GIT_SHA=$GIT_SHA
EXPOSE 3000

CMD ["npm", "start"]


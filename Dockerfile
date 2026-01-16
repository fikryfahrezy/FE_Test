FROM node:24.13.0-bookworm AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
ENV NODE_ENV=production
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build

ARG NEXT_PUBLIC_HIGHWAY_SERVICE_URL
ENV NEXT_PUBLIC_HIGHWAY_SERVICE_URL=${NEXT_PUBLIC_HIGHWAY_SERVICE_URL}

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:1.29.4 AS runner
WORKDIR /app

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /var/www/out

FROM node:20 AS build
WORKDIR /app
COPY . .
RUN corepack enable && pnpm i --frozen-lockfile
RUN pnpm build

FROM node:20
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/next.config.mjs ./
RUN corepack enable && pnpm i --prod --frozen-lockfile
EXPOSE 3000
CMD ["pnpm", "start"]
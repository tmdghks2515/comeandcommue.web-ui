# 1) Build stage
FROM node:20 AS build
WORKDIR /app

# 빌드 시 불필요한 복사를 막기 위해 캐시 최적화
COPY package*.json ./
RUN npm ci

# 앱 소스 복사 & 빌드
COPY . .
# (선택) 텔레메트리 비활성화
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 2) Runtime stage (npm install 불필요)
# node:20-slim 권장 (alpine은 sharp 등 네이티브 의존성 이슈 잦음)
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

# standalone 산출물만 복사 (node_modules 포함된 최소 런타임 트리)
COPY --from=build /app/.next/standalone ./ 
# 정적 자산은 public 경로에 필요
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# 보안: non-root로 실행
USER node

EXPOSE 3000
# standalone의 server.js 진입점
CMD ["node", "server.js"]
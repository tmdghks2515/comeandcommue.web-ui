# 1) Build stage
FROM node:20 AS build
WORKDIR /app

# 패키지 설치 (재빌드 캐시 최적화)
COPY package*.json ./
RUN npm ci

# 소스 복사 & 빌드
COPY . .
RUN npm run build

# 2) Runtime stage
FROM node:20
WORKDIR /app
ENV NODE_ENV=production

# 실행에 필요한 산출물/메타만 복사
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
# 필요 시 next.config.* 도 복사
COPY --from=build /app/next.config.* ./

# 프로덕션 의존성만 설치
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm","run","start"]
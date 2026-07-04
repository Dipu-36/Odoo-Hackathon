###############################
# Backend Builder
###############################
FROM node:22-alpine AS backend-builder

WORKDIR /app

COPY backend/package*.json ./

RUN npm ci

COPY backend .

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev


###############################
# Backend Runtime
###############################
FROM node:22-alpine AS backend

WORKDIR /app

ENV NODE_ENV=production

COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh","-c","npx prisma migrate deploy && node dist/main"]


###############################
# Frontend Builder
###############################
FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend .

RUN npm run build


###############################
# Frontend Runtime
###############################
FROM node:22-alpine AS frontend

WORKDIR /app

ENV NODE_ENV=production

COPY --from=frontend-builder /app/package*.json ./
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/package.json ./package.json

# Copy these only if they exist
COPY --from=frontend-builder /app/next.config.* ./
COPY --from=frontend-builder /app/tsconfig.json ./

EXPOSE 3000

CMD ["npm","start"]

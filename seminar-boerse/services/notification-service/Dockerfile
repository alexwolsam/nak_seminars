# Basis-Image: Node.js mit Alpine (klein und schnell)
FROM node:22-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Package Files kopieren
COPY package*.json pnpm-lock.yaml* ./

# pnpm installieren
RUN npm install -g pnpm

# Dependencies installieren
RUN pnpm install

# Source Code kopieren
COPY . .

# Prisma Client generieren
RUN pnpm prisma generate

# TypeScript kompilieren (nach dist/)
RUN pnpm tsc

# Exposed Port
EXPOSE 3001

# Start Kommando
CMD ["node", "dist/index.js"]
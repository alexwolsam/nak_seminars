FROM node:22-alpine

WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm install

# Rest kopieren
COPY . .

# Prisma-Client generieren
RUN npx prisma generate

# Build (TypeScript → JS)
RUN npm run build

CMD ["npm", "start"]
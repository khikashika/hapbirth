FROM node:20

WORKDIR /app

# Сначала только манифесты — кэшируемый слой
COPY package.json package-lock.json .npmrc ./

# npm ci строго по lock-файлу; при сбое npm — запасной вариант
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]

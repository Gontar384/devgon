FROM node:22.17.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD npm run prisma:generate && npm run prisma:migrate && npm run start:prod
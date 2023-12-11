FROM node:alpine

WORKDIR /usr/arc/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "./index.js"]
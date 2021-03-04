FROM node:14.0.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pm2
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

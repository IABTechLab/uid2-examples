FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY server.js ./
COPY public ./public/
COPY views ./views/

ENV PORT=3033
EXPOSE 3033
CMD [ "npm", "start" ]

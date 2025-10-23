FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

COPY web-integrations/server-side/package*.json ./
RUN npm install

COPY web-integrations/server-side/server.js ./
COPY web-integrations/server-side/public ./public/
COPY web-integrations/server-side/views ./views/

ENV PORT=3033
EXPOSE 3033
CMD [ "npm", "start" ]

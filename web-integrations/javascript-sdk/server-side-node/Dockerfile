FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/javascript-sdk/server-side-node/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/javascript-sdk/server-side-node/server.js ./
COPY web-integrations/javascript-sdk/server-side-node/public ./public/
COPY web-integrations/javascript-sdk/server-side-node/views ./views/

ENV PORT=3034
EXPOSE 3034
CMD ["npm", "start"]


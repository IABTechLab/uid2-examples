FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/javascript-sdk/server-side/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/javascript-sdk/server-side/server.js ./
COPY web-integrations/javascript-sdk/server-side/public ./public/
COPY web-integrations/javascript-sdk/server-side/views ./views/

ENV PORT=3034
EXPOSE 3034
CMD ["npm", "start"]


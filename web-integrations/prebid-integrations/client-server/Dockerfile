FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/prebid-integrations/client-server/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/prebid-integrations/client-server/server.js ./
COPY web-integrations/prebid-integrations/client-server/public ./public/

EXPOSE 3052
CMD ["npm", "start"]


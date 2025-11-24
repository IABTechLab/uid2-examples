FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY client-server/package*.json ./
RUN npm install

# Copy application files
COPY client-server/server.js ./
COPY client-server/public ./public/
COPY prebid.js ./prebid.js

EXPOSE 3052
CMD ["npm", "start"]


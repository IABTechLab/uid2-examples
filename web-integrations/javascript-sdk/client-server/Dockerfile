FROM node:20.11.0-alpine3.18

# Copy entrypoint script
COPY web-integrations/javascript-sdk/client-server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/javascript-sdk/client-server/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/javascript-sdk/client-server/server.js ./
COPY web-integrations/javascript-sdk/client-server/public ./public/
COPY web-integrations/javascript-sdk/client-server/views ./views/

EXPOSE 3051
ENTRYPOINT ["/entrypoint.sh"]

FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/google-secure-signals/client-server/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/google-secure-signals/client-server/server.js ./
COPY web-integrations/google-secure-signals/client-server/public ./public/
COPY web-integrations/google-secure-signals/client-server/views ./views/

EXPOSE 3041
CMD ["npm", "start"]
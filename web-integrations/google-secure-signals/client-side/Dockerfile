FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/google-secure-signals/client-side/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/google-secure-signals/client-side/server.js ./
COPY web-integrations/google-secure-signals/client-side/public ./public/
COPY web-integrations/google-secure-signals/client-side/views ./views/

EXPOSE 3040
CMD ["npm", "start"]

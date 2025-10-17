FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/google-secure-signals/server-side/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/google-secure-signals/server-side/server.js ./
COPY web-integrations/google-secure-signals/server-side/public ./public/
COPY web-integrations/google-secure-signals/server-side/views ./views/

EXPOSE 3043
CMD ["npm", "start"]
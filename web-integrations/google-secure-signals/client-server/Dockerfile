FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy application files
COPY server.js ./
COPY public ./public/
COPY views ./views/

EXPOSE 3041
CMD ["npm", "start"]
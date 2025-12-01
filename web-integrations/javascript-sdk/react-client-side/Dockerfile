FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY src ./src
COPY public ./public
COPY server.js ./

# Build the React app
RUN npm run build

# Expose port
EXPOSE 3034

# Start the app
CMD ["npm", "start"]


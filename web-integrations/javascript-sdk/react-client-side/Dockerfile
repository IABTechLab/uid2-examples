FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files
COPY web-integrations/javascript-sdk/react-client-side/package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY web-integrations/javascript-sdk/react-client-side/src ./src
COPY web-integrations/javascript-sdk/react-client-side/public ./public

# Expose port
EXPOSE 3034

# Start the app
CMD ["npm", "start"]


FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY web-integrations/google-secure-signals/react-client-side/package*.json ./
RUN npm install

# Copy application files
COPY web-integrations/google-secure-signals/react-client-side/ ./

EXPOSE 3043
CMD ["npm", "start"]

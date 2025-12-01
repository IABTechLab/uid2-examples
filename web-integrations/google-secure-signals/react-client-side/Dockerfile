FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src ./src
COPY public ./public
COPY server.js ./

# Build the React app
RUN npm run build

EXPOSE 3044
ENV PORT=3044
CMD [ "npm", "start" ]

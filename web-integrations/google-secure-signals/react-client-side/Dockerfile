FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 3044
ENV PORT=3044
CMD [ "npm", "start" ]

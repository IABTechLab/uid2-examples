FROM node:20.11.0-alpine3.18

WORKDIR /usr/src/app

COPY web-integrations/google-secure-signals/react-client-side/package*.json ./
RUN npm install

COPY web-integrations/google-secure-signals/react-client-side/ ./

EXPOSE 3044
ENV PORT=3044
CMD [ "npm", "start" ]

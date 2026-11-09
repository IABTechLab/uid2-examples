FROM node:24.22.2-alpine3.24@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY public ./public
RUN npm run build


FROM node:24.22.2-alpine3.24@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8 AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3044

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --chown=node:node server.js ./
COPY --from=builder --chown=node:node /usr/src/app/build ./build

EXPOSE 3044

USER node

CMD ["node", "server.js"]

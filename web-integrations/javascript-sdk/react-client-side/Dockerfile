FROM node:20.11.0-alpine3.18 AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY public ./public
RUN npm run build


FROM node:20.11.0-alpine3.18 AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3034

COPY package.json package-lock.json ./
# npm is needed to install dependencies, but the runtime starts directly with node.
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --chown=node:node server.js ./
COPY --from=builder --chown=node:node /usr/src/app/build ./build

EXPOSE 3034

USER node

CMD ["node", "server.js"]

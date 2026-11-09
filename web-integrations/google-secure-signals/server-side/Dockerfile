FROM node:24.22.2-alpine3.24@sha256:a34ab6d7f6f4813f4d0c5469d74685604b962fbdbf5793a7bc7b4998ecb867c8

WORKDIR /usr/src/app

# Copy package files first for better caching
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy application files
COPY --chown=node:node server.js ./
COPY --chown=node:node public ./public/
COPY --chown=node:node views ./views/

EXPOSE 3043

USER node

CMD ["node", "server.js"]

FROM node:24.21.0-alpine3.24

WORKDIR /usr/src/app

# Copy package files first for better caching
ENV NODE_ENV=production

COPY client-server/package.json client-server/package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy application files
COPY --chown=node:node client-server/server.js ./
COPY --chown=node:node client-server/public ./public/
COPY --chown=node:node prebid.js ./prebid.js

EXPOSE 3052

USER node

CMD ["node", "server.js"]

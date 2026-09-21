FROM node:24.21.0-alpine3.24

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

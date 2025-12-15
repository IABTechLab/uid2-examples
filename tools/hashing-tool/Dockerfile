FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files
COPY index.html /usr/share/nginx/html/index.html
COPY app.css /usr/share/nginx/html/app.css

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Configure nginx to serve on port 3071
RUN echo 'server { \
    listen 3071; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3071

ENTRYPOINT ["/entrypoint.sh"]

FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files
COPY index.html /usr/share/nginx/html/index.html
COPY app.css /usr/share/nginx/html/app.css

# Copy nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3071

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

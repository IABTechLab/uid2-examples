FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the env file
COPY .env /tmp/env

# Copy static files
COPY app.css /usr/share/nginx/html/
COPY prebid.js /usr/share/nginx/html/

# Copy config and HTML
COPY default.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.template.html
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
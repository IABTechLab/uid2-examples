FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files from client-side-deferred directory
COPY client-side-deferred/app.css /usr/share/nginx/html/
COPY prebid.js /usr/share/nginx/html/

# Copy config and HTML
COPY client-side-deferred/default.conf /etc/nginx/conf.d/default.conf
COPY client-side-deferred/index.html /usr/share/nginx/html/index.template.html
COPY client-side-deferred/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


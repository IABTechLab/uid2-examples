FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Remove the unused image-filter module and its image and font libraries
RUN apk del --no-cache nginx-module-image-filter

# Copy static files from client-side directory
COPY client-side/app.css /usr/share/nginx/html/
COPY prebid.js /usr/share/nginx/html/

# Copy config and HTML
COPY client-side/default.conf /etc/nginx/conf.d/default.conf
COPY client-side/index.html /usr/share/nginx/html/index.template.html
COPY client-side/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
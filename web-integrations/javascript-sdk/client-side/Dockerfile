FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Remove the unused image-filter module and its image and font libraries
RUN apk del --no-cache nginx-module-image-filter

# Copy static files from client-side directory
COPY html /usr/share/nginx/html/

# Copy config and entrypoint
COPY default.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
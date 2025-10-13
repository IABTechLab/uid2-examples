FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files from client-side directory
COPY web-integrations/javascript-sdk/client-side/html /usr/share/nginx/html/

# Copy config and entrypoint
COPY web-integrations/javascript-sdk/client-side/default.conf /etc/nginx/conf.d/default.conf
COPY web-integrations/javascript-sdk/client-side/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
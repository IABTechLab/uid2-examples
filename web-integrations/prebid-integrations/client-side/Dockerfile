FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy the env file
COPY .env /tmp/env

# Copy static files from client-side directory
COPY web-integrations/prebid-integrations/client-side/app.css /usr/share/nginx/html/
COPY web-integrations/prebid-integrations/client-side/prebid.js /usr/share/nginx/html/

# Copy config and HTML
COPY web-integrations/prebid-integrations/client-side/default.conf /etc/nginx/conf.d/default.conf
COPY web-integrations/prebid-integrations/client-side/index.html /usr/share/nginx/html/index.template.html
COPY web-integrations/prebid-integrations/client-side/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
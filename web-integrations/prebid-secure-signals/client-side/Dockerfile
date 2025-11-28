FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files
COPY client-side/app.css /usr/share/nginx/html/
COPY client-side/ads.css /usr/share/nginx/html/
COPY client-side/ads.js /usr/share/nginx/html/
COPY prebid.js /usr/share/nginx/html/

# Copy shared styles folder
COPY web-integrations/styles /usr/share/nginx/html/styles/

# Copy config and HTML template
COPY client-side/default.conf /etc/nginx/conf.d/default.conf
COPY client-side/index.html /usr/share/nginx/html/index.template.html
COPY client-side/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


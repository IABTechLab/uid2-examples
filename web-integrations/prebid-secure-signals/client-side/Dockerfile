FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files
COPY web-integrations/prebid-secure-signals/client-side/app.css /usr/share/nginx/html/
COPY web-integrations/prebid-secure-signals/client-side/ads.css /usr/share/nginx/html/
COPY web-integrations/prebid-secure-signals/client-side/ads.js /usr/share/nginx/html/
COPY web-integrations/prebid-secure-signals/prebid.js /usr/share/nginx/html/

# Copy shared styles folder
COPY web-integrations/styles /usr/share/nginx/html/styles/

# Copy config and HTML template
COPY web-integrations/prebid-secure-signals/client-side/default.conf /etc/nginx/conf.d/default.conf
COPY web-integrations/prebid-secure-signals/client-side/index.html /usr/share/nginx/html/index.template.html
COPY web-integrations/prebid-secure-signals/client-side/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]


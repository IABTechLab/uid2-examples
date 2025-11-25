FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy static files from client-side directory
COPY web-integrations/google-secure-signals/client-side/html /usr/share/nginx/html/

# Copy shared styles folder
COPY web-integrations/styles /usr/share/nginx/html/styles/

# Copy config and entrypoint
COPY web-integrations/google-secure-signals/client-side/default.conf /etc/nginx/conf.d/default.conf
COPY web-integrations/google-secure-signals/client-side/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine

# Install wget for healthcheck and gettext for envsubst
RUN apk add --no-cache wget gettext

# Create templates directory
RUN mkdir -p /etc/nginx/templates

# Copy custom nginx.conf with increased server_names_hash_bucket_size
COPY nginx.conf /etc/nginx/nginx.conf

# Copy nginx configuration template
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create directory for static files (optional)
RUN mkdir -p /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

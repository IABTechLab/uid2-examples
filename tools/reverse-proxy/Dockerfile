FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Create directory for static files (optional)
RUN mkdir -p /usr/share/nginx/html

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]

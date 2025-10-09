# Use nginx as the base image
FROM nginx:alpine

# Copy the static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY app.css /usr/share/nginx/html/
COPY prebid.js /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/

# Create custom nginx config to listen on port 3031
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 3031;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Expose port 3031
EXPOSE 3031

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

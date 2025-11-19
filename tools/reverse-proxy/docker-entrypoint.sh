#!/bin/sh
set -e

# Default domain if not set
DOMAIN=${DOMAIN:-sample-dev.com}

# Substitute environment variables in the template
envsubst '${DOMAIN}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

# Execute the main command
exec "$@"


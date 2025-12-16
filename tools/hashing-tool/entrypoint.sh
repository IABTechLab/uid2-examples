#!/bin/sh

# Set default values if not provided
export UID_JS_SDK_URL=${UID_JS_SDK_URL:-"https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js"}
export UID_JS_SDK_NAME=${UID_JS_SDK_NAME:-"__uid2"}
export IDENTITY_NAME=${IDENTITY_NAME:-"UID2"}
export DOCS_BASE_URL=${DOCS_BASE_URL:-"https://unifiedid.com/docs"}

# Process index.html template with environment variables
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.temp.html
mv /usr/share/nginx/html/index.temp.html /usr/share/nginx/html/index.html

# Start nginx
exec nginx -g "daemon off;"


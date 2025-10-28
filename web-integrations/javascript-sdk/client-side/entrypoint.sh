#!/bin/sh

# Set default values if not provided
export UID_JS_SDK_URL=${UID_JS_SDK_URL:-"https://cdn.integ.uidapi.com/uid2-sdk-4.0.1.js"}
export UID_JS_SDK_NAME=${UID_JS_SDK_NAME:-"__uid2"}
export UID_BASE_URL=${UID_BASE_URL:-"https://operator-integ.uidapi.com"}
export SERVER_PUBLIC_KEY=${UID_CSTG_SERVER_PUBLIC_KEY:-"UID2-X-I-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEo+jcPlk8GWn3iG0R5Il2cbFQI9hR3TvHxaBUKHl5Vh+ugr+9uLMiXihka8To07ETFGghEifY96Hrpe5RnYko7Q=="}
export SUBSCRIPTION_ID=${UID_CSTG_SUBSCRIPTION_ID:-"DMr7uHxqLU"}
export PRODUCT_NAME=${PRODUCT_NAME:-"UID2"}
export DOCS_BASE_URL=${DOCS_BASE_URL:-"https://unifiedid.com/docs"}

# Process index.html template with environment variables
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.temp.html
mv /usr/share/nginx/html/index.temp.html /usr/share/nginx/html/index.html

# Process iframe.html template with environment variables
envsubst < /usr/share/nginx/html/iframe.html > /usr/share/nginx/html/iframe.temp.html
mv /usr/share/nginx/html/iframe.temp.html /usr/share/nginx/html/iframe.html

# Start nginx
exec nginx -g "daemon off;"

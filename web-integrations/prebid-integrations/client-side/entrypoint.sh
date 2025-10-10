#!/bin/sh

# Load environment variables from env file
export $(cat /tmp/env | xargs)

# Set default values if not provided
export UID2_BASE_URL=${UID2_BASE_URL:-"https://operator-integ.uidapi.com"}
export SERVER_PUBLIC_KEY=${SERVER_PUBLIC_KEY:-"UID2-X-I-MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEo+jcPlk8GWn3iG0R5Il2cbFQI9hR3TvHxaBUKHl5Vh+ugr+9uLMiXihka8To07ETFGghEifY96Hrpe5RnYko7Q=="}
export SUBSCRIPTION_ID=${SUBSCRIPTION_ID:-"DMr7uHxqLU"}

# Copy static files
cp /usr/share/nginx/html/app.css /usr/share/nginx/html/
cp /usr/share/nginx/html/prebid.js /usr/share/nginx/html/

# Process index.html template with environment variables
envsubst < /usr/share/nginx/html/index.template.html > /usr/share/nginx/html/index.html

# Start nginx
exec nginx -g "daemon off;"

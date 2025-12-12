#!/bin/sh
set -e

# Default domain if not set
DOMAIN=${DOMAIN:-sample-dev.com}

# Check if SSL certificates exist
if [ ! -f /etc/nginx/certs/cert.crt ] || [ ! -f /etc/nginx/certs/cert.key ]; then
  echo "WARNING: SSL certificates not found at /etc/nginx/certs/"
  echo "HTTPS will not work until you generate certificates."
  echo "Run 'npm install && npm run createCA' in the project root to generate certificates."
  echo "Then trust the CA certificate (ca/ca.crt) in your system/browser."
  echo ""
  echo "Creating self-signed fallback certificates for startup..."
  # Create fallback self-signed certificate so nginx can start
  mkdir -p /etc/nginx/certs
  openssl req -x509 -nodes -days 1 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/cert.key \
    -out /etc/nginx/certs/cert.crt \
    -subj "/CN=localhost" 2>/dev/null || true
fi

# Default backend host pattern (defaults to localhost for Kubernetes same-pod)
# For Docker Compose with separate containers, set BACKEND_HOST="" to use service names
# Check if BACKEND_HOST is explicitly set to empty string - if so, use service names
# If BACKEND_HOST is unset, it will default to localhost
if [ "${BACKEND_HOST+set}" = "set" ] && [ -z "$BACKEND_HOST" ]; then
  # BACKEND_HOST is explicitly set to empty string - use service names for Docker Compose
  JS_CLIENT_SIDE_BACKEND=${JS_CLIENT_SIDE_BACKEND:-javascript-sdk-client-side}
  JS_CLIENT_SERVER_BACKEND=${JS_CLIENT_SERVER_BACKEND:-javascript-sdk-client-server}
  JS_REACT_CLIENT_SIDE_BACKEND=${JS_REACT_CLIENT_SIDE_BACKEND:-javascript-sdk-react-client-side}
  SERVER_SIDE_BACKEND=${SERVER_SIDE_BACKEND:-server-side}
  SECURE_SIGNALS_CLIENT_SERVER_BACKEND=${SECURE_SIGNALS_CLIENT_SERVER_BACKEND:-google-secure-signals-client-server}
  SECURE_SIGNALS_CLIENT_SIDE_BACKEND=${SECURE_SIGNALS_CLIENT_SIDE_BACKEND:-google-secure-signals-client-side}
  SECURE_SIGNALS_SERVER_SIDE_BACKEND=${SECURE_SIGNALS_SERVER_SIDE_BACKEND:-google-secure-signals-server-side}
  SECURE_SIGNALS_REACT_CLIENT_SIDE_BACKEND=${SECURE_SIGNALS_REACT_CLIENT_SIDE_BACKEND:-google-secure-signals-react-client-side}
  PREBID_CLIENT_BACKEND=${PREBID_CLIENT_BACKEND:-prebid-client}
  PREBID_CLIENT_SERVER_BACKEND=${PREBID_CLIENT_SERVER_BACKEND:-prebid-client-server}
  PREBID_CLIENT_SIDE_DEFERRED_BACKEND=${PREBID_CLIENT_SIDE_DEFERRED_BACKEND:-prebid-client-side-deferred}
  PREBID_SECURE_SIGNALS_CLIENT_SIDE_BACKEND=${PREBID_SECURE_SIGNALS_CLIENT_SIDE_BACKEND:-prebid-secure-signals-client-side}
else
  # BACKEND_HOST is unset (defaults to localhost) or set to a value - use it for all services
  BACKEND_HOST_VALUE=${BACKEND_HOST:-localhost}
  JS_CLIENT_SIDE_BACKEND=${JS_CLIENT_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
  JS_CLIENT_SERVER_BACKEND=${JS_CLIENT_SERVER_BACKEND:-$BACKEND_HOST_VALUE}
  JS_REACT_CLIENT_SIDE_BACKEND=${JS_REACT_CLIENT_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
  SERVER_SIDE_BACKEND=${SERVER_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
  SECURE_SIGNALS_CLIENT_SERVER_BACKEND=${SECURE_SIGNALS_CLIENT_SERVER_BACKEND:-$BACKEND_HOST_VALUE}
  SECURE_SIGNALS_CLIENT_SIDE_BACKEND=${SECURE_SIGNALS_CLIENT_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
  SECURE_SIGNALS_SERVER_SIDE_BACKEND=${SECURE_SIGNALS_SERVER_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
  SECURE_SIGNALS_REACT_CLIENT_SIDE_BACKEND=${SECURE_SIGNALS_REACT_CLIENT_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
  PREBID_CLIENT_BACKEND=${PREBID_CLIENT_BACKEND:-$BACKEND_HOST_VALUE}
  PREBID_CLIENT_SERVER_BACKEND=${PREBID_CLIENT_SERVER_BACKEND:-$BACKEND_HOST_VALUE}
  PREBID_CLIENT_SIDE_DEFERRED_BACKEND=${PREBID_CLIENT_SIDE_DEFERRED_BACKEND:-$BACKEND_HOST_VALUE}
  PREBID_SECURE_SIGNALS_CLIENT_SIDE_BACKEND=${PREBID_SECURE_SIGNALS_CLIENT_SIDE_BACKEND:-$BACKEND_HOST_VALUE}
fi

# Export all variables for envsubst
export DOMAIN
export JS_CLIENT_SIDE_BACKEND
export JS_CLIENT_SERVER_BACKEND
export JS_REACT_CLIENT_SIDE_BACKEND
export SERVER_SIDE_BACKEND
export SECURE_SIGNALS_CLIENT_SERVER_BACKEND
export SECURE_SIGNALS_CLIENT_SIDE_BACKEND
export SECURE_SIGNALS_SERVER_SIDE_BACKEND
export SECURE_SIGNALS_REACT_CLIENT_SIDE_BACKEND
export PREBID_CLIENT_BACKEND
export PREBID_CLIENT_SERVER_BACKEND
export PREBID_CLIENT_SIDE_DEFERRED_BACKEND
export PREBID_SECURE_SIGNALS_CLIENT_SIDE_BACKEND

# Substitute environment variables in the template
envsubst '${DOMAIN} ${JS_CLIENT_SIDE_BACKEND} ${JS_CLIENT_SERVER_BACKEND} ${JS_REACT_CLIENT_SIDE_BACKEND} ${SERVER_SIDE_BACKEND} ${SECURE_SIGNALS_CLIENT_SERVER_BACKEND} ${SECURE_SIGNALS_CLIENT_SIDE_BACKEND} ${SECURE_SIGNALS_SERVER_SIDE_BACKEND} ${SECURE_SIGNALS_REACT_CLIENT_SIDE_BACKEND} ${PREBID_CLIENT_BACKEND} ${PREBID_CLIENT_SERVER_BACKEND} ${PREBID_CLIENT_SIDE_DEFERRED_BACKEND} ${PREBID_SECURE_SIGNALS_CLIENT_SIDE_BACKEND}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t

# Execute the main command
exec "$@"


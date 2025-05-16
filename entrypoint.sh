#!/bin/sh

# Set the runtime configuration for the frontend
cat <<EOF > /usr/share/nginx/html/config.json
{
  "EXERCISE_API_URL": "${EXERCISE_API_URL}"
}
EOF

# Start nginx server, this will run nginx in the foreground
exec nginx -g 'daemon off;'

# Uses Nginx to serve the static content
FROM nginx:alpine

# Copy the custom Nginx configuration file to the correct location
COPY nginx.conf /etc/nginx/nginx.conf

# Copies only the dist files to /usr/share/nginx/html in the container
COPY dist /usr/share/nginx/html
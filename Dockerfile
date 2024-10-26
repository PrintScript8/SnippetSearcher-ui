# Uses Nginx to serve the static content
FROM nginx:alpine

#Copies only the dist files to /user/share/nginx/html in the container
COPY dist /usr/share/nginx/html
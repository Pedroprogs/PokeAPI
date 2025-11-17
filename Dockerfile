FROM nginx:1.27-alpine

RUN rm /usr/share/nginx/html/index.html


COPY . /usr/share/nginx/html

EXPOSE 80
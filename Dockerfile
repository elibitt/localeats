FROM node:8-alpine
MAINTAINER localeats

# Change working directory
WORKDIR /usr/app/
COPY package*.json ./
RUN apk add --no-cache --virtual deps \
  python \
  build-base \
  && npm install \
  && apk del deps
COPY server ./server

EXPOSE $port
CMD [ "npm", "start" ]

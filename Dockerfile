FROM node:8-alpine
MAINTAINER localeats

# Change working directory
WORKDIR /usr/app/
COPY package*.json ./
RUN npm install
COPY server ./server

EXPOSE 80
CMD [ "npm", "start" ]

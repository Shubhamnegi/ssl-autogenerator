FROM node:16-slim

RUN apt-get update -y
RUN apt-get install zip unzip openssl -y

WORKDIR /usr/src/app


ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN cd /tmp && npm install

RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

COPY . .

Run node --max-old-space-size=8192 ./node_modules/.bin/tsc

EXPOSE 8080
CMD [ "node", "./dist/index.js" ]

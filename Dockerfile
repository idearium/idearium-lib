FROM node:8-alpine

# Setup dockerize.
ENV DOCKERIZE_VERSION v0.6.0
RUN apk add --no-cache curl openssl && \
    curl -sSL https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar -C /usr/local/bin -xzvf - && \
    apk del curl openssl

COPY / /app
WORKDIR /app

RUN yarn --production

CMD dockerize -wait tcp://rabbitmq:5672 -timeout 20s yarn test-app

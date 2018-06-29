#!/usr/bin/env bash

if [ ! "$(docker ps -q -f name=rabbitmq)" ]; then

    if [ "$(docker ps -aq -f status=exited -f name=rabbitmq)" ]; then
        docker rm rabbitmq
    fi

    docker run --name rabbitmq -e RABBITMQ_DEFAULT_USER=lib -e RABBITMQ_DEFAULT_PASS=lib -d rabbitmq:3.7-alpine

fi

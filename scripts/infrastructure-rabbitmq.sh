#!/usr/bin/env bash

if [ ! "$(docker ps -q -f name=rabbitmq)" ]; then

    if [ "$(docker ps -aq -f status=exited -f name=rabbitmq)" ]; then
        docker rm rabbitmq
    fi

    docker run --name rabbitmq -d rabbitmq:3.7-alpine

fi

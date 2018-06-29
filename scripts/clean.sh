#!/usr/bin/env bash

# Stop the infrastructure
docker stop mongodb
docker stop rabbitmq
docker stop redis

#!/usr/bin/env bash

# Setup the infrastructure
for script in "infrastructure-mongo.sh" "infrastructure-rabbitmq.sh" "infrastructure-redis.sh"; do
    source "$PWD/scripts/${script}"
done

# Link the infrastructure and run the image.
# Stop the containers even if the tests fail.
docker run --link mongodb:mongo --link rabbitmq:rabbitmq --link redis:redis --rm idearium-lib || \
    . $PWD/scripts/clean.sh && exit 1

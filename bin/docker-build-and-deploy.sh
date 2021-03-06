#!/bin/sh
set -e

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"

docker build --pull -t rabblerouser/mailer .
docker push rabblerouser/mailer

#!/bin/bash

docker-compose -f docker-compose.yml down             #stop containers and remove containers, networks
docker rmi -f urban-api                               #remove the image
#docker image prune -f                                 #remove all images without use
#!/bin/bash

docker-compose -f docker-compose.yml build                    #build image 
docker-compose -f docker-compose.yml up -d   --force-recreate #run containers

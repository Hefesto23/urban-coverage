# Urban Coverage - Case of Study

This project represents a simple case study for later use.

## Description

This project is an attempt to build one efficient, scalable Node.js server-side application. It uses progressive JavaScript, is built with and fully supports TypeScript.
This api resolves an given human-readable address into a London district. The list of districts is provided as a separate GeoJSON file `formated-districts.json`.
In order to perform this resolution, it uses an address-to-coordinate provider (MAPBOX_API), to get latitude and longitude for the given search string, then use the GeoJSON file provided to get a 'service area' identifier and return a structure that describes the location.
Best practices, SOLID design principles, separation of responsibilities, and code decoupling were the main concepts that guided the development process in order to improve code internal quality.

## How it Works?

When you run this app, it exposes 2 endpoints:

1. GET / : Once the application is running, open your browser and navigate to http://localhost:PORT/, the port we are using by default is 3000. You should see a message 'Server is Up!'.

2. POST /urban-coverage/search-address(or http://localhost:3000/urban-coverage/search-address) : This endpoint should return a structure that describes one location. Input data should follow this structure:

```javascript
{
  searchAddress: <one human-readable address>
}

```

You can check the unit and end-to-end tests to understand better how it works.

## Prerequisites

Please make sure that Node.js (>= 10.13.0) is installed on your operating system.
The first thing you **NEED** in order to run this app, is to set all the necessaries environment variables!
There is one .env file in the root of this project, so make use of it...

```
#Token to have access to Api
MAPBOX_API_TOKEN=<your mapbox token>

#Mongo related env vars
MONGO_PORT=<mongo port in your server, usually 27017>
#Use your docker IP here, we will try localhost
MONGODB_CONNECTION_STRING=<mongodb://<YOUR HOST IP>:<MONGO PORT>/urban-db>

#Redis Time to live, port and server
REDIS_TTL=<Integer value in seconds>
REDIS_PORT=<redis port in your server, usually 6379>
#Use your docker IP here, we will try localhost
REDIS_HOST=<YOUR HOST IP>

#Port where this app will be running
SERVER_PORT=<APP PORT>
```

If you want to run this app in your machine you **have** to install and configure mongodb and redis in your localhost!!

Alternatively, you can make use of scripts in scripts folder to run with docker...

## Running with Docker

To make use of scripts, you **need** to have shell script in your machine.

run:

```bash
#deploy prod in docker container
sh .\scripts\deploy.prod.sh

#to stop containers and remove containers, networks
sh .\scripts\down.prod.sh
```

to check container image:

```bash
#check containers
docker ps

#create new sh process inside the container and connect to the terminal
docker exec -it <container name|id> sh

#print the last 100 lines and follow app logs
docker logs -f --tail 100 <container id>
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Author

Vinicius Raszl

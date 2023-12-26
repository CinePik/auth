<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
  <a href="https://www.keycloak.org/" target="blank"><img src="https://www.keycloak.org/resources/images/icon.svg" width="100" alt="Keycloak Logo" /></a>
</p>

<p align="center">
  <a href="https://github.com/CinePik/auth/actions/workflows/ci.yml" target="_blank">
    <img src="https://github.com/CinePik/auth/actions/workflows/ci.yml/badge.svg" alt="Catalog CI Workflow Status" />
  </a>
  <a href="https://github.com/CinePik/auth/actions/workflows/cd.yml" target="_blank">
    <img src="https://github.com/CinePik/auth/actions/workflows/cd.yml/badge.svg" alt="Catalog CD Workflow Status" />
  </a>
</p>

# CinePik Auth

Node.js microservice for authorization and authentication using [Keycloak](https://www.keycloak.org/).

## Documentation
OpenAPI documentation available at [http://localhost:3000/api](http://localhost:3000/api).  
For accessing secured endpoints add your `access_token` provided to you at login to the `Authorization` header.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

To run the app in a docker container, run the following commands.

```bash
docker network create cinepik-network

docker build -t cinepik-auth .

docker run -d -t --env-file .env --network cinepik-network -p 3000:3000 cinepik-auth
```

To manually upload the image to Docker Hub, run the following commands.

```bash
docker build -t cinepik-auth .

docker tag cinepik-auth:latest <dockerhub_username>/cinepik-auth:latest

docker push <dockerhub_username>/cinepik-auth:latest
```

### Docker Compose (recommend)

You can also setup the application with docker-compose.

```bash
docker-compose up

docker-compose down
```

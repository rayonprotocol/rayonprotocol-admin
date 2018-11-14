# Dev
contains all the preparation and environment required for development with Docker Compose.

## Containers
Docker Compose run 3 container(app)s as a service

### Ganache
- running ganache-cli exposing `localhost:8545`

### Contract
this container is started after Ganache is up

- compile contracts (artifacts of compilation are shared through `.volume` directory - specified in `docker-compose.yml`)
- sending sample transactions for each contract

### DB
- ruunning mysql exposing `localhost:3306`

## Up and Running
1. install [Docker Compose](https://docs.docker.com/compose/install/)
3. specify environment variables in `.env` to be used in building docker image and running container (see https://docs.docker.com/compose/env-file/)
2. execute command following in `dev` directory

```sh
docker-compose -f "docker-compose.yml" up -d --build
```
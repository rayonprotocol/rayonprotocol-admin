# Rayon admin node server

...


## Dev Setup

### Local DB

#### Using Docker compose
1. install [docker compose](https://docs.docker.com/compose/install/)
2. execute command to run

```sh
docker-compose -f "localdb/docker-compose.yml" up -d --build
```

#### Manually
1. install [mysql](https://dev.mysql.com/downloads/installer/)
2. execute command to start up mysql and inititate schema and user

```sh
mysqld --init-file /data/application/rayon.sql
```


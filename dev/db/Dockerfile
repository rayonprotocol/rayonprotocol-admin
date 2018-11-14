FROM mysql:5.6
LABEL Name=rayon-dev-db

COPY ./my.cnf /etc/mysql/mysql.conf.d/my.cnf
COPY ./rayon.sql /data/application/db/rayon.sql

CMD ["mysqld"]


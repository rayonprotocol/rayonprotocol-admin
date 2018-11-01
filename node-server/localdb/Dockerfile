FROM mysql:5.6
LABEL Name=rayon-localdb-mysql

COPY ./my.cnf /etc/mysql/mysql.conf.d/my.cnf
COPY ./rayon.sql /data/application/rayon.sql

CMD ["mysqld"]


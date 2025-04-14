FROM postgres:latest
COPY programs/init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
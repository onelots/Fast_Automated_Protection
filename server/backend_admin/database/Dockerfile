FROM postgres:15
COPY programs/init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
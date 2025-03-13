# Initial dummy code for building the database, using postgresql

FROM postgres:latest
COPY programs/init.sql /docker-entrypoint-initdb.d/
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres
EXPOSE 5432
CMD ["postgres"]

# End of file
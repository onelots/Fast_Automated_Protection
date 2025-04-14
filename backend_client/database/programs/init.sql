CREATE DATABASE client_database;

\c client_database;

CREATE TABLE IF NOT EXISTS client_stats (
    id SERIAL PRIMARY KEY,
    files_added INTEGER NOT NULL,
    files_deleted INTEGER NOT NULL,
    backup_count INTEGER NOT NULL
);
CREATE DATABASE admin_database;

\c admin_database;

CREATE TABLE IF NOT EXISTS weekly_backups (
    id SERIAL PRIMARY KEY,
    day VARCHAR(10) NOT NULL,
    backup_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS backup_distribution (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_list (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    os VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_backup TIMESTAMP,
    storage_used INTEGER,
    storage_total INTEGER
)
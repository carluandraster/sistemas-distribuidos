USE [encuestas_anonimas_sd];

CREATE TABLE Account (
    username VARCHAR (32) NOT NULL PRIMARY KEY,
    password VARCHAR (32) NOT NULL
);

CREATE TABLE Survey (
    id_suvey INT          NOT NULL PRIMARY KEY,
    title    VARCHAR (32) NOT NULL,
    author   VARCHAR (32) NOT NULL,
    FOREIGN KEY (author) REFERENCES Account (username) ON DELETE CASCADE
);

CREATE TABLE Question (
    id_question INT          NOT NULL PRIMARY KEY,
    label       VARCHAR (32)
);

CREATE DATABASE chamagro_db;

CREATE SCHEMA IF NOT EXISTS public;

-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--create table for user credentials
CREATE TABLE IF NOT EXISTS public.users_credentials (
    id serial not null primary key,
    email varchar(100) unique not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    last_accessed timestamp
);
CREATE INDEX idx_users_credentials_email ON public.users_credentials (email);

--create table for verification codes
CREATE TABLE IF NOT EXISTS public.tokens (
    id serial not null primary key,
    email varchar(100) unique not null,
    code varchar(50) not null,
    type varchar(50) not null,
    verification_tries int default 0,
    expires_at timestamp not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp
);

CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  image varchar(250),
  role VARCHAR(20) NOT NULL DEFAULT 'DEFAULT', 
  active boolean DEFAULT true,
  last_accessed timestamp,
  last_modified timestamp,
  auth_provider varchar(50) not null,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_role ON public.users (role);

CREATE TABLE public.chamados (
    id UUID PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    central VARCHAR(255) NOT NULL,
    outrosInteressados VARCHAR(255),
    date_created TIMESTAMP DEFAULT current_timestamp,
    updated_at timestamp,
    owner_id uuid not null,
    status VARCHAR(50) NOT NULL,
    foreign key (owner_id) references public.users(id) on delete cascade
);
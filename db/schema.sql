-- CREATE TABLE products (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   price NUMERIC NOT NULL
-- );
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
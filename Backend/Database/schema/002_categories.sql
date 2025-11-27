CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE
);
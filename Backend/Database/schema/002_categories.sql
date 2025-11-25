CREATE TABLE categories {
    category_id SERIAL PRIMARY,
    category_name TEXT NOT NULL UNIQUE
};
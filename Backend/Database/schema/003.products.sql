CREATE TABLE products(
    product_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INT REFERENCES categories(category_id),
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL,
    reorder_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE products{
    product_id PRIMARY KEY,
    name text NOT NULL,
    category_id INT REFERENCES categories(category_id),
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    reorder_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
};
CREATE TABLE orders(
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    order_date TIMESTAMP DEFAULT now(),
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'pending'
);
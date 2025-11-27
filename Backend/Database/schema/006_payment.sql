CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    payment_date TIMESTAMP DEFAULT now(),
    order_id INT REFERENCES orders(order_id),
    payment_method TEXT NOT NULL,
    transaction_id TEXT UNIQUE,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'success'
);
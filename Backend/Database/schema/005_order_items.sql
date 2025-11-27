CREATE TABLE order_items(
    item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE SET NULL,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL ,
    price_per_unit NUMERIC(10,2) NOT NULL,
    sub_total NUMERIC(10,2) GENERATED ALWAYS AS (quantity*price_per_unit) STORED
);
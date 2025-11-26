
CREATE TABLE users{

    user_id SERIAL PRIMARY KEY,
    name text NOT NULL CHECK(length(name)>=3),
    email TEXT NOT NULL,
    phone TEXT,
    role text NOT NULL CHECK (role in ('admin','customer')),
    created_at TIMESTAMP DEFAULT now()



    
};
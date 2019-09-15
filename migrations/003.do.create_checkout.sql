CREATE TABLE checkout (
    user_id INTEGER REFERENCES users(id),
    inventory_id INTEGER REFERENCES inventory(id),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (user_id, inventory_id)
);
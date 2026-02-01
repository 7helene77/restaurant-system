-- Base de données restaurant
CREATE DATABASE restaurant_db;
\c restaurant_db;

-- Table utilisateurs 
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL, 
	email VARCHAR(100) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role VARCHAR(20) NOT NULL DEFAULT 'server',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables du restaurant
CREATE TABLE tables (
	id SERIAL PRIMARY KEY,
	number INTEGER UNIQUE NOT NULL,
	status VARCHAR(20) DEFAULT 'free',
	capacity INTEGER DEFAULT 4
);

-- Catégories de produits
CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

-- Produits
CREATE TABLE products (
	id SERIAL PRIMARY KEY, 
	name VARCHAR(200) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	category_id INTEGER REFERENCES categories(id),
	stock INTEGER DEFAULT 0,
	is_active BOOLEAN DEFAULT TRUE
);

-- Commandes 
CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	table_id INTEGER REFERENCES tables(id),
	type VARCHAR(20) DEFAULT 'on_site',
	status VARCHAR(20) DEFAULT 'pending',
	total DECIMAL(10,2) NOT NULL,
	paid BOOLEAN DEFAULT FALSE,
	notes TEXT,
	created_by INTEGER REFERENCES users(id),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles de commande 
CREATE TABLE order_items (
	id SERIAL PRIMARY KEY,
	order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
	product_id INTEGER REFERENCES products(id),
	quantity INTEGER NOT NULL,
	price DECIMAL(10,2) NOT NULL
);

-- Insertion données initiales
INSERT INTO users (name, email, password_hash, role) VALUES 
('Sawadee', 'admin@restaurant.com', '75009', 'admin'),
('Serveur', 'server@restaurant.com', '75009', 'server'),
('Cuisine', 'kitchen@restaurant', '75009', 'kitchen');

INSERT INTO categories (name) VALUES ('Entrées'), ('Plats'), ('Desserts'), ('Boissons');

INSERT INTO tables (number, capacity) VALUES 
(1,4), (2,4), (3,2), (4,6), (5,4), (6,4), (7,2), (8,6), (9,4), (10,4);

INSERT INTO products (name, price, category_id, stock) VALUES 
('Salade', 9.5, 1, 20)
('Soupe', 18.5, 2, 30);



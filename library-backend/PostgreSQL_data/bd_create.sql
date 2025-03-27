-- Основные таблицы
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Модифицированная таблица Customers с паролем
CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dateRegistration DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE User_Roles (
    user_role_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    role_id INT REFERENCES Roles(role_id)
);

-- Категории изделий
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Изделия
CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    category_id INT REFERENCES Categories(category_id),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    rental_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    image_path VARCHAR(255)
);

-- Справочник статусов заказов
CREATE TABLE Order_Statuses (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Заказы
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_id INT REFERENCES Order_Statuses(status_id) NOT NULL,
    pickup_time TIMESTAMP NOT NULL
);

-- Детали заказов
CREATE TABLE Order_Details (
    order_detail_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(order_id),
    product_id INT REFERENCES Products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL, -- Цена на момент заказа
    line_total NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

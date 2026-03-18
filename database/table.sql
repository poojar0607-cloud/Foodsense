CREATE DATABASE foodsense;
USE foodsense;
CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    food VARCHAR(100) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1),
    map_link TEXT
);

-- Migration script to create events table
-- Run this script to create the events table for the Event Management System

CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- Drop the old games table if it exists
DROP TABLE IF EXISTS games;

-- Create the new events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    capacity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_organizer (organizer)
);

-- Insert sample data
INSERT INTO events (title, organizer, description, date, location, price, capacity, image_url, status) VALUES
('Tech Conference 2025', 'TechCorp', 'Annual technology conference featuring latest innovations in AI and Web Development', '2025-08-15 09:00:00', 'Jakarta Convention Center', 500000.00, 500, 'https://dce.telkomuniversity.ac.id/wp-content/uploads/2024/03/standard-quality-control-concept-m-scaled.jpg', 'published'),
('Music Festival Jakarta', 'EventPro', 'Three-day music festival featuring local and international artists', '2025-09-20 18:00:00', 'Gelora Bung Karno Stadium', 750000.00, 10000, 'https://awsimages.detik.net.id/community/media/visual/2019/08/09/779792d0-0011-43b8-80b3-9828b13ce1f7.jpeg', 'published'),
('Startup Pitch Competition', 'Innovation Hub', 'Competition for early-stage startups to pitch their ideas to investors', '2025-07-10 10:00:00', 'Coworking Space Central', 250000.00, 100, 'https://tangselxpress.com/wp-content/uploads/2023/07/drakor-e1690038046529-667x375.jpg', 'draft');


SELECT * FROM events;
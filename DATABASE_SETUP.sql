-- Atlas SmartFactory Database Setup
-- MySQL Script for creating all required tables

-- Create Database
CREATE DATABASE IF NOT EXISTS atlas_smartfactory;
USE atlas_smartfactory;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `Users` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'director', 'quality_manager', 'production_manager', 'operator', 'technician', 'sales', 'client', 'auditor') NOT NULL,
  `department` VARCHAR(255),
  `mfaEnabled` BOOLEAN DEFAULT FALSE,
  `mfaSecret` VARCHAR(255),
  `active` BOOLEAN DEFAULT TRUE,
  `lastLogin` DATETIME,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (active)
);

-- 2. Lots Table (Traceability)
CREATE TABLE IF NOT EXISTS `Lots` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `qrCode` VARCHAR(255) NOT NULL UNIQUE,
  `lotNumber` VARCHAR(255) NOT NULL UNIQUE,
  `productType` VARCHAR(255) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit` VARCHAR(50) DEFAULT 'kg',
  `status` ENUM('received', 'cutting', 'grinding', 'seasoning', 'packaging', 'storage', 'shipped', 'quality_blocked') DEFAULT 'received',
  `temperature` DECIMAL(5, 2),
  `humidity` DECIMAL(5, 2),
  `location` VARCHAR(255),
  `completedAt` DATETIME,
  `notes` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_lotNumber (lotNumber),
  INDEX idx_status (status),
  INDEX idx_qrCode (qrCode),
  INDEX idx_createdAt (createdAt)
);

-- 3. IoT Sensors Table
CREATE TABLE IF NOT EXISTS `IoTSensors` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `sensorId` VARCHAR(255) NOT NULL UNIQUE,
  `sensorName` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `type` ENUM('temperature', 'humidity', 'pressure', 'vibration', 'sound') NOT NULL,
  `currentValue` DECIMAL(10, 2),
  `unit` VARCHAR(50),
  `minThreshold` DECIMAL(10, 2),
  `maxThreshold` DECIMAL(10, 2),
  `status` ENUM('active', 'inactive', 'error') DEFAULT 'active',
  `lastReadAt` DATETIME,
  `active` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sensorId (sensorId),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_location (location)
);

-- 4. Machines Table
CREATE TABLE IF NOT EXISTS `Machines` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `machineId` VARCHAR(255) NOT NULL UNIQUE,
  `machineName` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255),
  `installationDate` DATETIME,
  `lastMaintenanceDate` DATETIME,
  `nextMaintenanceDate` DATETIME,
  `operationalHours` INT DEFAULT 0,
  `status` ENUM('operational', 'maintenance', 'broken', 'idle') DEFAULT 'operational',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_machineId (machineId),
  INDEX idx_status (status),
  INDEX idx_location (location)
);

-- 5. Production Table
CREATE TABLE IF NOT EXISTS `Productions` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `productionDate` DATETIME NOT NULL,
  `plannedQuantity` DECIMAL(10, 2) NOT NULL,
  `actualQuantity` DECIMAL(10, 2),
  `wastage` DECIMAL(10, 2) DEFAULT 0,
  `trgScore` DECIMAL(5, 2),
  `startTime` DATETIME,
  `endTime` DATETIME,
  `shift` VARCHAR(50),
  `machineId` CHAR(36),
  `productType` VARCHAR(255),
  `issues` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (machineId) REFERENCES Machines(id),
  INDEX idx_productionDate (productionDate),
  INDEX idx_machineId (machineId),
  INDEX idx_productType (productType)
);

-- 6. Quality Control Table
CREATE TABLE IF NOT EXISTS `QualityControls` (
  `id` CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `lotId` CHAR(36) NOT NULL,
  `checkType` ENUM('hand_washing', 'knife_disinfection', 'surface_cleaning', 'material_reception', 'temperature_check', 'visual_inspection') NOT NULL,
  `status` ENUM('passed', 'failed', 'pending') DEFAULT 'pending',
  `temperature` DECIMAL(5, 2),
  `notes` TEXT,
  `photoUrl` VARCHAR(500),
  `checkedBy` CHAR(36) NOT NULL,
  `checkedAt` DATETIME NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lotId) REFERENCES Lots(id),
  FOREIGN KEY (checkedBy) REFERENCES Users(id),
  INDEX idx_lotId (lotId),
  INDEX idx_checkType (checkType),
  INDEX idx_status (status),
  INDEX idx_checkedAt (checkedAt)
);

-- Create indexes for performance
-- Note: FULLTEXT indexes removed due to MySQL compatibility with UNIQUE constraints

-- Sample Machines
INSERT INTO Machines (id, machineId, machineName, type, location, status) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'M001', 'Cutting Machine A', 'Cutter', 'Zone A', 'operational'),
('650e8400-e29b-41d4-a716-446655440002', 'M002', 'Grinding Machine B', 'Grinder', 'Zone B', 'operational'),
('650e8400-e29b-41d4-a716-446655440003', 'M003', 'Packaging Machine C', 'Packager', 'Zone C', 'operational');

-- Sample IoT Sensors
INSERT INTO IoTSensors (id, sensorId, sensorName, location, type, unit, minThreshold, maxThreshold, status) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'S001', 'Temperature Sensor Zone A', 'Zone A', 'temperature', '°C', 0, 25, 'active'),
('750e8400-e29b-41d4-a716-446655440002', 'S002', 'Humidity Sensor Zone B', 'Zone B', 'humidity', '%', 40, 70, 'active'),
('750e8400-e29b-41d4-a716-446655440003', 'S003', 'Pressure Sensor Zone C', 'Zone C', 'pressure', 'bar', 1, 3, 'active'),
('750e8400-e29b-41d4-a716-446655440004', 'S004', 'Vibration Sensor Machine A', 'Zone A', 'vibration', 'Hz', 0, 10, 'active'),
('750e8400-e29b-41d4-a716-446655440005', 'S005', 'Sound Sensor Zone B', 'Zone B', 'sound', 'dB', 60, 85, 'active');

-- Sample Lot
INSERT INTO Lots (id, qrCode, lotNumber, productType, quantity, unit, status, temperature, humidity, location) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'QR001', 'LOT-2025-001', 'Charcuterie', 500, 'kg', 'received', 18.5, 65, 'Zone A');

-- Display creation confirmation
SELECT 'Database setup complete!' AS status;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'atlas_smartfactory';

CREATE USER IF NOT EXISTS 'atlas_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'atlas_password';
CREATE USER IF NOT EXISTS 'atlas_user'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'atlas_password';
GRANT ALL PRIVILEGES ON atlas_smartfactory.* TO 'atlas_user'@'localhost';
GRANT ALL PRIVILEGES ON atlas_smartfactory.* TO 'atlas_user'@'127.0.0.1';
FLUSH PRIVILEGES;

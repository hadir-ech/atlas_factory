-- Create application MySQL user and grant privileges for atlas_smartfactory
CREATE USER IF NOT EXISTS 'atlas_user'@'localhost' IDENTIFIED BY 'atlas_password';
CREATE USER IF NOT EXISTS 'atlas_user'@'127.0.0.1' IDENTIFIED BY 'atlas_password';
GRANT ALL PRIVILEGES ON atlas_smartfactory.* TO 'atlas_user'@'localhost';
GRANT ALL PRIVILEGES ON atlas_smartfactory.* TO 'atlas_user'@'127.0.0.1';
FLUSH PRIVILEGES;

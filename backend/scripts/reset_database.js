const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  const rootUser = 'root';
  const rootPassword = ''; // assumes root has no password; change if needed
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  const sqlDir = path.resolve(__dirname, '..');
  const schemaFile = path.resolve(sqlDir, '..', 'DATABASE_SETUP.sql');
  const userSqlFile = path.resolve(__dirname, 'create_mysql_user.sql');

  if (!fs.existsSync(schemaFile)) {
    console.error('Schema file not found:', schemaFile);
    process.exit(2);
  }

  try {
    const schemaSql = fs.readFileSync(schemaFile, 'utf8');
    const userSql = fs.existsSync(userSqlFile) ? fs.readFileSync(userSqlFile, 'utf8') : '';

    console.log('Connecting to MySQL as root (host=%s port=%d)...', host, port);
    const conn = await mysql.createConnection({ host, port, user: rootUser, password: rootPassword, multipleStatements: true });

    console.log('Dropping existing database if exists and recreating...');
    // Drop DB first to ensure clean state
    await conn.query('DROP DATABASE IF EXISTS atlas_smartfactory;');
    await conn.query('CREATE DATABASE atlas_smartfactory;');

    if (userSql) {
      console.log('Applying user/grant SQL...');
      await conn.query(userSql);
    } else {
      console.log('No user SQL found, skipping user creation step.');
    }

    console.log('Applying schema SQL...');
    // Use the schema SQL directly; it creates and uses the DB in the file
    await conn.query(schemaSql);

    console.log('Schema and user setup complete.');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error during reset:', err.message || err);
    console.error(err);
    console.log('\nIf this fails:');
    console.log('- Confirm MySQL server is running and accessible on', host + ':' + port);
    console.log('- If root uses a password, set the `rootPassword` variable at the top of this file or export DB_ROOT_PASSWORD env var and modify the script accordingly.');
    console.log('\nYou can also run the SQL manually using MySQL Workbench.');
    process.exit(1);
  }
})();

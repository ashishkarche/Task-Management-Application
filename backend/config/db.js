require('dotenv').config();
const mysql = require('mysql2/promise');  // Use promise-based mysql2
const fs = require('fs');
const path = require('path');

// Create a connection pool to the TiDB Cloud database
const pool = mysql.createPool({
  host: process.env.DB_HOST,               
  user: process.env.DB_USER,               
  password: process.env.DB_PASSWORD,       
  database: process.env.DB_NAME,            
  ssl: {
    rejectUnauthorized: true,               
    ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')) // Path to the CA certificate
  }
});

// Export the pool for use in other modules
module.exports = pool;

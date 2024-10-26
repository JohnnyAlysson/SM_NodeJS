//definir a conexao mysql, importar sql
const mysql = require('mysql2/promise');

//definir a pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mysql102030',
  database: 'barbearia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar essa pool (conexao)
module.exports = pool;
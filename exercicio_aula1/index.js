const express = require('express');
const cors = require('cors');
const pool = require('./db.js');
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/buscar', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jogos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'DEU RUIM CARA', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log('DEU BOM');
});
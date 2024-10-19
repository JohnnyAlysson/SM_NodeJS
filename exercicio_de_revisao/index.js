const express = require('express');
const cors = require('cors');
const pool = require('./db.js');
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());


app.get('/verTodosFilmes', async (req,res)=>{
  try{
    const [rows] = await pool.query('SELECT * from filmes')
    res.json(rows);    
  }
  catch (error) {
    res.status(500).json({ message: 'Erro ao buscar filmes:', error });
  }
})

app.listen(PORT, () => {
  console.log('aplicacao executada com sucesso');
});
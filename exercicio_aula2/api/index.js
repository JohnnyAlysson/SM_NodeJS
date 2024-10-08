// importacoes
const express = require('express');
const cors = require('cors');
const pool = require('./db.js');
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Falha ao conectar no banco', error });
  }
});

app.post('/users', async(req,res) =>{ 
  const {email, password} = req.body;

  try{
    const consulta = 'INSERT INTO users (email,senha) VALUES ( ? , ? )' ;

    await pool.query(consulta,[email,password]);

    res.status(201).json({message:"Usuario adicionado"})

    
  }catch(error){
    res.status(500).json({ message: 'falha ao adicionar usuario', error });
  }
} )

app.listen(PORT, () => {
  console.log('DEU BOM');
});
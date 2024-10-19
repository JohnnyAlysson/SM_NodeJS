const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/verTodosFilmes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from filmes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar filmes:", error });
  }
});

app.post("/cadastrarFilme", async (req, res) => {
  const { titulo, genero, preco, faixa_etaria, status_aluguel } = req.body;

  try {
    const consulta =
      "INSERT INTO filmes (titulo, genero , preco , faixa_etaria, status_aluguel) VALUES ( ? , ? , ? , ? ,?)";

    await pool.query(consulta, [
      titulo,
      genero,
      preco,
      faixa_etaria,
      status_aluguel,
    ]);

    res.status(201).json({ message: "Filme cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "falha ao cadastrar filme", error });
  }
});

app.put("/filme/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, genero, preco, faixa_etaria, status_aluguel } = req.body;

  try {
    const consulta =
      "UPDATE filmes SET titulo = ?, genero = ? , preco = ? , faixa_etaria = ?, status_aluguel = ?) WHERE id = ?";

    await pool.query(consulta, [
      titulo,
      genero,
      preco,
      faixa_etaria,
      status_aluguel,
      id,
    ]);

    res.status(201).json({ message: "Filme atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "falha ao atualizar filme", error });
  }
});

app.delete("/filme/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const consulta =
      "DELETE FROM filmes WHERE id = ?";

    await pool.query(consulta, [
      id,
    ]);

    res.status(201).json({ message: "Filme deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "falha ao deletar filme", error });
  }
});

app.get("/verTodosClientes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar clientes:", error });
  }
});

app.post("/cadastrarCliente", async (req, res) => {
  const { titulo, genero, preco, faixa_etaria, status_aluguel } = req.body;

  try {
    const consulta =
      "INSERT INTO filmes (titulo, genero , preco , faixa_etaria, status_aluguel) VALUES ( ? , ? , ? , ? ,?)";

    await pool.query(consulta, [
      titulo,
      genero,
      preco,
      faixa_etaria,
      status_aluguel,
    ]);

    res.status(201).json({ message: "Filme cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "falha ao cadastrar filme", error });
  }
});

app.post("/alugarFilme", async (req, res) => {
  const { data_aluguel, id_cliente, id_filme } = req.body;

  try {
    const consulta =
      "INSERT INTO filmes (data_aluguel , id_cliente, id_filme) VALUES ( ? , ? , ? )";

    await pool.query(consulta, [data_aluguel, id_cliente, id_filme]);

    res.status(201).json({ message: "Filme cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "falha ao cadastrar filme", error });
  }
});

app.listen(PORT, () => {
  console.log("aplicacao executada com sucesso");
});

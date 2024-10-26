const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const PORT = 3000;

const app = express();


function converDate() {
  let date = new Date();
  let newDate = date.toISOString().slice(0, 19).replace('T', ' ');
  return newDate
}


app.use(cors());
app.use(express.json());


// FUNCIONÁRIOS
app.get("/funcionarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from funcionarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error ao pegar informações dos funcionarios:", error });
  }
});

app.post("/funcionario", async (req, res) => {
  const { nome, cpf,especialidade, salario } = req.body;

  try {
    const consulta =
      "INSERT INTO funcionarios(nome, cpf,especialidade, salario ) VALUES ( ? , ?, ? ,? )";

    await pool.query(consulta, [
      nome,
      cpf,
      especialidade,
      salario
    ]);

    res.status(201).json({ message: "funcionario adicionado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar o funcionario", error });
  }
});


app.put("/funcionario/:id", async (req, res) => {
  const {id} = req.params;
  
  // Log the received data
  console.log('Request Body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));

  try {
    const { nome, cpf, especialidade, salario } = req.body;

    // Validate that all required fields are present
    if (!nome || !cpf || !especialidade || !salario) {
      return res.status(400).json({ 
        message: "Todos os campos são obrigatórios",
        receivedData: req.body 
      });
    }

    const consulta =
      "UPDATE funcionarios SET nome = ?, cpf = ?, especialidade = ?, salario = ? WHERE id = ?";

    await pool.query(consulta, [
      nome,
      cpf,
      especialidade,
      salario,
      id
    ]);

    res.status(200).json({ message: "Funcionário atualizado" });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      message: "Erro ao atualizar o funcionário", 
      error: error.message 
    });
  }
});

app.delete("/funcionario/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM funcionarios WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(201).json({ message: "funcionario deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "error ao deletar funcionario", error });
  }
});



// CLIENTES
app.get("/clientes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error ao pegar informações dos clientes:", error });
  }
});

app.post("/cliente", async (req, res) => {
  const { nome, cpf } = req.body;

  try {
    const consulta =
      "INSERT INTO clientes(nome, cpf ) VALUES ( ? , ? )";

    await pool.query(consulta, [
      nome,
      cpf,
    ]);

    res.status(201).json({ message: "Cliente adicionado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar o cliente", error });
  }
});


app.put("/cliente/:id", async (req, res) => {
  const{id} = req.params;
  const { nome,cpf } = req.body;

  try {
    const consulta =
      "UPDATE clientes SET nome = ?,  cpf = ? WHERE id = ?";

    await pool.query(consulta, [
      nome,
      cpf,
      id
    ]);

    res.status(201).json({ message: "cliente atualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error ao atualizar o cliente", error });
  }
});

app.delete("/cliente/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM clientes WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(201).json({ message: "cliente deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "error ao deletar cliente", error });
  }
});

// PRODUTOS
app.get("/produtos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from produtos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao coletar produtos:", error });
  }
});

app.post("/produto", async (req, res) => {
  const { nome, preco,qtde } = req.body;

  try {
    const consulta =
      "INSERT INTO produtos(nome, preco,qtde ) VALUES ( ? , ?, ? )";

    await pool.query(consulta, [
      nome, 
      preco,
      qtde
    ]);

    res.status(201).json({ message: "Produto adicionar com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar o produto", error });
  }
});


app.put("/produto/:id", async (req, res) => {
  const{id} = req.params;
  const { nome, preco,qtde } = req.body;

  try {
    const consulta =
      "UPDATE produtos SET nome = ?,  preco = ? , qtde = ? WHERE id = ?";

    await pool.query(consulta, [
      nome, 
      preco,
      qtde,
      id
    ]);

    res.status(201).json({ message: "produto atualizado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o produto", error });
  }
});

app.delete("/produto/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM produtos WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(200).json({ message: "produtos deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Error ao deletarr o produto", error });
  }
});


// SERVIÇOS
app.get("/servicos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from servicos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao coletar servicos:", error });
  }
});

app.post("/servico", async (req, res) => {
  const { nome, preco } = req.body;

  try {
    const consulta =
      "INSERT INTO servicos(nome, preco ) VALUES ( ? , ? )";

    await pool.query(consulta, [
      nome, 
      preco,
    ]);

    res.status(201).json({ message: "servico adicionar com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar o servico", error });
  }
});


app.put("/servico/:id", async (req, res) => {
  const{id} = req.params;
  const { nome, preco } = req.body;

  try {
    const consulta =
      "UPDATE servicos SET nome = ?,  preco = ? WHERE id = ?";

    await pool.query(consulta, [
      nome, 
      preco,

      id
    ]);

    res.status(201).json({ message: "servico atualizado" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o servico", error });
  }
});

app.delete("/servico/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM servicos WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(200).json({ message: "servico deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Error ao deletar o servico", error });
  }
});




app.get("/invoices", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from invoices");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error while getting invoices:", error });
  }
});


app.post("/invoice", async (req, res) => {
  const { sell_data, id_produto,id_cliente } = req.body;


  let newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {

    const consulta =
      "INSERT INTO invoices(sell_data, id_produto,id_cliente ) VALUES ( ? , ?, ? )";

    await pool.query(consulta, [
      newDate, 
      id_produto,
      id_cliente
    ]);

    res.status(201).json({ message: "invoice added sucesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while adding invoice", error });
    console.log(`${sell_data}`)
  }
});


app.put("/invoice/:id", async (req, res) => {
  // May be not necessary
  const{id} = req.params;
  const { sell_data, id_produto,id_cliente } = req.body;

  try {
    const consulta =
      "UPDATE invoices SET sell_data = ?,  id_produto = ? , id_cliente = ? WHERE id = ?";

    await pool.query(consulta, [
      sell_data, 
      id_produto,
      id_cliente,
      id
    ]);

    res.status(201).json({ message: "invoice updated" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating invoice", error });
  }
});

app.delete("/invoice/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM invoices WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(200).json({ message: "invoices deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting invoices", error });
  }
});



app.listen(PORT, () => {
  console.log("aplicacao rodando");
});
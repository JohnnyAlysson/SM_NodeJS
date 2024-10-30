const express = require("express");
const cors = require("cors");
const pool = require("./db.js");
const PORT = 3000;

const app = express();

const formatDate = () => {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

const handleError = (res, message, error) => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({ message, error: error.message });
};

app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.get("/funcionarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from funcionarios");
    res.json(rows);
  } catch (error) {
    handleError(res, "Error ao pegar informações dos funcionarios", error);
  }
});

app.post("/funcionario", async (req, res) => {
  const { nome, cpf, especialidade, salario } = req.body;

  if (!nome || !cpf || !especialidade || !salario) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO funcionarios(nome, cpf, especialidade, salario) VALUES (?, ?, ?, ?)",
      [nome, cpf, especialidade, salario]
    );

    res.status(201).json({
      message: "Funcionário adicionado",
      id: result.insertId,
      data: { nome, cpf, especialidade, salario },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "CPF já cadastrado" });
    }
    handleError(res, "Erro ao adicionar o funcionario", error);
  }
});

app.put("/funcionario/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, cpf, especialidade, salario } = req.body;

  if (!nome || !cpf || !especialidade || !salario) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE funcionarios SET nome = ?, cpf = ?, especialidade = ?, salario = ? WHERE id = ?",
      [nome, cpf, especialidade, salario, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.status(200).json({ message: "Funcionário atualizado" });
  } catch (error) {
    handleError(res, "Erro ao atualizar o funcionário", error);
  }
});

app.delete("/funcionario/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM funcionarios WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    res.status(200).json({ message: "Funcionário deletado com sucesso" });
  } catch (error) {
    handleError(res, "Erro ao deletar funcionario", error);
  }
});

app.get("/clientes", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from clientes");
    res.json(rows);
  } catch (error) {
    handleError(res, "Error ao pegar informações dos clientes", error);
  }
});

app.post("/cliente", async (req, res) => {
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO clientes(nome, cpf) VALUES (?, ?)",
      [nome, cpf]
    );

    res.status(201).json({
      message: "Cliente adicionado",
      id: result.insertId,
      data: { nome, cpf },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "CPF já cadastrado" });
    }
    handleError(res, "Erro ao adicionar o cliente", error);
  }
});

app.put("/cliente/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, cpf } = req.body;

  if (!nome || !cpf) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE clientes SET nome = ?, cpf = ? WHERE id = ?",
      [nome, cpf, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    res.status(200).json({ message: "Cliente atualizado" });
  } catch (error) {
    handleError(res, "Erro ao atualizar o cliente", error);
  }
});

app.delete("/cliente/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    res.status(200).json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    handleError(res, "Erro ao deletar cliente", error);
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from produtos");
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao coletar produtos", error);
  }
});

app.post("/produto", async (req, res) => {
  const { nome, preco, qtde } = req.body;

  if (!nome || !preco || !qtde) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO produtos(nome, preco, qtde) VALUES (?, ?, ?)",
      [nome, preco, qtde]
    );

    res.status(201).json({
      message: "Produto adicionado com sucesso",
      id: result.insertId,
      data: { nome, preco, qtde },
    });
  } catch (error) {
    handleError(res, "Erro ao adicionar o produto", error);
  }
});

app.put("/produto/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, qtde } = req.body;

  if (!nome || !preco || !qtde) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE produtos SET nome = ?, preco = ?, qtde = ? WHERE id = ?",
      [nome, preco, qtde, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json({ message: "Produto atualizado" });
  } catch (error) {
    handleError(res, "Erro ao atualizar o produto", error);
  }
});

app.delete("/produto/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM produtos WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    handleError(res, "Erro ao deletar o produto", error);
  }
});

app.get("/servicos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from servicos");
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao coletar servicos", error);
  }
});

app.post("/servico", async (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO servicos(nome, preco) VALUES (?, ?)",
      [nome, preco]
    );

    res.status(201).json({
      message: "Serviço adicionado com sucesso",
      id: result.insertId,
      data: { nome, preco },
    });
  } catch (error) {
    handleError(res, "Erro ao adicionar o servico", error);
  }
});

app.put("/servico/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;

  if (!nome || !preco) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE servicos SET nome = ?, preco = ? WHERE id = ?",
      [nome, preco, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.status(200).json({ message: "Serviço atualizado" });
  } catch (error) {
    handleError(res, "Erro ao atualizar o servico", error);
  }
});

app.delete("/servico/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM servicos WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.status(200).json({ message: "Serviço deletado com sucesso" });
  } catch (error) {
    handleError(res, "Erro ao deletar o servico", error);
  }
});

app.get("/vendas_produtos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vendas_produtos");
    res.json(rows);
  } catch (error) {
    handleError(
      res,
      "Erro ao coletar informações sobre vendas de produtos",
      error
    );
  }
});

app.post("/vendas_produtos", async (req, res) => {
  const { id_cliente, id_produto } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [clientCheck] = await connection.query(
      "SELECT id FROM clientes WHERE id = ?",
      [id_cliente]
    );
    if (!clientCheck.length) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const [productCheck] = await connection.query(
      "SELECT id, qtde FROM produtos WHERE id = ?",
      [id_produto]
    );
    if (!productCheck.length) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (productCheck[0].qtde < 1) {
      return res.status(400).json({ message: "Produto fora de estoque" });
    }

    await connection.query(
      "INSERT INTO vendas_produtos(data, id_cliente, id_produto) VALUES (?, ?, ?)",
      [formatDate(), id_cliente, id_produto]
    );

    await connection.query("UPDATE produtos SET qtde = qtde - 1 WHERE id = ?", [
      id_produto,
    ]);

    await connection.commit();
    res.status(201).json({ message: "Venda adicionada com sucesso" });
  } catch (error) {
    await connection.rollback();
    handleError(res, "Erro ao adicionar venda", error);
  } finally {
    connection.release();
  }
});

app.get("/vendas_servicos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vendas_servicos");
    res.json(rows);
  } catch (error) {
    handleError(
      res,
      "Erro ao coletar informações sobre vendas de serviços",
      error
    );
  }
});

app.post("/vendas_servicos", async (req, res) => {
  const { id_cliente, id_servico, id_funcionario } = req.body;

  try {
    const [clientCheck] = await pool.query(
      "SELECT id FROM clientes WHERE id = ?",
      [id_cliente]
    );
    if (!clientCheck.length) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const [serviceCheck] = await pool.query(
      "SELECT id FROM servicos WHERE id = ?",
      [id_servico]
    );
    if (!serviceCheck.length) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    const [employeeCheck] = await pool.query(
      "SELECT id FROM funcionarios WHERE id = ?",
      [id_funcionario]
    );
    if (!employeeCheck.length) {
      return res.status(404).json({ message: "Funcionário não encontrado" });
    }

    await pool.query(
      "INSERT INTO vendas_servicos(data, id_cliente, id_servico, id_funcionario) VALUES (?, ?, ?, ?)",
      [formatDate(), id_cliente, id_servico, id_funcionario]
    );

    res
      .status(201)
      .json({ message: "Venda de serviço adicionada com sucesso" });
  } catch (error) {
    handleError(res, "Erro ao adicionar venda de serviço", error);
  }
});

app.get("/vendas_por_periodo", async (req, res) => {
  const { inicio, fim } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT DATE(data) as data, 
      COUNT(*) as total_vendas, 
      SUM(p.preco) as valor_total 
      FROM vendas_produtos vp 
      JOIN produtos p ON vp.id_produto = p.id 
      WHERE data BETWEEN ? AND ? 
      GROUP BY DATE(data)`,
      [inicio, fim]
    );
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao buscar vendas por período", error);
  }
});

app.get("/vendas_servicos_por_periodo", async (req, res) => {
  const { inicio, fim } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT DATE(data) as data, 
        COUNT(*) as total_vendas, 
        SUM(s.preco) as valor_total 
        FROM vendas_servicos vs 
        JOIN servicos s ON vs.id_servico = s.id 
        WHERE data BETWEEN ? AND ? 
        GROUP BY DATE(data)`,
      [inicio, fim]
    );
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao buscar vendas de serviços por período", error);
  }
});

app.get("/funcionarios/producao", async (req, res) => {
  const { inicio, fim } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT f.nome, 
      COUNT(*) as total_servicos, 
      SUM(s.preco) as valor_total 
      FROM vendas_servicos vs 
      JOIN funcionarios f ON vs.id_funcionario = f.id 
      JOIN servicos s ON vs.id_servico = s.id 
      WHERE data BETWEEN ? AND ? 
      GROUP BY f.id, f.nome`,
      [inicio, fim]
    );
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao buscar produção dos funcionários", error);
  }
});

app.get("/produtos/mais_vendidos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.nome, 
      COUNT(*) as quantidade_vendida, 
      SUM(p.preco) as valor_total 
      FROM vendas_produtos vp 
      JOIN produtos p ON vp.id_produto = p.id 
      GROUP BY p.id, p.nome 
      ORDER BY quantidade_vendida DESC 
      LIMIT 5`
    );
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao buscar produtos mais vendidos", error);
  }
});

app.get("/servicos/mais_vendidos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.nome, 
      COUNT(*) as quantidade_vendida, 
      SUM(s.preco) as valor_total 
      FROM vendas_servicos vs 
      JOIN servicos s ON vs.id_servico = s.id 
      GROUP BY s.id, s.nome 
      ORDER BY quantidade_vendida DESC 
      LIMIT 5`
    );
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao buscar serviços mais vendidos", error);
  }
});

app.get("/estoque/produtos_baixos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT nome, qtde 
      FROM produtos 
      WHERE qtde <= 5 
      ORDER BY qtde ASC`
    );
    res.json(rows);
  } catch (error) {
    handleError(res, "Erro ao buscar produtos com estoque baixo", error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

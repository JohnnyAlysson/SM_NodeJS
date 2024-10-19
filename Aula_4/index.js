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

app.get("/clients", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from clients");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error while getting customers:", error });
  }
});

app.post("/client", async (req, res) => {
  const { name, cpf } = req.body;

  try {
    const consulta =
      "INSERT INTO clients(name, cpf ) VALUES ( ? , ? )";

    await pool.query(consulta, [
      name,
      cpf,
    ]);

    res.status(201).json({ message: "Client added sucesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while adding client", error });
  }
});


app.put("/client/:id", async (req, res) => {
  const{id} = req.params;
  const { name,cpf } = req.body;

  try {
    const consulta =
      "UPDATE clients SET name = ?,  cpf = ? WHERE id = ?";

    await pool.query(consulta, [
      name,
      cpf,
      id
    ]);

    res.status(201).json({ message: "Client updated" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating client", error });
  }
});

app.delete("/client/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM clients WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(201).json({ message: "Client deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting client", error });
  }
});


app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * from products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error while getting products:", error });
  }
});

app.post("/product", async (req, res) => {
  const { name, preco,qtde } = req.body;

  try {
    const consulta =
      "INSERT INTO products(name, preco,qtde ) VALUES ( ? , ?, ? )";

    await pool.query(consulta, [
      name, 
      preco,
      qtde
    ]);

    res.status(201).json({ message: "product added sucesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while adding product", error });
  }
});


app.put("/product/:id", async (req, res) => {
  const{id} = req.params;
  const { name, preco,qtde } = req.body;

  try {
    const consulta =
      "UPDATE products SET name = ?,  preco = ? , qtde = ? WHERE id = ?";

    await pool.query(consulta, [
      name, 
      preco,
      qtde,
      id
    ]);

    res.status(201).json({ message: "product updated" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating product", error });
  }
});

app.delete("/product/:id", async (req, res) => {
  const{id} = req.params;

  try {
    const consulta =
      "DELETE FROM products WHERE ID = ? ";

    await pool.query(consulta, [
      id
    ]);

    res.status(200).json({ message: "products deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting products", error });
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
  const { sell_data, id_product,id_client } = req.body;

  //converting date
  let newDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {

    const consulta =
      "INSERT INTO invoices(sell_data, id_product,id_client ) VALUES ( ? , ?, ? )";

    await pool.query(consulta, [
      newDate, 
      id_product,
      id_client
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
  const { sell_data, id_product,id_client } = req.body;

  try {
    const consulta =
      "UPDATE invoices SET sell_data = ?,  id_product = ? , id_client = ? WHERE id = ?";

    await pool.query(consulta, [
      sell_data, 
      id_product,
      id_client,
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
  console.log("aplication running");
});
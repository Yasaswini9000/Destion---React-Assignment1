const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./products.db");

// Create products table
db.run(
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    product_name TEXT,
    price REAL,
    stock INTEGER
  )`
);

// Get all products
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new product
app.post("/products", (req, res) => {
  const { store_name, product_name, price, stock } = req.body;

  db.run(
    `INSERT INTO products (store_name, product_name, price, stock)
    VALUES (?, ?, ?, ?)`,
    [store_name, product_name, price, stock],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Update a product
app.put("/products/:id", (req, res) => {
  const { store_name, product_name, price, stock } = req.body;
  const { id } = req.params;

  db.run(
    `UPDATE products SET store_name = ?, product_name = ?, price = ?, stock = ? WHERE id = ?`,
    [store_name, product_name, price, stock, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM products WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

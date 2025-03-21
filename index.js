import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke Database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "openapi",
  password: "",
});

// Cek Koneksi Database
db.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal:", err);
  } else {
    console.log("Terhubung ke database MySQL");
  }
});

// GET Semua User
app.get("/users", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json(results);
  });
});

// GET User Berdasarkan ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM user WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

// DELETE User Berdasarkan ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM user WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }
    res.status(200).json({ message: "User berhasil dihapus" });
  });
});

// UPDATE User Berdasarkan ID
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res
      .status(400)
      .json({ error: "Semua field (name, email, age) harus diisi" });
  }

  db.query(
    "UPDATE user SET name = ?, email = ?, age = ?, updatedAt = NOW() WHERE id = ?",
    [name, email, age, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "User tidak ditemukan" });
        return;
      }
      res.status(200).json({ message: "User berhasil diperbarui" });
    }
  );
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
     host: "localhost",
     user: "root",
     // password: "123",
     database: "usersdata",
});

db.connect((err) => {
     if (err) {
          console.error("DB connection error:", err);
          process.exit(1);
     }
     console.log("Connected to MySQL");
});

app.get("/api/users", (req, res) => {
     const sql = "SELECT * FROM users";
     db.query(sql, (err, results) => {
          if (err) {
               return res.status(500).json({ error: err.message });
          }
          res.status(200).json(results);
     });
});

app.post("/api/users", (req, res) => {
     const { username, email } = req.body;
     if (!username || !email) {
          return res
               .status(400)
               .json({ error: "username and email are required" });
     }
     const sql = "INSERT INTO users (username, email) VALUES (?, ?)";
     db.query(sql, [username, email], (err, result) => {
          if (err) {
               return res.status(500).json({ error: "Database error" });
          }
          res.status(201).json({ message: "User added", id: result.insertId });
     });
});

// add UPDATE route used by frontend
app.put("/api/users/:id", (req, res) => {
     // expect username and email to match frontend
     const { username, email } = req.body;
     if (!username || !email) {
          return res
               .status(400)
               .json({ error: "username and email are required" });
     }

     const sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
     db.query(sql, [username, email, req.params.id], (err, result) => {
          if (err) {
               return res.status(500).json({ error: err.message });
          }
          res.json({ message: "User updated" });
     });
});

// add DELETE route used by frontend
app.delete("/api/users/:id", (req, res) => {
     const sql = "DELETE FROM users WHERE id = ?";
     db.query(sql, [req.params.id], (err, result) => {
          if (err) {
               return res.status(500).json({ error: err.message });
          }
          res.json({ message: "User deleted" });
     });
});

app.listen(3000, () => console.log("server running on http://localhost:3000"));

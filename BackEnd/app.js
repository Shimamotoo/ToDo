import express, { json } from "express";
import cors from "cors";
import db from "./database/db.js";

const app = express();

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

app.get("/teste-db", (req, res) => {
  db.query("SELECT 1 + 1 AS resultado", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Server rodando na porta 3000");
});

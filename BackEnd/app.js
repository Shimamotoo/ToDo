//Express: framework para Node.js que facilita a criação de servidores web

//Servidor HTTP: Abre uma porta | Recebe requisições HTTP | Envia respostas

//Aplicação Express: Guarda todas as rotas | Guarda os middlewares | Decide como responder às requisições

// "express" => criar um aplicação | "{json}" => serve para ler o json que vem da requisição
import express, { json } from "express";

//Permite que o frontend em outra porta/domínio acesse o backend
import cors from "cors";

//Faz a importação da conexão com o banco
import db from "./database/db.js";

//Importa o arquivo de rotas de tarefas
import taskRoutes from "./routes/taskRoutes.js";

//Cria a aplicação Express, que encapsula o servidor HTTP
const app = express();

//Ativa CORS para todas as rotas
app.use(cors());

//Leitura de JSON
app.use(json());

//Toda requisição que começar com "/tasks" ira executar o (router) do taskRoutes
app.use("/tasks", taskRoutes);

//Cria um rota simples com o intuito de testar se o servidor está rodando 
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

//Testa a conexão com o banco de dados(Essa rota é temporária, usada só para debug) | REMOVER DEPOIS
app.get("/teste-db", (req, res) => {
  db.query("SELECT 1 + 1 AS resultado", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

//Abre a porta 3000 e começa a “escutar” requisições HTTP
app.listen(3000, () => {
  console.log("Server rodando na porta 3000");
});

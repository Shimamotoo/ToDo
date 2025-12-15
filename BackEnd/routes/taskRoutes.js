// Criar mini-aplicações de rotas, separadas do app.js
import { Router } from "express";

//Criar um link com o banco de dados
import db from "../database/db.js";

/**
* Permite os acessos aos métodos HTTP "GET" / "PUT" / "DELETE" / "POST" |
* router.get /
* router.put /
* router.delete /
* router.post /
*/
const router = Router();
 
router.get("/", (req, res) => {
    /**
     * Query para ser executada dentro do banco
     *  */     
    const sqlQuery = "SELECT * FROM tasks";

    //db.query envia a query para o banco de dados
    //Método assíncrono, envia a query e espera o retorno dela
    //(err) = caso de erro, console.error(err) faz o console do erro
    //(results) = retorna um JSON com o resultado da query
    db.query(sqlQuery, (err, results) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar tarefas" });
        }

    res.json(results);
  });
});


router.post("/", (req, res) => {

  //Desestrutura o req.body e pegando apenas o campo titulo
  const {titulo} = req.body;

  //Caso o titulo não tenha sido informado retorna um erro
  if(!titulo) {
    return res.status(400).json({ erro: "Título da tarefa é obrigatório." });
  }

  //Variavel que contem a query que sera enviada ao banco
  const sqlQuery = "INSERT INTO tasks (titulo) VALUES (?)";

  //Envia a query para o banco de dados
  //Envia o valor do titulo
  //Método assíncrono, envia a query e espera o retorno dela
  db.query(sqlQuery, [titulo],(err, result) => {

    //(err) = caso de erro, console.error(err) faz o console do erro
    if(err){
      console.error(err);
      return res.status(500).json({ error:"Erro ao adicionar tarefa" });
    }

    //Retorna ao cliente o id, titulo e se está completo a tarefa
    res.status(201).json({
      id:result.insertId,
      titulo,
      completo: false,
    });
  });
});

export default router;


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
    const sqlQuery = "SELECT * FROM tasks ORDER BY criado DESC";

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


router.put("/:id",(req, res) => {

  //Passa o id na URL não no body, então envia com params
  const { id } = req.params;

  //Desestrutura o req.body e pegando apenas o campo titulo e completo
  const { titulo, completo } = req.body;

  //Caso o titulo não tenha sido informado retorna um erro
  if(!titulo) {
    return res.status(400).json({ erro: "Título da tarefa é obrigatório." });
  }
  
  //Variavel que contem a query que sera enviada ao banco
  const sqlQuery = `
    UPDATE tasks
    SET titulo = ?, completo = ?
    WHERE id = ?
  `;

  //Envia a query para o banco de dados
  //Envia o valor do titulo
  //Envia o valor do completo
  //Envia o valor do id
  //Método assíncrono, envia a query e espera o retorno dela
  db.query(sqlQuery, [titulo, completo, id], (err, result) => {

    //(err) = caso de erro, console.error(err) faz o console do erro
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }

    //Caso nenhuma linha tenha sido afetada(ou seja ninguem foi alterado) retorna um erro ao cliete
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    //Retorna ao cliente o id e os campos alterados
    res.json({
      id,
      titulo,
      completo,
    });    
  });
});

router.delete("/:id",(req, res) => {
  const { id } = req.params;

  const sqlQuery = `
    DELETE FROM tasks
    WHERE id = ?
  `;

  db.query(sqlQuery, [id],(err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao deletar tarefa" });
    }  

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }    
    
    res.json({
      message: `Tarefa com id ${id} foi deletada com sucesso`
    });
  });
});

export default router;


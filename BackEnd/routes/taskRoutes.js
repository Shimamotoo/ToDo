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
    const sql = "SELECT * FROM tasks";

    //db.query envia a query para o banco de dados
    //Método assíncrono, envia a query e espera o retorno dela
    //(err) = caso de erro, console.error(err) faz o console do erro
    //(results) = retorna um JSON com o resultado da query
    db.query(sql, (err, results) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao buscar tarefas" });
        }

    res.json(results);
  });
});

export default router;


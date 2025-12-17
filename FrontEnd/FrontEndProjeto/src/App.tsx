import { useEffect, useState } from 'react';
import { taskService } from './services/taskService';
import './App.css'
import type { Task } from './types/Task';
import { TaskItem } from "./components/TaskItem";

function App() {

  // Cria um estado para armazenar a lista de tarefas e começa vazia
  const [tasks, setTasks] = useState<Task[]>([]);

  // Cria um estado para controlar o carregamento inicial da aplicação
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");

  //Assim que o componente é montado pela primeira vez ele roda "loadTasks"
  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    //Previne que o navegador de um reload na pagina
    //bagunçando os estados
    e.preventDefault();

    //Se o campo de input estiver não faz nada, tira os espaços em branco
    if (!newTitle.trim()) return;

    try {
      //Método responsavel por chamar o taskService
      //e enviar ao back-end o valor do input para manda o POST
      const newTask = await taskService.create(newTitle);

      //Pega o setado mais recente da array de tarefas antes de qualquer alteração
      //então adiciona a nova tarefa que o back adicionou
      setTasks(prev => [...prev, newTask]);

      //Deixa em branco o campo para estar pronto para adicionar outra tarefa
      setNewTitle("");
    } catch (error) {
      //Tratativa de erro
      console.error(error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      //Ao clicar em um tarefa percorre a array de tarefaS para achar o tarefa que bate o id
      //serve apenas para selecionar o tarefa, não faz alterações
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      //Envia a o tarefa selecionado para o backend,
      //copiando todas as propriedades e invertendo o campo "completo"      
      await taskService.update({
        ...task,
        completo: !task.completo,
      });

      //Ao clicar em um tarefa ercorre a array de tarefaS para achar o tarefa que bate o id
      //o id que bater cria um novo objeto com o valor de completo invertido
      //IMPORTANTE: "prev" é o estado MAIS RECENTE da array antes deste update   
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, completo: !t.completo } : t
        )
      );
    } catch (error) {
      //Tratativa de erro
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      //Ao clicar no botão "Deletar", recebe o id da tarefa via onClick
      //envia esse id para o backend para remover a tarefa do banco de dados
      await taskService.delete(id);

      //Filter cria uma nova array
      //mantém apenas as tasks cujo id seja diferente do id deletado
      //a tarefa com id igual retorna false e é removida da lista
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      //Tratativa de erro
      console.error(error);
    }
  };
  

  // Função assíncrona responsável por buscar as tarefas no backend
  const loadTasks = async() => {
    try{
      // Retorno de uma Promise com a lista de tarefas
      const data = await taskService.getAll();
      setTasks(data)
    }
    //Trata o erro da Promise
    catch(error) {
      console.error(error)
    }
    // Finaliza o estado de carregamento
    finally{
      setLoading(false)
    }
  };

  //Apresentado enquanto o valor de loading for true
  if (loading) {
    return <p>Carregando...</p>;
  }
  
  //Quando loading não for mais true, renderiza esse trecho
  return(
    <div className="min-h-screen p-6 bg-gray-300">
      <h1 className="mb-4 text-3xl font-bold text-blue-600">Minhas tarefas</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Nova tarefa"
          className="flex-1 p-2 border rounded"
        />

        <button
          type="submit"
          className="px-4 text-white bg-blue-600 rounded"
        >
          Adicionar
        </button>
      </form>


      <ul className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  )
}

export default App;

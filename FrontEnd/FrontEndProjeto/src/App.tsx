import { useEffect, useState } from "react";
import { taskService } from "./services/taskService";
import "./App.css";
import type { Task } from "./types/Task";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";

function App() {
  //Cria um estado para armazenar a lista de tarefas e começa vazia
  const [tasks, setTasks] = useState<Task[]>([]);

  //Cria um estado para controlar o carregamento inicial da aplicação
  const [loading, setLoading] = useState(true);

  //Cria um estado para controlar o carregamento da criação de tarefa
  const [creating, setCreating] = useState(false);

  //Assim que o componente é montado pela primeira vez ele roda "loadTasks"
  useEffect(() => {
    loadTasks();
  }, []);

  //Função responsável por buscar as tarefas no backend
  const loadTasks = async () => {
    try {
      // Retorno de uma Promise com a lista de tarefas
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      //Trata o erro da Promise
      console.error(error);
    } finally {
      // Finaliza o estado de carregamento
      setLoading(false);
    }
  };

  //Função responsável por adicionar as tarefas no na lista
  const handleCreate = async (title: string) => {
    try {
      //Começa a função de adicionar a tarefa desabilitando o botão
      setCreating(true);

      //Método responsavel por chamar o taskService
      //e enviar ao back-end o valor do input para manda o POST
      const newTask = await taskService.create(title);

      //Pega o estado mais recente da array de tarefas antes de qualquer alteração
      //então adiciona a nova tarefa que o back adicionou
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      //Tratativa de erro
      console.error(err);
    } finally {
      // Re-habilita o botão mesmo que tenha dado erro
      setCreating(false);
    }
  };

  //Função responsável completar as tarefas
  const handleToggle = async (id: number) => {
    try {
      //Ao clicar em um tarefa percorre a array de tarefaS para achar o tarefa que bate o id
      //serve apenas para selecionar o tarefa, não faz alterações
      const task = tasks.find((t) => t.id === id);
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
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completo: !t.completo } : t))
      );
    } catch (error) {
      //Tratativa de erro
      console.error(error);
    }
  };

  // Função responsável deletar as tarefas
  const handleDelete = async (id: number) => {
    // Abre um popup de confirmação
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta tarefa?"
    );

    // Se o usuário clicar em "Cancelar"
    if (!confirmed) return;

    try {
      //Ao clicar no botão "Deletar", recebe o id da tarefa via onClick
      //envia esse id para o backend para remover a tarefa do banco de dados
      await taskService.delete(id);

      //Filter cria uma nova array
      //mantém apenas as tasks cujo id seja diferente do id deletado
      //a tarefa com id igual retorna false e é removida da lista
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      //Tratativa de erro
      console.error(error);
    }
  };

  //Apresentado enquanto o valor de loading for true
  if (loading) {
    return <p>Carregando...</p>;
  }

  //Quando loading não for mais true, renderiza esse trecho
  return (
    <div className="flex justify-center min-h-screen p-6 font-sans bg-gray-300">
      <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="mb-4 text-2xl font-bold text-center text-gray-800 ">
          ✅ Minhas Tarefas
        </h1>

        <TaskForm onCreate={handleCreate} loading={creating} />

        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;

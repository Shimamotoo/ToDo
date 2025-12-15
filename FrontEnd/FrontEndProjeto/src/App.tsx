import { useEffect, useState } from 'react';
import { taskService } from './services/taskService';
import './App.css'
import type { Task } from './types/Task';

function App() {

  // Cria um estado para armazenar a lista de tarefas e começa vazia
  const [tasks, setTasks] = useState<Task[]>([]);

  // Cria um estado para controlar o carregamento inicial da aplicação
  const [loading, setLoading] = useState(true);

  //Assim que o componente é montado pela primeira vez ele roda "loadTasks"
  useEffect(() => {
    loadTasks();
  }, []);

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
    <div className="min-h-screen bg-gray-300 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Minhas tarefas</h1>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.titulo} {task.completo ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App;

import type { Task } from "../types/Task";

//Props: dados que o componente TaskItem ira receber
//Recebe uma task com id, titulo, completo e criado
type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

//Desestruturamos TaskItemProps pegando apenas a propriedade "task"
//podendo utilizar task.id | task.titulo ...
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <li   className="flex items-center gap-3 p-4 transition shadow-sm bg-gray-50 rounded-xl hover:shadow-md">

            <button onClick={() => onToggle(task.id)} className="px-2 py-1 text-sm text-green-600 transition rounded hover:bg-green-100 whitespace-nowrap">
                Concluir
            </button>

            <span
                className={`
                    flex-1
                    truncate
                    ${task.completo ? "line-through text-gray-400" : "text-gray-800"}
                `}
            >
            {task.titulo}
            </span>
            
            <span className="text-lg">
                {task.completo ? "✅" : "⏳"}
            </span>            

            <button 
                onClick={() => onDelete(task.id)}
                className="px-2 py-1 text-sm text-red-500 transition rounded hover:bg-red-100 whitespace-nowrap"
            >
                Deletar
            </button>

        </li>
    );
}

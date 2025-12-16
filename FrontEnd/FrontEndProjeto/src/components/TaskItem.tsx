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
        <li className="flex items-center justify-between p-3 bg-white rounded shadow mb-2">

            <button onClick={() => onToggle(task.id)}>
            Concluir
            </button>

            <span
                className={`${
                    /* Se task.completo for true, risca o item
                    se for false, não aplica estilização */
                    task.completo ? "line-through text-gray-400" : ""
                }`}
            >
            {task.titulo}
            </span>

            {/* Se task.completo for true mostra ✅
                se for false mostra ❌ */}
            <span className="text-xl">
                {task.completo ? "✅" : "❌"}
            </span>

            <button onClick={() => onDelete(task.id)}>
            Deletar
            </button>

        </li>
    );
}

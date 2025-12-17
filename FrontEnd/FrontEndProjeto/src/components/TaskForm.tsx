import { useState } from "react";

type TaskFormProps = {
  //Reponsavel por enviar o valor do input ao Pai
  onCreate: (title: string) => void;

  //Controla do estado de loading para determinar quando habilitar ou desabilitar o botão
  loading?: boolean;
};

export function TaskForm({ onCreate, loading }: TaskFormProps) {
  //Controla o estado do titulo
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    //Previne que o navegador de um reload na pagina
    //bagunçando os estados
    e.preventDefault();

    //Se o campo de input estiver não faz nada, tira os espaços em branco
    if (!title.trim()) return;

    onCreate(title);

    //Deixa em branco o campo para estar pronto para adicionar outra tarefa
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nova tarefa..."
        className="flex-1 p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-white bg-blue-600 rounded disabled:opacity-50"
      >
        Adicionar
      </button>
    </form>
  );
}

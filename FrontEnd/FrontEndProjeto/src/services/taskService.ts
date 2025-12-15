import api from "./api";
import type { Task } from "../types/Task";

export const taskService = {
    
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>("/tasks");

    return response.data.map(task => ({
      ...task,
      completo: Boolean(task.completo),
    }));
  },

  create: async (titulo: string): Promise<Task> => {
    const response = await api.post<Task>("/tasks", { titulo });
    return response.data;
  },

  update: async (task: Task): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${task.id}`, task);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

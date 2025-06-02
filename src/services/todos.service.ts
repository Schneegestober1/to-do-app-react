import axios from "axios";
import type { ITodos } from "../type";

class TodosService {
  private URL = 'http://localhost:3000/todos';

  async getTodos(): Promise<ITodos[]> {
    const { data } = await axios.get<ITodos[]>(this.URL);
    return data;
  }

  async addTodo(text: string): Promise<ITodos> {
    const { data } = await axios.post<ITodos>(this.URL, {
      text,
      completed: false,
    });
    return data;
  }

  async deleteTodo(id: number): Promise<void> {
    await axios.delete(`${this.URL}/${id}`);
  }

  async toggleTodo(id: number, completed: boolean): Promise<ITodos> {
    const { data } = await axios.patch<ITodos>(`${this.URL}/${id}`, { completed });
    return data;
  }

  async deleteCompleted(): Promise<void> {
    const todos = await this.getTodos();
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(todo => axios.delete(`${this.URL}/${todo.id}`))
    );
  }
}

export const todosService = new TodosService();

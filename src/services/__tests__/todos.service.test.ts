import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { ITodos } from '../../type';
import { todosService } from '../todos.service';


const mock = new MockAdapter(axios);
const baseUrl = 'http://localhost:3000/todos';

describe('TodosService', () => {
  afterEach(() => {
    mock.reset();
  });

  const mockTodo: ITodos = {
    id: 1,
    text: 'Test todo',
    completed: false,
  };

  test('getTodos should return todos', async () => {
    mock.onGet(baseUrl).reply(200, [mockTodo]);

    const todos = await todosService.getTodos();
    expect(todos).toEqual([mockTodo]);
  });

  test('addTodo should send POST request and return new todo', async () => {
    const text = 'New Task';
    const newTodo = { id: 2, text, completed: false };

    mock.onPost(baseUrl).reply(201, newTodo);

    const result = await todosService.addTodo(text);
    expect(result).toEqual(newTodo);
  });

  test('deleteTodo should send DELETE request', async () => {
    const id = 1;

    mock.onDelete(`${baseUrl}/${id}`).reply(200);

    await expect(todosService.deleteTodo(id)).resolves.toBeUndefined();
  });

  test('toggleTodo should send PATCH request and return updated todo', async () => {
    const updatedTodo = { ...mockTodo, completed: true };

    mock.onPatch(`${baseUrl}/${mockTodo.id}`).reply(200, updatedTodo);

    const result = await todosService.toggleTodo(mockTodo.id, true);
    expect(result).toEqual(updatedTodo);
  });
});

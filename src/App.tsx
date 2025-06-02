import { useState } from 'react';
import './App.css';
import { ChevronDown, Circle, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosService } from './services/todos.service';

function App() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos list'],
    queryFn: () => todosService.getTodos(),
  });

  const addTodoMutation = useMutation({
    mutationFn: (text: string) => todosService.addTodo(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos list'] });
      setInputValue('');
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: number) => todosService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos list'] });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      todosService.toggleTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos list'] });
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      addTodoMutation.mutate(inputValue.trim());
    }
  };

  const handleClearCompleted = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodoMutation.mutate(todo.id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className='todo-container'>
      <h1>todos</h1>

      <div className="input-area">
        <ChevronDown className="chevron-icon" />
        <input
          className="input-field"
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="list-box">
        {isLoading ? (
          <div className="loader-container">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                {todo.completed ? (
                  <CheckCircle2
                    className="circle-icon completed"
                    onClick={() => toggleTodoMutation.mutate({ id: todo.id, completed: false })}
                  />
                ) : (
                  <Circle
                    className="circle-icon"
                    onClick={() => toggleTodoMutation.mutate({ id: todo.id, completed: true })}
                  />
                )}
                <p className={todo.completed ? 'completed-text' : ''}>{todo.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='task-controls'>
        <p>{todos.filter((t) => !t.completed).length} items left</p>
        <div className='button-box'>
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <button onClick={handleClearCompleted}>Clear completed</button>
      </div>
    </div>
  );
}

export default App;

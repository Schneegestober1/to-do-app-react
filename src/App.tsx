import { useState } from 'react';
import './App.css'
import { ChevronDown, Circle } from 'lucide-react';

function App() {

const [todos, setTodos] = useState([
    { text: 'Тестовое задание', completed: false },
    { text: 'Прекрасный код', completed: true },
    { text: 'Покрытие тестами', completed: false },
  ]);

  return (
    <>
      <div className='todo-container'>
        <h1>todos</h1>
        <div className="input-area">
          <ChevronDown className="chevron-icon" />
          <input className="input-field" type="text" placeholder="What needs to be done?" />
        </div>
        <div className="list-box">
          <ul className="todo-list">
            {todos.map((todo) => (
              <li>
                <Circle className="circle-icon" />
                <p>{todo.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='task-controls'>
          <p>2 items left</p>
          <div className='button-box'>
            <button>All</button>
            <button>Active</button>
            <button>Completed</button>
          </div>
          <button>Clear completed</button>
        </div>

      </div>
    </>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import './App.css'
import logo from './components/logo-dark.svg'
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import HabitTracker from './components/HabitTracker'

function App() {

  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [editText, setEditText] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [completedTodos, setCompletedTodos] = useState(0)
  const [inCompletedTodos, setInCompletedTodos] = useState(0)


  useEffect(() => {
    const getTodos = JSON.parse(localStorage.getItem('todos'))

    if (getTodos && getTodos.length >= 1) {
      setTodos(getTodos)
    }

  }, [])


  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))

    const totalTodos = JSON.parse(localStorage.getItem('todos'))
    const completedTodos = totalTodos.filter((todo) => {
      if (todo.isCompleted) {
        return true
      }

      return false
    })

    const inCompleteTodos = totalTodos.filter((todo) => {
      if (todo.isCompleted) {
        return false
      }

      return true
    })
    setCompletedTodos(completedTodos.length)
    setInCompletedTodos(inCompleteTodos.length)

  }, [todos])

  let totalTodos = todos.length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!todo || /^\s*$/.test(todo)) {
      return;
    }
    const newTodo = {
      id: Math.ceil(Math.random() * 100000),
      task: todo,
      isCompleted: false
    }

    setTodos([...todos, newTodo]);
    setTodo('');

  }

  const handleCompleted = (id) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.isCompleted = !todo.isCompleted
      }
      return todo
    })
    setTodos(newTodos);

  }

  const handleEdit = (id) => {
    if (!editText || /^\s*$/.test(editText)) {
      return;
    }
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.task = editText
      }

      return todo
    })

    setTodos(newTodos);
    setEditText('');
    setEditingTodo(null);

  }

  const handleDelete = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
  }

  return (
    <>

      <nav>
        <div>
          <img src={logo} alt="SB" className="logo" />
        </div>

        <div className="menuItems">
          <ul>
            <li>
              <Link to="/" className="link">
                Todo Manager
              </Link>
            </li>
            <li>
              <Link to="/habit-tracker" className="link">
                Habit Tracker
              </Link>
            </li>
          </ul>
        </div>

      </nav>

      <Switch>
        <Route exact path="/">
          <div className="mainDiv">
            <div>
              <div className="h1">
                <h1>Enter Your Daily Tasks</h1>

                <h5>Total Task for Today  :  {totalTodos} <br />
                  Completed: {completedTodos} <br />
                  Remaining: {inCompletedTodos}
                </h5>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  className="mainInput"
                  type="text"
                  placeholder="Enter Your Todo..."
                  value={todo}
                  onChange={(e) => { setTodo(e.target.value) }}
                />
                <button type="submit" className="mainBtn"> Add Todo </button>
              </form>

              {todos ? (
                todos.map((todo) => (
                  <div className="flex todoDiv" key={todo.id} >
                    <div className="textDiv">
                      <input className="checkbox" type="checkbox" id="task" checked={todo.isCompleted} onChange={() => handleCompleted(todo.id)} />

                      {todo.id === editingTodo ? (
                        <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="secondaryInput" placeholder="Edit Your Todo..." />
                      ) : (
                        <label htmlFor="task">
                          <p className="todoTask">{todo.task}</p>
                        </label>
                      )}

                    </div>

                    <div className="btnDiv">
                      {
                        todo.id === editingTodo ? (
                          <button onClick={() => handleEdit(todo.id)} type="submit" className="greenBtn"><i className="fas fa-check"></i></button>
                        ) : (
                          <button onClick={() => setEditingTodo(todo.id)} type="submit" className="greenBtn"><i className="fas fa-edit"></i></button>
                        )
                      }

                      <button onClick={() => handleDelete(todo.id)} className="redBtn"><i className="fas fa-trash-alt"></i></button>

                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h3>No tasks to show</h3>
                </div>
              )}


            </div>
          </div>
        </Route>
        <Route exact path="/habit-tracker">
          <HabitTracker />
        </Route>
      </Switch>



    </>
  )
}

export default App

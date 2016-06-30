import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
/* global deepFreeze expect */

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      };
    default:
      return state;
  }
};

// Todos reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action),
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibiltyFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibiltyFilter,
});

const store = createStore(todoApp);

let nextTodoId = 0;
class TodoApp extends React.Component {
  render() {
    return (
      <div>
        <h1>My TODO list</h1>
        <input
          type="text"
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: 'ADD_TODO',
              text: this.input.value,
              id: nextTodoId++,
            });
            // Clear input field.
            this.input.value = '';
          }}
        >Add Todo</button>
        <ul className="todos">
          {this.props.todos.map(t =>
            <li
              key={t.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: t.id,
                });
              }}
              className={
                t.completed ?
                  'completed' :
                  ''
              }
            >{t.text}</li>
          )}
        </ul>
      </div>
    );
  }
}

TodoApp.propTypes = {
  todos: React.PropTypes.array.isRequired,
};

const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos} />,
    document.getElementById('root')
  );
};

// Sub to store changes and call render.
store.subscribe(render);

// Render inital state
render();

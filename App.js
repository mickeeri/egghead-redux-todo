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

const FilterLink = ({
  filter,
  currentFilter,
  children,
}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter,
        });
      }}
    >
      {children}
    </a>
  );
};

FilterLink.propTypes = {
  filter: React.PropTypes.string.isRequired,
  children: React.PropTypes.string.isRequired,
  currentFilter: React.PropTypes.string.isRequired,
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
    default:
      return todos;
  }
};

let nextTodoId = 0;
class TodoApp extends React.Component {

  render() {
    const { todos, visibiltyFilter } = this.props;
    const visibleTodos = getVisibleTodos(todos, visibiltyFilter);

    return (
      <div>
        <h1>React Redux TODO list</h1>
        <input
          type="text"
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            if (this.input.value !== '') {
              store.dispatch({
                type: 'ADD_TODO',
                text: this.input.value,
                id: nextTodoId++,
              });
              // Clear input field.
              this.input.value = '';
            }
          }}
        >Add Todo</button>
        <ul className="todos">
          {visibleTodos.map(t =>
            <li
              key={t.id}
              onClick={() => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: t.id,
                });
              }}
              className={t.completed ? 'completed' : ''}
            >{t.text}</li>
          )}
        </ul>
        <p className="filters">
          Show:
          {' '}
          <FilterLink currentFilter={visibiltyFilter} filter="SHOW_ALL">All</FilterLink>
          <span> | </span>
          <FilterLink currentFilter={visibiltyFilter} filter="SHOW_ACTIVE">Active</FilterLink>
          <span> | </span>
          <FilterLink currentFilter={visibiltyFilter} filter="SHOW_COMPLETED">Completed</FilterLink>
        </p>
      </div>
    );
  }
}

TodoApp.propTypes = {
  todos: React.PropTypes.array.isRequired,
  visibiltyFilter: React.PropTypes.string.isRequired,
};

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById('root')
  );
};

// Sub to store changes and call render.
store.subscribe(render);

// Render inital state
render();

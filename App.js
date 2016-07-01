import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';

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

// Action creators.
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text,
  };
};

const setVisibiltyFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter,
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id,
  };
};

// Only specifies the apperance of a link. But does not know
// anything about the behavior.
const Link = ({
  active,
  children,
  onClick,
}) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

Link.propTypes = {
  active: React.PropTypes.bool.isRequired,
  children: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      ownProps.filter ===
      state.visibiltyFilter,
  };
};

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibiltyFilter(ownProps.filter)
      );
    },
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

// FilterLink.propTypes = {
//   filter: React.PropTypes.string.isRequired,
//   children: React.PropTypes.string.isRequired,
//   currentFilter: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func.isRequired,
// };

// Renders the filter links.
const Footer = () => (
  <p className="filters">
    Show:
    {' '}
    <FilterLink
      filter="SHOW_ALL"
    >All
    </FilterLink>
    <span> | </span>
    <FilterLink
      filter="SHOW_ACTIVE"
    >Active
    </FilterLink>
    <span> | </span>
    <FilterLink
      filter="SHOW_COMPLETED"
    >Completed</FilterLink>
  </p>
);

// Footer.propTypes = {
//   visibiltyFilter: React.PropTypes.string.isRequired,
//   onFilterClick: React.PropTypes.func.isRequired,
// };

const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    className={completed ? 'completed' : ''}
  >
    {text}
  </li>
);

Todo.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  completed: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string.isRequired,
};


// Receives array of todos and maps individual Todo components.
const TodoList = ({ todos, onTodoClick }) => (
  <ul className="todos">
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

// Presentational component that renders input and button
// for adding new todo item.
let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input
        type="text"
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          dispatch(addTodo(input.value));
          input.value = '';
        }}
      >Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

AddTodo.propTypes = {
  dispatch: React.PropTypes.func,
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

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibiltyFilter
    ),
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    },
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

// Container component. Calls components responsible for presentation only.
const TodoApp = () => (
  <div>
    <h1>React Redux TODO list</h1>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// TodoApp get's re-rendered every time the store changes.
// TodoApp component receives keys to the global state object as props.
// That is an array of todos and the visibilityFilter values.
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);


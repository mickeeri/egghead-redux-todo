import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from 'react-redux';

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

// const store = createStore(todoApp);

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

// Link.propTypes = {
//   active: React.PropTypes.bool.isRequired,
//   children: React.PropTypes.string.isRequired,
//   onClick: React.PropTypes.func.isRequired,
// };

// Container for data and behavior for the presentational
// Link component.
class FilterLink extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    // Delegates all rendering to the Link component.
    return (
      <Link
        active={props.filter === state.visibiltyFilter}
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter,
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}
FilterLink.contextTypes = {
  store: React.PropTypes.object,
};

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

let nextTodoId = 0;
// Presentational component that renders input and button
// for adding new todo item.
const AddTodo = (props, { store }) => {
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
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value,
          })
          input.value = '';
        }}
      >Add Todo
      </button>
    </div>
  );
};
AddTodo.contextTypes = {
  store: React.PropTypes.object,
};

// AddTodo.propTypes = {
//   onAddClick: React.PropTypes.func.isRequired,
// };

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

class VisibleTodoList extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibiltyFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id,
          })
        }
      />
    );
  }
}
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object,
};


// Container component. Calls components responsible for presentation only.
const TodoApp = () => (
  <div>
    <h1>React Redux TODO list</h1>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// TodoApp.propTypes = {
//   todos: React.PropTypes.array.isRequired,
//   visibiltyFilter: React.PropTypes.string.isRequired,
// };

// TodoApp get's re-rendered every time the store changes.
// TodoApp component receives keys to the global state object as props.
// That is an array of todos and the visibilityFilter values.
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);


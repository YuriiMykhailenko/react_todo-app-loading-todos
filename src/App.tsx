/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ToodoList } from './components/TodoList';
import { FilterOptions } from './utils/FilterOptions';
import cn from 'classnames';

function getFilteredTodos(todos: Todo[], filterOption: FilterOptions): Todo[] {
  return todos.filter(todo => {
    switch (filterOption) {
      case FilterOptions.Active:
        return !todo.completed;

      case FilterOptions.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todoos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOptions>(
    FilterOptions.All,
  );

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() =>
        setTimeout(() => {
          setError('');
        }, 3000),
      );
  }, []);

  const numberOfActiveTodos = todoos.filter(todo => !todo.completed).length;

  const filteredTodos = getFilteredTodos(todoos, filterOption);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <ToodoList todos={filteredTodos} />
        </section>

        {/* Hide the footer if there are no todos */}
        {todoos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {numberOfActiveTodos} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterOption === FilterOptions.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterOption(FilterOptions.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterOption === FilterOptions.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterOption(FilterOptions.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterOption === FilterOptions.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterOption(FilterOptions.Completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className={cn('delete', { hidden: !error })}
        />
        {error}
      </div>
    </div>
  );
};

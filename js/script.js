const filterToggle = document.getElementById('filter-toggle');
const filterMenu = document.getElementById('filter-menu');
const todoItems = document.getElementById('todo-items');
const todoForm = document.querySelector('.todo-form');
const todoInput = document.getElementById('todo-input');
const dueDateInput = document.getElementById('due-date');


filterToggle.addEventListener('click', () => {
  filterMenu.classList.toggle('show');
});

function updateFilterButtonText() {
  const filterToggle = document.getElementById('filter-toggle');
  if (currentFilter === 'all') {
    filterToggle.textContent = 'Filter: All ⏷';
  } else if (currentFilter === 'completed') {
    filterToggle.textContent = 'Filter: Completed ⏷';
  } else if (currentFilter === 'incomplete') {
    filterToggle.textContent = 'Filter: Incomplete ⏷';
  }
}


let currentFilter = 'all';

document.addEventListener('click', (e) => {
  if (!filterToggle.contains(e.target) && !filterMenu.contains(e.target)) {
    filterMenu.classList.remove('show');
  }
});

document.querySelectorAll('.filter-option').forEach(option => {
  option.addEventListener('click', () => {
    currentFilter = option.getAttribute('data-filter'); 
    filterMenu.classList.remove('show');
    updateFilterButtonText();
    renderTodos(); 
  });
});




let todos = JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();


function renderTodos() {
  todoItems.innerHTML = '';

  if (todos.length === 0) {
    todoItems.innerHTML = '<tr><td colspan="4" class="text-center"> No To-dos found. </td></tr>';
    return;
  }

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'completed') {
      return todo.completed;
    } else if (currentFilter === 'incomplete') {
      return !todo.completed;
    }
    return true;
  });
  if (filteredTodos.length === 0) {
    todoItems.innerHTML = '<tr><td colspan="4" class="text-center"> No Filtered To-dos found. </td></tr>';
    return;
  }
  todos.forEach((todo, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${todo.text}</td>
      <td>${todo.dueDate || ''}</td>
      <td>${todo.completed ? 'Completed' : 'Incomplete'}</td>
      <td>
        <button type = "button" class="complete-btn" data-index="${index}">✔</button>
        <button type = "button" class="delete-btn" data-index="${index}">🗑</button>
      </td>`;
    todoItems.appendChild(row);
  });

  document.querySelectorAll('.complete-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    todos[index].completed = !todos[index].completed;
    renderTodos();
  });
});

document.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    todos.splice(index, 1);
    renderTodos();
  });
});
  // Save to localStorage
  localStorage.setItem('todos', JSON.stringify(todos));
}

renderTodos();



todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  const dueDate = dueDateInput.value;
  if (text) {
    todos.push({ text, dueDate, completed: false });
    renderTodos();
    todoForm.reset();
  }
});

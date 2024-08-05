document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const taskInput = document.getElementById('task-input');
  const taskAddButton = document.getElementById('task-add-button');


  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


  renderTasks();


  taskAddButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ id: Date.now(), task_text: taskText, completed: false });
      taskInput.value = '';
      saveTasks();
      renderTasks();
    }
  });


  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskItem.innerHTML = `
        <div class="task-content">
          <input type="checkbox" class="form-check-input task-checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
          <label class="task-label ${task.completed ? 'completed' : ''}" for="task-${task.id}">
            ${task.task_text}
          </label>
        </div>
        <button class="btn task-delete-btn" data-task-id="${task.id}">Eliminar</button>
      `;
      taskList.appendChild(taskItem);


      const checkbox = taskItem.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks(); 
      });


      const deleteButton = taskItem.querySelector('.task-delete-btn');
      deleteButton.addEventListener('click', () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks();
      });
    });
  }


  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});

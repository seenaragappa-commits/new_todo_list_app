document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });

        // Load saved theme
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
    }

    // Task Form Submission (AJAX)
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = taskForm.querySelector('input[name="content"]').value.trim();
            if (!content) {
                showFlashMessage('Task cannot be empty!');
                return;
            }

            try {
                const response = await fetch('/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `content=${encodeURIComponent(content)}`
                });
                if (response.ok) {
                    const task = await response.json(); // Expect JSON response from server
                    addTaskToDOM(task);
                    taskForm.reset();
                } else {
                    showFlashMessage('Failed to add task.');
                }
            } catch (error) {
                showFlashMessage('Error adding task.');
            }
        });
    }

    // Task Actions (Toggle/Delete)
    document.getElementById('task-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const taskItem = btn.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const action = btn.dataset.action;

        try {
            const response = await fetch(`/${action}/${taskId}`, { method: 'GET' });
            if (response.ok) {
                if (action === 'delete') {
                    taskItem.classList.add('fade-out');
                    setTimeout(() => taskItem.remove(), 300);
                } else if (action === 'toggle') {
                    taskItem.classList.toggle('completed');
                    btn.textContent = taskItem.classList.contains('completed') ? 'Undo' : 'Complete';
                }
            } else {
                showFlashMessage(`Failed to ${action} task.`);
            }
        } catch (error) {
            showFlashMessage(`Error performing ${action}.`);
        }
    });

    // Helper to show flash messages
    function showFlashMessage(message) {
        const flashes = document.querySelector('.flashes') || document.createElement('ul');
        if (!flashes.classList.contains('flashes')) {
            flashes.classList.add('flashes');
            document.querySelector('.container').prepend(flashes);
        }
        const li = document.createElement('li');
        li.classList.add('flash-message');
        li.textContent = message;
        flashes.appendChild(li);
        setTimeout(() => li.remove(), 3000);
    }

    // Helper to add task to DOM
    function addTaskToDOM(task) {
        const taskList = document.getElementById('task-list');
        const li = document.createElement('li');
        li.classList.add('task-item');
        li.dataset.taskId = task.id;
        li.innerHTML = `
            <span class="task-content">${task.content}</span>
            <div class="task-actions">
                <button class="toggle-btn" data-action="toggle">Complete</button>
                <button class="delete-btn" data-action="delete">Delete</button>
            </div>
        `;
        taskList.prepend(li);
        li.classList.add('fade-in');
        setTimeout(() => li.classList.remove('fade-in'), 300);
        async function addTask() {
    const submitBtn = taskForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
    // ... AJAX request ...
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Task';
}
    }
    
});
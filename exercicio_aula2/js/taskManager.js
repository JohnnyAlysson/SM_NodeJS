// Existing code...

var lista = document.getElementById("taskList");
var conteudoForm = document.getElementById("task");

function addTask() {
    const taskText = conteudoForm.value.trim();
    if (taskText === '') return;

    const newItem = createTaskElement(taskText, false);
    lista.appendChild(newItem);
    conteudoForm.value = '';
    saveTasks();
}

function createTaskElement(text, isCompleted) {
    const newItem = document.createElement('li');
    const buttonDelete = document.createElement("button");
    const checkbutton = document.createElement("input");
    const textSpan = document.createElement("span");

    buttonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    buttonDelete.classList.add('deleteBTN');
    buttonDelete.onclick = function() {
        deleteTask(this);
    };

    checkbutton.type = "checkbox";
    checkbutton.checked = isCompleted;
    checkbutton.onchange = function() {
        toggleStrikethrough(this);
        saveTasks();
    };

    textSpan.textContent = text;
    if (isCompleted) {
        textSpan.style.textDecoration = "line-through";
    }

    newItem.appendChild(checkbutton);
    newItem.appendChild(textSpan);
    newItem.appendChild(buttonDelete);

    return newItem;
}

function deleteTask(button) {
    const listItem = button.parentNode;
    lista.removeChild(listItem);
    saveTasks();
}

function toggleStrikethrough(checkbox) {
    const textSpan = checkbox.nextElementSibling;
    textSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
    saveTasks();
}

function saveTasks() {
    const tasks = Array.from(lista.children).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector('input[type="checkbox"]').checked
    }));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id) {
        localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
    }
}

function loadTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id) {
        const savedTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];
        lista.innerHTML = '';
        savedTasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.completed);
            lista.appendChild(taskElement);
        });
    }
}

// Call loadTasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

const logoutBTN = document.getElementById('logoutBTN');

logoutBTN.addEventListener('click', () => {
    logout();
});

// This function should be moved to auth.js
function logout() {
    currentUser = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
    return true;
}
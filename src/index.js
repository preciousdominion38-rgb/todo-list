import "./style.css";
import Project from "./modules/project";
import Todo from "./modules/todo";

let projects = [];

// Load from local storage
function loadProjects() {
    const stored = localStorage.getItem("projects");
    if (stored) {
        const parsed = JSON.parse(stored);
        projects = parsed.map((p) => {
            const project = new Project(p.name);
            p.todos.forEach((t) => {
                const todo = new Todo(
                    t.title,
                    t.description,
                    t.dueDate,
                    t.priority
                );
                project.addTodo(todo);
            });
            return project;
        });
    }
}

// Save to local storage 
function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
}

// Render everything
function render() {
    const content = document.getElementById("content");
    content.innerHTML = "";
    
    projects.forEach((project, projectIndex) => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project");

        // Project Header
        const titleBar = document.createElement("div");

        titleBar.classList.add("project-header");

        const title = document.createElement("h2");
        title.textContent = project.name;

        const deleteProjectBtn = document.createElement("button");
        deleteProjectBtn.textContent = "Delete Project";

        deleteProjectBtn.classList.add("delete-project");

        deleteProjectBtn.addEventListener("click", () => {
            projects.splice(projectIndex, 1);
            saveProjects();
            render();
        });

        titleBar.appendChild(title);

        titleBar.appendChild(deleteProjectBtn);
        projectDiv.appendChild(titleBar);

        // Todos
        project.todos.forEach((todo, todoIndex) => {
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");

            todoDiv.innerHTML = `
            <div class="todo-text">
            <strong>${todo.title}</strong> - ${todo.description}<br />
            <small>Due: ${todo.dueDate} | Priority: ${todo.priority}</small>
            </div>`;

            const deleteTodoBtn = document.createElement("button");
            deleteTodoBtn.textContent = "X";

            deleteTodoBtn.classList.add("delete-todo");

            deleteTodoBtn.addEventListener("click", () => {
                project.todos.splice(todoIndex, 1);
            
            saveProjects();
        render();
    });

    todoDiv.appendChild(deleteTodoBtn);
    projectDiv.appendChild(todoDiv);
});

content.appendChild(projectDiv);
    });
}

// Add new Project
function addProject() {
    const name = prompt("Enter Project name:");
    if (!name) return;
    const project = new Project(name);
    projects.push(project);
    saveProjects();
    render();
}

// Add new Todo
function addTodo() {
    if (projects.length === 0) {
        alert("Please add a project first!");
        return;
    }

    const title = prompt("Todo title:");
    const description = prompt("Todo description:");
    const dueDate = prompt("Due date (YYYY-MM-DD):");
    const priority = prompt("Priority (low/medium/high):");

    const todo = new Todo(title, description, dueDate, priority);
    projects[projects.length - 1].addTodo(todo);
    saveProjects();
    render();
}

// Initialize app
document.getElementById("addProject").addEventListener("click", addProject);
document.getElementById("addTodo").addEventListener("click", addTodo);

loadProjects();
render();
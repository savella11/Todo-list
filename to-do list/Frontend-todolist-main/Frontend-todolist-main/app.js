const API = "https://app-py-to-dolist.onrender.com";

async function loadTasks() {
    const resp = await fetch(`${API}/tasks`);
    
    // Mejoramos el manejo de errores del frontend
    if (!resp.ok) {
        console.error("Fallo al cargar tareas: ", resp.status);
        document.getElementById("list").innerHTML = "<li>Error al conectar con la API.</li>";
        return;
    }

    const data = await resp.json();
    const list = document.getElementById("list");
    list.innerHTML = "";
    
    data.forEach(t => {
        let li = document.createElement("li");
        
        // AÑADIR CLASE DE ESTILO si la tarea está completada
        if (t.completed) {
            li.classList.add("completed"); 
        }

        // Estructura del LI para el diseño
        li.innerHTML = `
            <span class="task-content">${t.content}</span>
            <div class="task-actions">
                <button onclick="completeTask(${t.id})">
                    ${t.completed ? 'Pendiente' : 'Completar'}
                </button>
                <button onclick="removeTask(${t.id})">Eliminar</button>
            </div>
        `;
        list.appendChild(li);
    });
}
loadTasks();

async function addTask() {
    const inputElement = document.getElementById("input-task");
    const content = inputElement.value.trim();

    // Validación básica en frontend
    if (content === "") {
        alert("La tarea no puede estar vacía.");
        return;
    }

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({content})
    });
    
    inputElement.value = ""; // Limpia la caja de texto
    loadTasks();
}

// Renombramos la función para ser más descriptivos
async function completeTask(id) {
    // La API cambia el estado (PUT /tasks/id/complete)
    await fetch(`${API}/tasks/${id}/complete`, {method:"PUT"});
    loadTasks();
}

// Renombramos la función para ser más descriptivos
async function removeTask(id) {
    await fetch(`${API}/tasks/${id}`, {method:"DELETE"});
    loadTasks();
}





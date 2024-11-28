const axios = require("axios");

// URL de tu API para crear tareas
const API_URL = "http://localhost:9090/todos"; // Cambia según tu backend

// Función para generar tareas aleatorias
const generateRandomTask = (index) => {
  const priorities = ["LOW", "MEDIUM", "HIGH"];
  const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
  const randomDone = Math.random() > 0.5; // Aleatorio true/false

  return {
    text: `Task ${index + 1}`,
    priority: randomPriority,
    dueDate: new Date(Date.now() + Math.random() * 10000000000).toISOString(), // Fecha futura aleatoria
    done: randomDone,
  };
};

// Función para enviar 30 tareas
const createTasks = async () => {
  const tasks = Array.from({ length: 30 }, (_, index) => generateRandomTask(index));

  console.log("Creando tareas...");
  for (const task of tasks) {
    try {
      const response = await axios.post(API_URL, task);
      console.log(`Tarea creada: ${response.data.text}`);
    } catch (error) {
      console.error("Error al crear tarea:", error.response?.data || error.message);
    }
  }

  console.log("Proceso completado.");
};

createTasks();

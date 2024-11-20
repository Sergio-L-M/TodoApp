import React, { useState } from 'react';
import './App.css';
import TodoModal from './components/UpdateCreateTodo/TodoModal';
import TaskTable from './components/TaskTable';

function App() {
  const [showCreateTask, setShowCreateTask] = useState(false);

  const handleOpenModal = () => setShowCreateTask(true);
  const handleCloseModal = () => setShowCreateTask(false);

  return (
    <div className="App">
      {/* Botón para abrir el modal en modo creación */}
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create New Task
      </button>

      {/* Modal para crear una tarea */}
      <TodoModal
        open={showCreateTask}
        onClose={handleCloseModal}
        onSuccess={() => {
          console.log('Task created successfully!');
          handleCloseModal(); // Cierra el modal después de éxito
        }}
      />

      {/* Tabla de tareas */}
      <TaskTable />
    </div>
  );
}

export default App;

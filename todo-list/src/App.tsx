import React, { useState } from 'react';
import './App.css';

import TaskTable from './components/TaskTable';
import Metrics from './components/TodoMetrics/TodoMetrics';

function App() {
  // Estado para controlar cuándo actualizar las métricas
  const [refreshMetrics, setRefreshMetrics] = useState(false);

  const handleTaskUpdate = () => {
    // Cambia el estado para actualizar las métricas
    setRefreshMetrics((prev) => !prev);
  };

  return (
    <div className="App">
      {/* Componente de métricas */}
      <Metrics refresh={refreshMetrics} />

      {/* Tabla de tareas */}
      <TaskTable onTaskUpdate={handleTaskUpdate} />
    </div>
  );
}

export default App;

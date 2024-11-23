import React, { useState } from 'react';
import './App.css';
import {
  Typography,

} from "@mui/material";

import TaskTable from './components/TaskTable';
import Metrics from './components/TodoMetrics/TodoMetrics';

function App() {
  // Estado para controlar cuándo actualizar las métricas
  const [refreshMetrics, setRefreshMetrics] = useState(false);

  const handleTaskUpdate = () => {
    
    setRefreshMetrics((prev) => !prev);
  };
// Agregar aleretas y test y top bar 
  return (

    <div className="App">
    <Typography variant="h4" gutterBottom>
    Task List
    </Typography>
      {/* Componente de métricas */}
      <Metrics refresh={refreshMetrics} />

      {/* Tabla de tareas */}
      <TaskTable onTaskUpdate={handleTaskUpdate} />
    </div>
  );
}

export default App;

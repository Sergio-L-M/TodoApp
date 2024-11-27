import React, { useState } from 'react';
import './App.css';
import {
  Typography,
  AppBar, 
  Toolbar, 
  Box 
} from "@mui/material";

import Metrics from './components/metrics/TodoMetrics';
import TaskTableV2 from './components/table/TodoTable';
function App() {


  return (

    <div className="App"       style={{
      backgroundColor: "rgb(39, 165, 255)",
      minHeight: "100vh", // Asegura que el fondo cubra toda la pantalla
      paddingBottom: "20px",
    }}>
      <AppBar position="static" sx={{ bgcolor: "white" }}>      
      <Typography
            variant="h4"
            component="div"
            sx={{ color: "black", fontFamily: "Monospace", letterSpacing: 6}}
          >
            TODO App
          </Typography>
      </AppBar>
 
      <Metrics/>
      <Box sx={{ mt: 3, mb: 3, mx: 2 }}>
        {/*<TaskTable onTaskUpdate={handleTaskUpdate} />*/}
        <TaskTableV2/>
      </Box>
      
    </div>
  );
}

export default App;

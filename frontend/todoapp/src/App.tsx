import React from "react";
import "./App.css";
import { Typography, AppBar, Box } from "@mui/material";

import Metrics from "./components/metrics/TodoMetrics";
import { TodoTable } from "./components/table/TodoTableV2";
import { MetricsProvider } from "./components/metrics/MetricContext";

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundColor: "rgb(39, 165, 255)",
        minHeight: "100vh", // Asegura que el fondo cubra toda la pantalla
        paddingBottom: "20px",
      }}
    >
      <AppBar position="static" sx={{ bgcolor: "white" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ color: "black", fontFamily: "Monospace", letterSpacing: 6 }}
        >
          TODO App
        </Typography>
      </AppBar>

      <MetricsProvider>
        {/* Métricas */}
        <Metrics />

        {/* Tabla de tareas */}
        <Box sx={{ mt: 3, mb: 3, mx: 2 }}>
          <TodoTable />
        </Box>
      </MetricsProvider>
    </div>
  );
}

export default App;

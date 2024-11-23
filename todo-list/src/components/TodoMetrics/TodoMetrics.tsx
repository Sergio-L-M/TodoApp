import React, { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";

const Metrics: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const [metrics, setMetrics] = useState<{
    averageTime: string;
    averageTimeHigh: string;
    averageTimeMedium: string;
    averageTimeLow: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/todos/metrics/pending");
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(); // Actualiza las métricas cuando el prop `refresh` cambia
  }, [refresh]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mt: 2,
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : metrics ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Metrics Overview
          </Typography>
          <Typography>Average Time: {metrics.averageTime}</Typography>
          <Typography>High Priority Avg: {metrics.averageTimeHigh}</Typography>
          <Typography>Medium Priority Avg: {metrics.averageTimeMedium}</Typography>
          <Typography>Low Priority Avg: {metrics.averageTimeLow}</Typography>
        </Box>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Paper>
  );
};

export default Metrics;

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Metrics {
  averageTime: string;
  averageTimeHigh: string;
  averageTimeMedium: string;
  averageTimeLow: string;
}

interface MetricsContextProps {
  metrics: Metrics | null;
  loading: boolean;
  fetchMetrics: () => void; // Función para recargar métricas
}

const MetricsContext = createContext<MetricsContextProps | undefined>(undefined);

// Hook para usar el contexto
export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics debe usarse dentro de MetricsProvider");
  }
  return context;
};

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:9090/todos/metrics/pending");
      setMetrics(response.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <MetricsContext.Provider value={{ metrics, loading, fetchMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
};


import React, { useState } from "react";
import { Table, TableHead, TableContainer, Paper, TableBody } from "@mui/material";
import { TodoSortController } from "./TodoSortController";
import { TodoFilterController } from "./TodoFilterController";
import { TodoContentTable } from "./TodoContentTable";
import { TodoFooter } from "./TodoFooterPagiatio";
import Metrics from "../metrics/TodoMetrics";
import { useMetrics } from "../metrics/MetricContext";
interface Pagination{
  pageSize: number;
  totalPages: number;
  currentPage:number;
  totalItems:number;

}
interface Filters {
  sortBy?: string;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  done?: string[];
  priority?: string[];
  text?: string;
}

export const TodoTable: React.FC = () => {
  const { fetchMetrics } = useMetrics(); // Accede a la función para recargar métricas

  const [reloadContent, setReloadContent] = useState<boolean>(false);

  const [filters, setFilters] = useState<Filters>({
    page: 0,
    pageSize: 10,
  });
  const [pagination, setPagination] = useState<Pagination>({
    pageSize: 10,
    totalPages: 1,
    currentPage: 0,
    totalItems: 0,

  });

  const updatePagination = (newPagination: Pagination) => {
    setPagination(newPagination);
  };
  const applyFilters = () => {
    fetchMetrics();
    setReloadContent((prev) => !prev); // Alterna el estado para forzar recarga
  };

  return (
   
    <TableContainer component={Paper}>
        <Table>
        <TableHead>
            {/* Controles de ordenamiento */}
            <TodoSortController filters={filters} setFilters={setFilters} applyFilters={applyFilters} />

            {/* Controles de filtro */}
            <TodoFilterController filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
        </TableHead>
        {/* Tabla de contenido */}
        <TableBody>
        <TodoContentTable filters={filters} reloadContent={reloadContent}  updatePagination={updatePagination}/>
        </TableBody>
        </Table>
        <TodoFooter
        filters={filters}
        setFilters={setFilters}
        pagination={pagination}
        applyFilters={applyFilters}
      />
    </TableContainer>
  );
};

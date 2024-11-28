import React, { useState } from "react";
import { Button, TablePagination } from "@mui/material";
import TodoModal from "../modal/TodoModal";

interface Pagination {
  pageSize: number;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface Filters {
  sortBy?: string;
  ascending?: boolean;
  page?: number;
  pageSize?: number;
  text?: string;
  priority?: string[];
  done?: string[];
}

interface FooterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  pagination: Pagination;
  applyFilters: () => void;
}

export const TodoFooter: React.FC<FooterProps> = ({
  filters,
  setFilters,
  pagination,
  applyFilters,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
    }));
    applyFilters(); // Fuerza la recarga
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      pageSize,
      page: 0, // Reinicia la página
    }));
    applyFilters(); // Fuerza la recarga
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
      }}
    >
      {/* Botón para agregar nueva tarea */}
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
        Add New Task
      </Button>

      {/* Componente de paginación */}
      <TablePagination
        rowsPerPageOptions={[10]} // Opciones de filas por página
        component="div"
        count={pagination.totalItems} // Total de elementos
        rowsPerPage={pagination.pageSize} // Tamaño de página actual
        page={pagination.currentPage} // Página actual
        onPageChange={(_, page) => handlePageChange(page)} // Maneja el cambio de página
        onRowsPerPageChange={(e) => handlePageSizeChange(parseInt(e.target.value, 10))} // Maneja el cambio de filas por página
      />
      <TodoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTask={null}
        onSuccess={() => applyFilters()} // Aplica filtros después de agregar tarea
      />
    </div>
  );
};

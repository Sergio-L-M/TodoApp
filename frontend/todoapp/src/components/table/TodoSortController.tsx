import React from "react";
import { TableCell, TableRow, TableSortLabel } from "@mui/material";
import { Filters } from "./utils/TodoContentTableUtils";

interface SortControlsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  applyFilters: () => void;
}

export const TodoSortController: React.FC<SortControlsProps> = ({ filters, setFilters, applyFilters }) => {
  const handleSort = (column: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: column,
      ascending: prevFilters.sortBy === column ? !prevFilters.ascending : true,
    }));
    applyFilters();
  };

  return (
    <TableRow>
      <TableCell>Done</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>
        <TableSortLabel
          active={filters.sortBy === "priority"}
          direction={filters.ascending ? "asc" : "desc"}
          onClick={() => handleSort("priority")}
        >
          Priority
        </TableSortLabel>
      </TableCell>
      <TableCell>
        <TableSortLabel
          active={filters.sortBy === "dueDate"}
          direction={filters.ascending ? "asc" : "desc"}
          onClick={() => handleSort("dueDate")}
        >
          DueDate
        </TableSortLabel>
      </TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  );
};

import React from "react";
import { TableCell, TableRow, Select, MenuItem, TextField, Button } from "@mui/material";
import { Filters } from "./utils/TodoContentTableUtils";

interface FilterControlsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  applyFilters: () => void;
}

export const TodoFilterController: React.FC<FilterControlsProps> = ({ filters, setFilters, applyFilters }) => {
  return (
    <TableRow>
      <TableCell>
        <Select
          multiple
          value={filters?.done || []}
          onChange={(e) => setFilters({ ...filters, done: e.target.value as string[] })}
          renderValue={(selected) =>
            selected
              .map((value) => (value === "true" ? "Done" : value === "false" ? "Undone" : value))
              .join(", ")
          }
          fullWidth
          displayEmpty
        >
          <MenuItem value="true">Done</MenuItem>
          <MenuItem value="false">Undone</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <TextField
          value={filters?.text || ""}
          onChange={(e) => setFilters({ ...filters, text: e.target.value as string })}
          placeholder="Search name"
          fullWidth
        />
      </TableCell>
      <TableCell>
        <Select
          multiple
          value={filters?.priority || []}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value as string[] })}
          renderValue={(selected) => selected.join(", ")}
          fullWidth
          displayEmpty
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </Select>
      </TableCell>
      <TableCell />
      <TableCell>
        <Button variant="contained" color="primary" onClick={applyFilters} style={{ marginRight: "8px" }}>
          Apply Filter
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setFilters({ ...filters, done: [], priority: [], text: "" })}
        >
          Clear Filter
        </Button>
      </TableCell>
    </TableRow>
  );
};

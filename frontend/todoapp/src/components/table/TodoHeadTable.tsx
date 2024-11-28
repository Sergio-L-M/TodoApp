import React, { useState } from "react";
import { TableHead,TableRow, TableCell, Checkbox, Table, Chip, Button, Select, MenuItem, TextField, TableSortLabel } from "@mui/material";
import { Filters } from "./utils/TodoContentTableUtils";
import { TodoContentTable } from "./TodoContentTable";
export const TodoHeadTable: React.FC = () =>{
    const [filters, setFilters] = useState<Filters>({});
    const [reloadContent, setReloadContent] = useState<boolean>(false);
    const applyFilters = () => {
        setReloadContent((prev) => !prev);
      };
    return(
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Done
                    </TableCell>
                    <TableCell>
                        Name
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                        active={filters.sortBy === "priority"}
                        direction={filters.ascending ? "asc" : "desc"}
                        onClick={() => {setFilters({ ...filters, sortBy:  "priority", ascending: !filters.ascending}) ; applyFilters();}}
                        >
                            Priority
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                    <TableSortLabel
                        active={filters.sortBy === "dueDate"}
                        direction={filters.ascending ? "asc" : "desc"}
                        onClick={() => {setFilters({ ...filters, sortBy:  "dueDate", ascending: !filters.ascending}) ; applyFilters();}}
                        >
                            DueDate
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        Actions
                    </TableCell>
                </TableRow>

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
                    <TableCell>
                        
                    </TableCell>
                    <TableCell>
                    <Button variant="contained" color="primary"  onClick={applyFilters}>
                    Apply Filter
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => setFilters({ ...filters, done: [], priority: [], text: "" }) }>
                    Clear Filter
                    </Button>
                    </TableCell>
                </TableRow>
            </TableHead>
           
        </Table>
    )
}
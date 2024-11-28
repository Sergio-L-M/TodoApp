import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  TableSortLabel,
  Chip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import { handlePageChange, handlePageSizeChange, handleSort, handleEdit, handleDelete, handleToggleDone, applyFilters, clearFilters } from "../../features/todoHandlers/todoHandlersIndex";
import { setModalOpen, setFilters } from "../../features/todoSlice";
import TodoModal from "../modal/TodoModal";
const renderPriority = (priority:String) => {
  let color;

  switch (priority) {
    case "HIGH":
      color = "red";
      break;
    case "MEDIUM":
      color = "orange";
      break;
    case "LOW":
      color = "green";
      break;
    default:
      color = "black"; // Color por defecto si no coincide ninguna prioridad
  }

  return (
    <Chip
      label={priority}
      variant="outlined"
      style={{
        color: color,
        borderColor: color,
        backgroundColor: "white",
      }}
    />
  );
};





const TaskTableV2: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, filters, pagination, sortConfig, modalOpen, selectedTask } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    dispatch(applyFilters());
  }, [dispatch]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {/* Headers */}
            <TableRow>
              <TableCell>Done</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.sortBy === "priority"}
                  direction={sortConfig.ascending ? "asc" : "desc"}
                  onClick={() => dispatch(handleSort("priority"))}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.sortBy === "dueDate"}
                  direction={sortConfig.ascending ? "asc" : "desc"}
                  onClick={() => dispatch(handleSort("dueDate"))}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>

            {/* Filters */}
            <TableRow>
              <TableCell>
                <Select
                  multiple
                  value={filters.done}
                  onChange={(e) => dispatch(setFilters({ ...filters, done: e.target.value as string[] }))}
                  renderValue={(selected) => selected.join(", ")}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="true">Done</MenuItem>
                  <MenuItem value="false">Undone</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  value={filters.text}
                  onChange={(e) => dispatch(setFilters({ ...filters, text: e.target.value }))}
                  placeholder="Search name"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Select
                  multiple
                  value={filters.priority}
                  onChange={(e) => dispatch(setFilters({ ...filters, priority: e.target.value as string[] }))}
                  renderValue={(selected) => selected.join(", ")}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                </Select>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => dispatch(applyFilters())} style={{ marginRight: "8px" }}>
                  Apply Filter
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => dispatch(clearFilters())}>
                  Clear Filter
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox checked={task.done} color="primary" onChange={() => dispatch(handleToggleDone(task.id))} />
                </TableCell>
                <TableCell>{task.text}</TableCell>
                <TableCell>{renderPriority(task.priority)}</TableCell>
                <TableCell>{task.dueDate || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginRight: "5px" }}
                    onClick={() => dispatch(handleEdit(task))}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => dispatch(handleDelete(task.id))}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
          <Button variant="contained" color="primary" onClick={() => dispatch(setModalOpen(true))}>
            Add New Task
          </Button>
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={pagination.totalItems}
            rowsPerPage={pagination.pageSize}
            page={pagination.currentPage}
            onPageChange={(_, page) => dispatch(handlePageChange(page))}
            onRowsPerPageChange={(e) => dispatch(handlePageSizeChange(parseInt(e.target.value, 10)))}
          />
        </div>
      </TableContainer>

      <TodoModal open={modalOpen} onClose={() => dispatch(setModalOpen(false))} initialTask={selectedTask} onSuccess={() => dispatch(applyFilters())} />
    </div>
  );
};

export default TaskTableV2;

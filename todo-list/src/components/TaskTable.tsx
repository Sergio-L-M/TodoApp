import React, { useEffect, useState } from "react";
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
  Typography,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  TableSortLabel,
} from "@mui/material";
import axios from "axios";
import TodoModal from "./UpdateCreateTodo/TodoModal";

interface Task {
  id: string;
  text: string;
  priority: string;
  dueDate: string | null;
  done: boolean;
}

const TaskTable: React.FC<{ onTaskUpdate: () => void }> = ({ onTaskUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    done: [] as string[],
    text: "",
    priority: [] as string[],
  });
  const [sortConfig, setSortConfig] = useState<{ sortBy: "dueDate" | "priority"; ascending: boolean }>({
    sortBy: "dueDate",
    ascending: true,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (
    sortBy: "dueDate" | "priority" = sortConfig.sortBy,
    ascending: boolean = sortConfig.ascending,
    page: number = pagination.currentPage,
    pageSize: number = pagination.pageSize
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
      if (sortBy) params.append("sortBy", sortBy);
      if (ascending !== undefined) params.append("ascending", ascending.toString());
      if (filters.text) params.append("startsWith", filters.text);
      if (filters.priority.length > 0) filters.priority.forEach((priority) => params.append("priority", priority));
      if (filters.done.length > 0) filters.done.forEach((done) => params.append("done", done));

      const response = await axios.get(`http://localhost:8080/todos?${params.toString()}`);
      const { todos, totalPages, totalItems } = response.data;

      setTasks(todos);
      setPagination({ currentPage: page, pageSize, totalPages, totalItems });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPagination({ ...pagination, currentPage: newPage });
    fetchTasks(sortConfig.sortBy, sortConfig.ascending, newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPagination({ currentPage: 0, pageSize: newPageSize, totalPages: pagination.totalPages, totalItems: pagination.totalItems });
    fetchTasks(sortConfig.sortBy, sortConfig.ascending, 0, newPageSize);
  };

  const handleToggleDone = async (task: Task) => {
    const updatedDone = !task.done;

    try {
      await axios.put(
        `http://localhost:8080/todos/${task.id}/done`,
        { done: updatedDone },
        { headers: { "Content-Type": "application/json" } }
      );

      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, done: updatedDone } : t)));
    } catch (error) {
      console.error("Failed to toggle done status:", error);
    }
  };
  const handleSort = (column: "dueDate" | "priority") => {
    const isAscending = sortConfig.sortBy === column ? !sortConfig.ascending : true;
    setSortConfig({ sortBy: column, ascending: isAscending });
    fetchTasks(column, isAscending);
  };
  

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedTask(null);
    onTaskUpdate(); 
  };

  const applyFilters = () => {
    fetchTasks();
  };

  const clearFilters = () => {
    setFilters({ done: [], text: "", priority: [] });
    fetchTasks();
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>

            {/* Fila de Headers */}
            <TableRow>
              <TableCell>Done</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.sortBy === "priority"}
                  direction={sortConfig.ascending ? "asc" : "desc"}
                  onClick={() => handleSort("priority")}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.sortBy === "dueDate"}
                  direction={sortConfig.ascending ? "asc" : "desc"}
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
              {/* Fila de Filtros */}
              <TableRow>
              <TableCell>
                <Select
                  multiple
                  value={filters.done}
                  onChange={(e) => setFilters({ ...filters, done: e.target.value as string[] })}
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
                  onChange={(e) => setFilters({ ...filters, text: e.target.value })}
                  placeholder="Search name"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Select
                  multiple
                  value={filters.priority}
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
                <Button variant="contained" color="primary" onClick={applyFilters} style={{ marginRight: "8px" }}>
                  Apply Filter
                </Button>
                <Button variant="outlined" color="secondary" onClick={clearFilters}>
                  Clear Filter
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox checked={task.done} color="primary" onChange={() => handleToggleDone(task)} />
                </TableCell>
                <TableCell>{task.text}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.dueDate || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginRight: "5px" }}
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" size="small">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            Add New Task
          </Button>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.totalItems}
            rowsPerPage={pagination.pageSize}
            page={pagination.currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </div>
      </TableContainer>

      <TodoModal open={openModal} onClose={handleModalClose} initialTask={selectedTask} onSuccess={fetchTasks} />
    </div>
  );
};

export default TaskTable;

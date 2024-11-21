import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  Checkbox,
  Typography,
  TableSortLabel,
} from "@mui/material";
import axios from 'axios';
import TodoModal from './UpdateCreateTodo/TodoModal';

interface Task {
  id: string;
  text: string;
  priority: string;
  dueDate: string | null;
  done: boolean;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortConfig, setSortConfig] = useState<{ sortBy: string; ascending: boolean }>({
    sortBy: 'dueDate',
    ascending: true,
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState({
    done: [] as string[], // Lista para múltiples selecciones
    text: "",
    priority: [] as string[], // Lista para múltiples selecciones
  });
  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async (sortBy?: "dueDate" | "priority", ascending?: boolean) => {
    try {
      // Construir parámetros manualmente
      const params = new URLSearchParams();
  
      if (sortBy) params.append("sortBy", sortBy);
      if (ascending !== undefined) params.append("ascending", ascending.toString());
      if (filters.text) params.append("startsWith", filters.text);
      if (filters.priority.length > 0) {
        filters.priority.forEach((priority) => params.append("priority", priority));
      }
      if (filters.done.length > 0) {
        filters.done.forEach((done) => params.append("done", done));
      }
  
      console.log("Request URL:", `/todos?${params.toString()}`); // Para depuración
  
      const response = await axios.get(`http://localhost:8080/todos?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  


  const handleEdit = (task: Task) => {
    setSelectedTask(task); // Define la tarea seleccionada para editar
    setOpenModal(true); // Abre el modal
  };

  const handleModalClose = () => {
    setOpenModal(false); // Cierra el modal
    setSelectedTask(null); // Limpia la tarea seleccionada
  };
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/todos/${id}`);
      alert('Task deleted successfully');
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleToggleDone = async (task: Task) => {
    const updatedDone = !task.done;
    console.log(`Toggling Done for Task ID: ${task.id}, New Done Value: ${updatedDone}`);
  
    try {
      await axios.put(
        `http://localhost:8080/todos/${task.id}/done`,
        { done: updatedDone },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, done: updatedDone } : t
        )
      );
    } catch (error) {
      console.error('Failed to toggle done status:', error);
    }
  };
  const handleSort = (column: "dueDate" | "priority") => {
    const isAscending = sortConfig.sortBy === column ? !sortConfig.ascending : true;
    setSortConfig({ sortBy: column, ascending: isAscending });
    fetchTasks(column, isAscending);
  };

  
  const applyFilters = () => {
    console.log("Filters applied:", filters);
    fetchTasks();
  };

  
  const clearFilters = () => {
    setFilters({ done: [], text: "", priority: [] });
    fetchTasks(); // Recarga los datos originales
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Task List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Done</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.sortBy === 'priority'}
                  direction={sortConfig.sortBy === 'priority' && sortConfig.ascending ? 'asc' : 'desc'}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.sortBy === 'dueDate'}
                  direction={sortConfig.sortBy === 'dueDate' && sortConfig.ascending ? 'asc' : 'desc'}
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>

            <TableRow>
            <TableCell>
              <Select
                multiple
                value={filters.done}
                onChange={(e) => setFilters({ ...filters, done: e.target.value as string[] })}
                renderValue={(selected) => selected.join(", ")} // Muestra las opciones seleccionadas
                displayEmpty
                fullWidth
              >
                <MenuItem value="true">
                  <Checkbox checked={filters.done.includes("true")} />
                  Done
                </MenuItem>
                <MenuItem value="false">
                  <Checkbox checked={filters.done.includes("false")} />
                  Undone
                </MenuItem>
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
                  onChange={(e) => {
                    const newPriority = e.target.value as string[];
                    console.log("Updated priority filter:", newPriority); // Verificar el cambio
                    setFilters({ ...filters, priority: newPriority });
                  }}
                  renderValue={(selected) => selected.join(", ")}
                  displayEmpty
                  fullWidth
                >

                  <MenuItem value="LOW">
                    <Checkbox checked={filters.priority.includes("LOW")} />
                    Low
                  </MenuItem>
                  <MenuItem value="MEDIUM">
                    <Checkbox checked={filters.priority.includes("MEDIUM")} />
                    Medium
                  </MenuItem>
                  <MenuItem value="HIGH">
                    <Checkbox checked={filters.priority.includes("HIGH")} />
                    High
                  </MenuItem>
                </Select>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  style={{ marginRight: "8px" }}
                >
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
                    <Checkbox
                      checked={!!task.done} // Forzamos a booleano si no es seguro
                      onChange={() => handleToggleDone(task)}
                      color="primary"
                    />
                    </TableCell>
                <TableCell>{task.text}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.dueDate || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginRight: '5px' }}
                    onClick={() => handleEdit(task)} // Abre el modal con la tarea seleccionada
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Modal */}
      <TodoModal
        open={openModal}
        onClose={handleModalClose}
        initialTask={selectedTask}
        onSuccess={fetchTasks} // Refresca la tabla tras editar
      />
    </div>
  );
};

export default TaskTable;

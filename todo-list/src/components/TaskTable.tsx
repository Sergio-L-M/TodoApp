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

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (page: number = pagination.currentPage, pageSize: number = pagination.pageSize) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());
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
    fetchTasks(newPage, pagination.pageSize);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPagination({ currentPage: 0, pageSize: newPageSize, totalPages: pagination.totalPages, totalItems: pagination.totalItems });
    fetchTasks(0, newPageSize);
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
              <TableCell>Priority</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
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
                  <Button variant="outlined" color="secondary" size="small">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px" }}>
          <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
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

      <TodoModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} onSuccess={fetchTasks} />
    </div>
  );
};

export default TaskTable;

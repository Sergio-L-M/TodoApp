import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Checkbox } from '@mui/material';
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/todos');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

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
    const updatedTask = { ...task, done: !task.done };
    try {
      await axios.put(`http://localhost:8080/todos/${task.id}`, updatedTask, {
        headers: { 'Content-Type': 'application/json' },
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };
  const handleEdit = (task: Task) => {
    setSelectedTask(task); // Prepara la tarea para edición
    setOpenModal(true); // Abre el modal
  };

  const refreshTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/todos');
      setTasks(response.data);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
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
                <TableCell>                  <Checkbox
                    checked={task.done}
                    onChange={() => handleToggleDone(task)}
                    color="primary"
                  /></TableCell>
                <TableCell>{task.text}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.dueDate || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(task)}
                    style={{ marginRight: '5px' }}
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
      <TodoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        initialTask={selectedTask}
        onSuccess={refreshTasks} // Refresca la tabla después de actualizar
      />
    </div>
  );
};

export default TaskTable;

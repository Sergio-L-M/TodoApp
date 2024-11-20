import React, { useState, useEffect } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";
import axios from "axios";

interface Task {
  id?: string; // Opcional para tareas nuevas
  text: string;
  priority: string;
  dueDate: string | null;
}

interface TodoModalProps {
  open: boolean;
  onClose: () => void; // Función para cerrar el modal
  initialTask?: Task; // Datos iniciales si es edición
  onSuccess?: () => void; // Callback después de éxito
}

const TodoModal: React.FC<TodoModalProps> = ({ open, onClose, initialTask, onSuccess }) => {
  const [text, setTaskText] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [dueDate, setDueDate] = useState('');

  // Prellenar los campos si se pasa `initialTask` como prop
  useEffect(() => {
    if (initialTask) {
      setTaskText(initialTask.text);
      setPriority(initialTask.priority || '');
      setDueDate(initialTask.dueDate || '');
    } else {
      // Si no es edición, limpiar los campos
      setTaskText('');
      setPriority('');
      setDueDate('');
    }
  }, [initialTask]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const taskData: Task = {
      id: initialTask?.id,
      text,
      priority,
      dueDate: dueDate || null,
    };

    try {
      if (initialTask && initialTask.id) {
        // Modo edición: Realizar PUT
        await axios.put(`http://localhost:8080/todos/${taskData.id}`, taskData, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('Task updated successfully!');
      } else {
        // Modo creación: Realizar POST
        await axios.post('http://localhost:8080/todos', taskData, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('Task created successfully!');
      }

      if (onSuccess) onSuccess(); // Llama al callback para refrescar datos
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Failed to submit task. Check the console for more details.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="todo-modal-title"
      aria-describedby="todo-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: '400px',
        }}
      >
        <Typography id="todo-modal-title" variant="h6" mb={2}>
          {initialTask ? 'Update Task' : 'Create Task'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label>
              Task Name:
              <input
                type="text"
                value={text}
                onChange={(e) => setTaskText(e.target.value)}
                required
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              Priority:
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              Due Date:
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                }}
              />
            </label>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            {initialTask ? 'Update Task' : 'Add Task'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TodoModal;

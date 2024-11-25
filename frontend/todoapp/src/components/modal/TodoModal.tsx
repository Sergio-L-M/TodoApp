import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton, InputAdornment 
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

interface Task {
  id?: string; // Opcional para tareas nuevas
  text: string;
  priority: string;
  dueDate: string | null;
}

interface TodoModalProps {
  open: boolean;
  onClose: () => void;
  initialTask?: Task | null; // Acepta undefined o null
  onSuccess?: () => void; // Callback para actualizar la tabla
}

const TodoModal: React.FC<TodoModalProps> = ({ open, onClose, initialTask, onSuccess }) => {
  const [text, setTaskText] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");

  // Prellenar los campos si se pasa `initialTask` como prop
  useEffect(() => {
    if (initialTask) {
      setTaskText(initialTask.text || "");
      setPriority(initialTask.priority || "LOW");
      setDueDate(initialTask.dueDate || "");
    } else {
      setTaskText("");
      setPriority("LOW");
      setDueDate("");
    }
  }, [initialTask]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const taskData: Task = {
      text,
      priority: priority || "LOW", // Enviar null si está vacío
      dueDate: dueDate || "",   // Enviar null si está vacío
    };

  
    try {
      if (initialTask && initialTask.id) {
        // Modo edición: Realizar PUT
        await axios.put(`http://localhost:9090/todos/${initialTask.id}`, taskData, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Task updated successfully!");
      } else {
        // Modo creación: Realizar POST
        await axios.post("http://localhost:9090/todos", taskData, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Task created successfully!");
      }
  
      if (onSuccess) onSuccess(); // Actualiza la tabla
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Failed to submit task. Check the console for more details.");
    }
  };
  const handleClearDate = () => {
    setDueDate(""); // Establece el estado de la fecha como vacío
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: "400px",
        }}
      >
        <Typography variant="h6" mb={2}>
          {initialTask ? "Update Task" : "Create Task"}
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Campo para el nombre de la tarea */}
          <TextField
            label="Task Name"
            value={text}
            onChange={(e) => setTaskText(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
        label="Due Date"
        type="date"
        value={dueDate || ""}
        onChange={(e) => setDueDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          endAdornment: dueDate && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearDate} aria-label="Clear date">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            color: dueDate ? "inherit" : "white", // Cambia el color si no hay fecha seleccionada
          },
        }}
        placeholder="No date selected"
      />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {initialTask ? "Update Task" : "Add Task"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TodoModal;

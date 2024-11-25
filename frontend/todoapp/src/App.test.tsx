import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("ToDo App - Task Creation Component Interaction", () => {
  it("should open the modal, allow task creation, and update the task list", async () => {
    // Renderizar la aplicación
    render(<App />);

    // Verificar que el botón "Add New Task" está visible
    const addTaskButton = screen.getByText(/Add New Task/i);
    expect(addTaskButton).toBeInTheDocument();

    // Abrir el modal
    fireEvent.click(addTaskButton);

    // Verificar que el modal se muestra
    expect(screen.getByText(/Create Task/i)).toBeInTheDocument();

    // Completar el formulario
    const taskNameInput = screen.getByLabelText(/Task Name/i);
    userEvent.type(taskNameInput, "Frontend Task");

    const prioritySelect = screen.getByLabelText(/Priority/i);
    fireEvent.change(prioritySelect, { target: { value: "HIGH" } });

    const dueDateInput = screen.getByLabelText(/Due Date/i);
    fireEvent.change(dueDateInput, { target: { value: "2024-12-01" } });

    // Simular envío del formulario
    const submitButton = screen.getByText(/Add Task/i);
    fireEvent.click(submitButton);

    // Validar que el modal se cierra después del envío
    await waitFor(() => {
      expect(screen.queryByText(/Create Task/i)).not.toBeInTheDocument();
    });

    // Validar que la nueva tarea aparece en la lista de tareas
    await waitFor(() => {
      expect(screen.getByText(/Frontend Task/i)).toBeInTheDocument();
      expect(screen.getByText(/HIGH/i)).toBeInTheDocument();
      expect(screen.getByText(/2024-12-01/i)).toBeInTheDocument();
    });
  });
});

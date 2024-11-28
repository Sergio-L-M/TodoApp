import React, { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TodoModal from "./components/modal/TodoModal";

describe("TodoModal Component", () => {
  it("renders correctly when open", () => {
    render(<TodoModal open={true} onClose={jest.fn()} onSuccess={jest.fn()} />);
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  it("calls handleModalClose and closes the modal when Escape is pressed", () => {
    const handleModalClose = jest.fn();
    const Wrapper = () => {
      const [open, setOpen] = useState(true);

      const handleClose = () => {
        setOpen(false); 
        handleModalClose(); 
      };

      return (
        <TodoModal
          open={open}
          onClose={handleClose}
          initialTask={null}
          onSuccess={jest.fn()}
        />
      );
    };

    render(<Wrapper />);
    expect(screen.getByText("Create Task")).toBeInTheDocument();
    const modalNode = screen.getByText("Create Task").closest("div");
    act(() => {
      fireEvent.keyDown(modalNode || document, { key: "Escape" });
    });
    expect(handleModalClose).toHaveBeenCalled();
    expect(screen.queryByText("Create Task")).not.toBeInTheDocument();
  });
  it("creates a new task and shows a success alert", async () => {
    const mockOnSuccess = jest.fn();
    const mockOnClose = jest.fn();
  
    // Mockea window.alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  
    render(
      <TodoModal
        open={true}
        onClose={mockOnClose}
        initialTask={null}
        onSuccess={mockOnSuccess}
      />
    );
  
    // Llenar los campos del formulario
    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: "Integration Test Task" },
    });
  
    fireEvent.mouseDown(screen.getByLabelText(/priority/i));
    const priorityOption = screen.getByText("Medium");
    fireEvent.click(priorityOption);
  
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: "2024-12-31" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /add task/i }));
    });
  
    expect(alertMock).toHaveBeenCalledWith("Task created successfully!");
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  
    alertMock.mockRestore();
  });
  
});

import { AppDispatch, RootState } from "../../app/store";
import { fetchTodos } from "../todoSlice";
import axios from "axios";

export const handleDelete = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        // Realiza la solicitud para eliminar la tarea
        await axios.delete(`http://localhost:9090/todos/${id}`);
        alert("Task deleted successfully");

        // Obtiene el estado actual de sortConfig y pagination
        const state = getState();
        const { sortConfig, pagination } = state.todos;

        // Llama a fetchTodos con los argumentos requeridos
        dispatch(fetchTodos({
            sortBy: sortConfig.sortBy,
            ascending: sortConfig.ascending,
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
        }));
    } catch (error) {
        console.error("Failed to delete task:", error);
        alert("Failed to delete task. Please try again.");
    }
};

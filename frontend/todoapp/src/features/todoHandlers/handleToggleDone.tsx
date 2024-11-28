// features/todoHandlers/handlePageChange.ts
import { AppDispatch, RootState } from "../../app/store";
import { fetchTodos, setPagination } from "../todoSlice";
import axios from "axios";

export const handleToggleDone = (taskId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const task = state.todos.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedDone = !task.done;

    try {
        await axios.put(
            `http://localhost:9090/todos/${taskId}/done`,
            { done: updatedDone },
            { headers: { "Content-Type": "application/json" } }
        );
        dispatch(fetchTodos({
            sortBy: state.todos.sortConfig.sortBy,
            ascending: state.todos.sortConfig.ascending,
            page: state.todos.pagination.currentPage,
            pageSize: state.todos.pagination.pageSize,
        }));
    } catch (error) {
        console.error("Failed to toggle done status:", error);
    }
};

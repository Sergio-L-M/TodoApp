import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { initialTodoState } from "./globalStates";
import { todoInterface } from "../components/table/helpers/todoInterface";

export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async (payload: { sortBy: string; ascending: boolean; page: number; pageSize: number }, { getState }) => {
        const state = getState() as { todos: typeof initialTodoState };
        const { filters } = state.todos;

        const params = new URLSearchParams();
        params.append("page", payload.page.toString());
        params.append("pageSize", payload.pageSize.toString());
        if (payload.sortBy) params.append("sortBy", payload.sortBy);
        if (payload.ascending !== undefined) params.append("ascending", payload.ascending.toString());
        if (filters.text) params.append("startsWith", filters.text);
        if (filters.priority.length > 0)
            filters.priority.forEach((priority) => params.append("priority", priority));
        if (filters.done.length > 0) filters.done.forEach((done) => params.append("done", done));

        const response = await axios.get(`http://localhost:9090/todos?${params.toString()}`);
        return response.data; 
    }
);


const todosSlice = createSlice({
    name: "todos",
    initialState: initialTodoState,
    reducers: {
        setSortConfig(state, action: PayloadAction<typeof initialTodoState.sortConfig>) {
            state.sortConfig = action.payload;
        },
        setPagination(state, action: PayloadAction<typeof initialTodoState.pagination>) {
            state.pagination = action.payload;
        },
        setFilters(state, action: PayloadAction<typeof initialTodoState.filters>) {
            state.filters = action.payload;
        },
        setSelectedTask(state, action: PayloadAction<todoInterface | null>) { // Nueva acción
            state.selectedTask = action.payload;
        },
        setModalOpen(state, action: PayloadAction<boolean>) { // Nueva acción
            state.modalOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                const { todos, totalPages, totalItems } = action.payload;
                state.tasks = todos;
                state.pagination.totalPages = totalPages;
                state.pagination.totalItems = totalItems;
                state.loading = false;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error fetching tasks";
            });
    },
});

export const { setSortConfig, setPagination, setFilters, setSelectedTask, setModalOpen } = todosSlice.actions;
export default todosSlice.reducer;

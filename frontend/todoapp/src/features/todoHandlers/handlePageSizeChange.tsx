// features/todoHandlers/handlePageChange.ts
import { AppDispatch, RootState } from "../../app/store";
import { fetchTodos, setPagination } from "../todoSlice";

export const handlePageSizeChange = (newPageSize: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { totalPages, totalItems } = state.todos.pagination;

    dispatch(setPagination({ 
        currentPage: 0, 
        pageSize: newPageSize, 
        totalPages, 
        totalItems 
    }));

    dispatch(fetchTodos({ 
        sortBy: state.todos.sortConfig.sortBy, 
        ascending: state.todos.sortConfig.ascending, 
        page: 0, 
        pageSize: newPageSize 
    }));
};

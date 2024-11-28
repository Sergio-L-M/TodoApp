// features/todoHandlers/handlePageChange.ts
import { AppDispatch, RootState } from "../../app/store";
import { fetchTodos, setSortConfig } from "../todoSlice";

export const handleSort = (column: "dueDate" | "priority") => (dispatch: AppDispatch, getState: () => RootState) => {
    const { sortConfig } = getState().todos;

    const isAscending = sortConfig.sortBy === column ? !sortConfig.ascending : true;
    dispatch(setSortConfig({ sortBy: column, ascending: isAscending }));

    const { pagination } = getState().todos;
    dispatch(fetchTodos({ 
        sortBy: column, 
        ascending: isAscending, 
        page: pagination.currentPage, 
        pageSize: pagination.pageSize 
    }));
};

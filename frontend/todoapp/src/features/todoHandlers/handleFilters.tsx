import { AppDispatch, RootState } from "../../app/store";
import {setFilters, fetchTodos} from "../todoSlice";


export const applyFilters = () => (dispatch: AppDispatch,  getState: () => RootState) => {
    const state = getState();
    const { sortConfig, pagination } = state.todos;
    dispatch(fetchTodos({
        sortBy: sortConfig.sortBy,
        ascending: sortConfig.ascending,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
    }));
};

export const clearFilters = () => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setFilters({ done: [], text: "", priority: [] }));
    const state = getState();
    const { sortConfig, pagination } = state.todos;
    dispatch(fetchTodos({
        sortBy: sortConfig.sortBy,
        ascending: sortConfig.ascending,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
    }));
};

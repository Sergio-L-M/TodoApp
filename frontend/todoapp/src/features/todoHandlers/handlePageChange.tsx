import { AppDispatch, RootState } from "../../app/store";
import { setPagination, fetchTodos } from "../todoSlice";

export const handlePageChange = (newPage: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { sortConfig, pagination } = getState().todos;

    dispatch(setPagination({ ...pagination, currentPage: newPage }));
    dispatch(fetchTodos({
        sortBy: sortConfig.sortBy,
        ascending: sortConfig.ascending,
        page: newPage,
        pageSize: pagination.pageSize,
    }));
};


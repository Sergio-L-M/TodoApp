import { AppDispatch, RootState } from "../../app/store";
import {setSelectedTask, setModalOpen } from "../todoSlice";
import { todoInterface } from "../../components/table/helpers/todoInterface";

export const handleEdit = (todo: todoInterface) => (dispatch: AppDispatch) => {
    dispatch(setSelectedTask(todo)); // Debes crear un `setSelectedTask` en el slice
    dispatch(setModalOpen(true));   // Debes crear un `setModalOpen` en el slice
};

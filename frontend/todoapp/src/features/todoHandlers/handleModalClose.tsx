import { AppDispatch, RootState } from "../../app/store";
import {setSelectedTask, setModalOpen } from "../todoSlice";

export const handleModalClose = () => (dispatch: AppDispatch) => {
    dispatch(setSelectedTask(null));
    dispatch(setModalOpen(false));
};

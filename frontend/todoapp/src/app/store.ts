// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../features/todoSlice";


export const store = configureStore({
    reducer: {
        todos: todosReducer, // Agregar más reducers aquí si es necesario
    },
});

// Tipos para Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

// features/globalStates.ts
import { todoInterface } from "../components/table/helpers/todoInterface";
export const initialTodoState = {
    tasks: [] as todoInterface[], // Cambia "todoInterface" por el tipo real si es diferente
    openModal: false, // Cambia el nombre a "modalOpen" si esto causa confusión
    modalOpen: false, // Debes incluir esta propiedad si no está presente
    selectedTask: null as todoInterface | null,
    pagination: {
        currentPage: 0,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0,
    },
    filters: {
        done: [] as string[],
        text: "",
        priority: [] as string[],
    },
    sortConfig: {
        sortBy: "dueDate" as "dueDate" | "priority",
        ascending: true,
    },
    loading: false,
    error: null as string | null,
};

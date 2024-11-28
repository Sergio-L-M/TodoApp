import { Chip } from "@mui/material";

export interface Filters {
    sortBy?: string;
    ascending?: boolean;
    page?: number;
    pageSize?: number;
    text?: string;
    priority?: string[];
    done?: string[];
  }
interface Todo {
    id: string;
    text: string;
    priority: string;
    dueDate: string | null;
    done: boolean;
}

interface response{
  pageSize:number;
  todos:Todo[];
  totalPages:number;
  currentPage:number;
  totalItems:number;

}
export interface TodoContentTableProps {
    filters: Filters;
    reloadContent: boolean;
  }
export const renderPriority = (priority:String) => {
    let color;
    switch (priority) {
      case "HIGH":
        color = "red";
        break;
      case "MEDIUM":
        color = "orange";
        break;
      case "LOW":
        color = "green";
        break;
      default:
        color = "black"; // Color por defecto si no coincide ninguna prioridad
    }
  
    return (
      <Chip
        label={priority}
        variant="outlined"
        style={{
          color: color,
          borderColor: color,
          backgroundColor: "white",
        }}
      />
    );
  };

  
export const fetchTodos = async (filters: Filters): Promise<response> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.ascending !== undefined) params.append("ascending", filters.ascending.toString());
  if (filters.text) params.append("startsWith", filters.text);
  if (filters.priority && filters.priority.length > 0) {
    filters.priority.forEach((priority) => params.append("priority", priority));
  }
  if (filters.done && filters.done.length > 0) {
    filters.done.forEach((done) => params.append("done", done.toString()));
  }

  const response = await fetch(`http://localhost:9090/todos?${params.toString()}`);
  if (!response.ok) throw new Error("Error al cargar los datos");
  const data = await response.json();

  // Validar que `data` sea un array
  if (!Array.isArray(data.todos)) {
    throw new Error("La respuesta no es un array");
  }
  return data; // Devuelve el array
};

import React, { useEffect, useState } from "react";
import { TableRow, TableCell, Checkbox, Table, Chip, Button, TableBody } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { renderPriority, fetchTodos } from "./utils/TodoContentTableUtils";
import TodoModal from "../modal/TodoModal";
import axios from "axios";
import { useMetrics } from "../metrics/MetricContext";

export interface Filters {
    sortBy?: string;
    ascending?: boolean;
    page?: number;
    pageSize?: number;
    text?: string;
    priority?: string[];
    done?: string[];
  }

interface Pagination{
    pageSize: number;
    totalPages: number;
    currentPage:number;
    totalItems:number;

}
interface Todo {
    id: string;
    text: string;
    priority: string;
    dueDate: string | null;
    done: boolean;
}

interface TodoContentTableProps {
    filters: Filters;
    reloadContent: boolean;
    updatePagination: (pagination: Pagination) => void; // Nueva prop para actualizar la paginación
  }

export const TodoContentTable: React.FC<TodoContentTableProps> = ({filters, reloadContent, updatePagination}) => {
const { fetchMetrics } = useMetrics(); 

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState<Todo>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [reloadNewContent, setReloadNewContent] = useState<boolean>(false);
  
  const updateTodos = async  () => {
    setReloadNewContent((prev) => !prev); // Alterna el estado actual
    await fetchMetrics();

  };
  const handleDelete = async (id: string) => {
  try {
      await axios.delete(`http://localhost:9090/todos/${id}`);
      alert("Task deleted successfully");
      updateTodos();
  } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again.");
  }
  };

  const handleToggleDone = async (taskId: string, prevDoneVal: boolean) => {

    try {
        await axios.put(
            `http://localhost:9090/todos/${taskId}/done`,
            { done: !prevDoneVal },
            { headers: { "Content-Type": "application/json" } }
        );
       updateTodos();

    } catch (error) {
        console.error("Failed to toggle done status:", error);
    }
  };

  useEffect(() =>{
    const loadTodos = async () =>{
      try{
        const data  = await fetchTodos(filters);
        setTodos(data.todos);
        updatePagination({
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            totalItems: data.totalItems,
          });
      }
      catch(error){
        console.error("Error al cargar los datos:", error);
      }
    };
    loadTodos();
  }, [reloadContent, reloadNewContent])
  return (
  
    <>
        {todos.map((todoTask)=>(
            <TableRow key={todoTask.id}>
                <TableCell>
                    <Checkbox  checked={todoTask.done} color="primary" onChange={() => handleToggleDone(todoTask.id, todoTask.done)}/>
                </TableCell>
                <TableCell>
                    {todoTask.text}
                </TableCell>
                <TableCell>
                    {renderPriority(todoTask.priority)}
                </TableCell>
                <TableCell>
                    {todoTask.dueDate || "-"}
                </TableCell>
                <TableCell>
                    <Button size="small" style={{ marginRight: "5px" }} onClick ={()=>{setTodo(todoTask); setModalOpen(true)}}>
                        <EditIcon/>
                    </Button>
        
                    <Button size="small" onClick = {() => {handleDelete(todoTask.id)}}>
                        <DeleteIcon/>
                    </Button>
                </TableCell>
                
            </TableRow>
        
        ))
        }
         
   
    <TodoModal open={modalOpen} onClose={() => setModalOpen(false)} initialTask={todo} onSuccess={() => updateTodos()} />
    </>
    );

};
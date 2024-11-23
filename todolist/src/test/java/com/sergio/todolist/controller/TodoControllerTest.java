package com.sergio.todolist.controller;

import com.sergio.todolist.model.Todo;
import com.sergio.todolist.service.TodoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class) // Prueba del controlador específico
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc; // Simula las solicitudes HTTP

    @MockBean
    private TodoService todoService; // Simula el servicio usado por el controlador

    // Prueba: Crear 30 tareas
    @Test
    void testCreateTodos() throws Exception {
        for (int i = 1; i <= 30; i++) {
            String jsonTodo = String.format("""
                {
                    "text": "Tarea %d",
                    "priority": "%s",
                    "dueDate": "2024-12-%02d"
                }
            """, i, i % 3 == 0 ? "HIGH" : (i % 3 == 1 ? "MEDIUM" : "LOW"), i);

            Todo todo = new Todo();
            todo.setId(String.valueOf(i));
            todo.setText("Tarea " + i);
            todo.setPriority(i % 3 == 0 ? Todo.Priority.HIGH : (i % 3 == 1 ? Todo.Priority.MEDIUM : Todo.Priority.LOW));
            todo.setDueDate(null);

            when(todoService.save(any(Todo.class))).thenReturn(todo);

            mockMvc.perform(post("/todos")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(jsonTodo))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.text").value("Tarea " + i));
        }
    }

    // Prueba: Editar una tarea existente
    @Test
    void testUpdateTodo() throws Exception {
        String updatedTodoJson = """
            {
                "text": "Tarea actualizada",
                "priority": "HIGH",
                "dueDate": "2024-12-31"
            }
        """;

        when(todoService.updateById(eq("1"), any(Todo.class))).thenReturn(true);

        mockMvc.perform(put("/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedTodoJson))
                .andExpect(status().isNoContent()); // Verifica que la respuesta sea 204
    }
    @Test
    void testFilterSortPaginateTodos() throws Exception {
        // Simula una lista de 5 tareas
        List<Todo> todos = IntStream.rangeClosed(1, 5).mapToObj(i -> {
            Todo todo = new Todo();
            todo.setId(String.valueOf(i));
            todo.setText("Tarea " + i);
            todo.setPriority(i % 2 == 0 ? Todo.Priority.HIGH : Todo.Priority.LOW);
            todo.setDone(false);
            return todo;
        }).collect(Collectors.toList());
    
        // Simula que el servicio devuelva las 5 tareas para filtros y ordenamientos
        when(todoService.findAll()).thenReturn(todos);
        when(todoService.filterAndSortTodos(anyList(), any(), any(), any(), any(), any()))
                .thenReturn(todos.subList(0, 2)); // Simula solo 2 tareas después del filtro
        when(todoService.getPage(anyList(), eq(0), eq(10)))
                .thenReturn(todos.subList(0, 2)); // Simula solo la página 0 con 2 tareas
    
        // Realiza la solicitud GET al endpoint
        mockMvc.perform(get("/todos?page=0&pageSize=10"))
                .andExpect(status().isOk()) // Verifica que el estado sea 200
                .andExpect(jsonPath("$.todos.length()").value(2)); // Verifica que haya 2 tareas
    }
    
    // Prueba: Marcar tarea como hecha
    @Test
    void testMarkTodoAsDone() throws Exception {
        // Simula que el servicio actualiza correctamente la tarea
        when(todoService.updateDoneStatus("1", true)).thenReturn(true);

        // Cuerpo de la solicitud (JSON)
        String requestBody = """
            {
                "done": true
            }
        """;

        // Realiza la solicitud PUT con el cuerpo JSON
        mockMvc.perform(put("/todos/1/done")
                .contentType(MediaType.APPLICATION_JSON) // Tipo de contenido JSON
                .content(requestBody)) // Cuerpo de la solicitud
                .andExpect(status().isNoContent()); // Verifica que el estado sea 204
    }

    // Prueba: Marcar tarea como deshecha
    @Test
    void testMarkTodoAsUndone() throws Exception {
        // Simula que el servicio actualiza correctamente la tarea
        when(todoService.updateDoneStatus("1", false)).thenReturn(true);
    
        // Cuerpo de la solicitud (JSON)
        String requestBody = """
            {
                "done": false
            }
        """;
    
        // Realiza la solicitud PUT con el cuerpo JSON
        mockMvc.perform(put("/todos/1/done")
                .contentType(MediaType.APPLICATION_JSON) // Tipo de contenido JSON
                .content(requestBody)) // Cuerpo de la solicitud
                .andExpect(status().isNoContent()); // Verifica que el estado sea 204
    }
    
    @Test
    void testMetrics() throws Exception {
        // Simula el resultado del servicio
        when(todoService.calculateAverageTime()).thenReturn(900.0);
        when(todoService.calculateAverageTimeByPriority()).thenReturn(
            Map.of(
                Todo.Priority.HIGH, 1500.0,
                Todo.Priority.MEDIUM, 1200.0,
                Todo.Priority.LOW, 0.0
            )
        );
    
        // Realiza la solicitud GET al endpoint
        mockMvc.perform(get("/todos/metrics/pending"))
                .andExpect(status().isOk()) // Verifica que el estado sea 200
                .andExpect(jsonPath("$.averageTime").value("900.00 minutes")) // Verifica el tiempo promedio general
                .andExpect(jsonPath("$.averageTimeHigh").value("1500.00 minutes")) // Verifica prioridad HIGH
                .andExpect(jsonPath("$.averageTimeMedium").value("1200.00 minutes")) // Verifica prioridad MEDIUM
                .andExpect(jsonPath("$.averageTimeLow").value("0.00 minutes")); // Verifica prioridad LOW
    }
    @Test
    void testGetTodosPagination() throws Exception {
        List<Todo> todos = IntStream.rangeClosed(1, 29).mapToObj(i -> {
            Todo todo = new Todo();
            todo.setId(String.valueOf(i));
            todo.setText("Tarea " + i);
            todo.setPriority(i % 2 == 0 ? Todo.Priority.HIGH : Todo.Priority.LOW);
            todo.setDone(false);
            return todo;
        }).collect(Collectors.toList());

        when(todoService.findAll()).thenReturn(todos);
        when(todoService.filterAndSortTodos(anyList(), any(), any(), any(), any(), any()))
                .thenReturn(todos);
        when(todoService.getPage(anyList(), eq(0), eq(10)))
                .thenReturn(todos.subList(0, 10));

        mockMvc.perform(get("/todos?page=0&pageSize=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.totalPages").value(3))
                .andExpect(jsonPath("$.totalItems").value(29))
                .andExpect(jsonPath("$.todos.length()").value(10));
    }

        
    
}

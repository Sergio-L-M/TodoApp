package com.sergio.todolist.controller;

import com.sergio.todolist.model.Todo;
import com.sergio.todolist.service.TodoService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {
    private final TodoService todoService;

    public TodoController(TodoService todoService){
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody @Valid Todo todo) {
        //TODO: process POST request
        System.out.println("Se hixo unn post");
        Todo createdTodo = todoService.save(todo);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getTodos(
            @RequestParam(defaultValue = "0") int page,               // Número de página (por defecto 0)
            @RequestParam(defaultValue = "10") int pageSize,          // Tamaño de página (por defecto 10)
            @RequestParam(required = false) String sortBy,            // Ordenar por "dueDate" o "priority"
            @RequestParam(required = false) Boolean ascending,        // true para ascendente, false para descendente
            @RequestParam(required = false) String startsWith,        // Filtrar por palabras iniciales
            @RequestParam(required = false) List<String> priority,    // Lista de prioridades
            @RequestParam(required = false) List<Boolean> done        // Lista de estados
    ) {
        // Obtiene todas las tareas
        List<Todo> allTodos = todoService.findAll();
    
        // Filtra y ordena las tareas
        List<Todo> filteredAndSortedTodos = todoService.filterAndSortTodos(
            allTodos,
            sortBy,
            ascending,
            startsWith,
            priority,
            done
        );
    
        // Calcula el número total de páginas
        int totalItems = filteredAndSortedTodos.size();
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
    
        // Aplica paginación solo a los datos filtrados y ordenados
        List<Todo> paginatedTodos = todoService.getPage(filteredAndSortedTodos, page, pageSize);
    
        // Crea la respuesta con los datos de la página y el total de páginas
        Map<String, Object> response = Map.of(
                "currentPage", page,
                "pageSize", pageSize,
                "totalPages", totalPages,
                "totalItems", totalItems,
                "todos", paginatedTodos
        );
    
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/metrics/pending")
    public ResponseEntity<Map<String, String>> getPendingMetrics() {
        double averageTime = todoService.calculateAverageTime();
        Map<Todo.Priority, Double> averageTimeByPriority = todoService.calculateAverageTimeByPriority();
    
        Map<String, String> response = Map.of(
                "averageTime", String.format("%.2f minutes", averageTime),
                "averageTimeHigh", String.format("%.2f minutes", averageTimeByPriority.getOrDefault(Todo.Priority.HIGH, 0.0)),
                "averageTimeMedium", String.format("%.2f minutes", averageTimeByPriority.getOrDefault(Todo.Priority.MEDIUM, 0.0)),
                "averageTimeLow", String.format("%.2f minutes", averageTimeByPriority.getOrDefault(Todo.Priority.LOW, 0.0))
        );
    
        return ResponseEntity.ok(response);
    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id){
        boolean deleted = todoService.deleteById(id);
        if (deleted){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateTodo(@PathVariable String id, @RequestBody @Valid Todo updatedTodo){
        boolean updated = todoService.updateById(id, updatedTodo);
        if (updated){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/{id}/done")
    public ResponseEntity<Void> markAsDone(@PathVariable String id, @RequestBody Map<String, Boolean> request) {
        // Extraemos el valor de "done" del cuerpo de la solicitud
        Boolean done = request.get("done");

        if (done == null) {
            return ResponseEntity.badRequest().build();  // Devuelve 400 si "done" no está en el cuerpo
        }

        boolean updated = todoService.updateDoneStatus(id, done);  // Llama al servicio para actualizar

        if (updated) {
            return ResponseEntity.noContent().build();  // Devuelve 204 No Content si se actualizó
        } else {
            return ResponseEntity.notFound().build();  // Devuelve 404 si el id no existe
        }
    }

}

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
        Todo createdTodo = todoService.save(todo);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Todo>> getTodos(
            @RequestParam(required = false) String sortBy,              // Ordenar por "dueDate" o "priority"
            @RequestParam(required = false) Boolean ascending,         // true para ascendente, false para descendente
            @RequestParam(required = false) String startsWith,         // Palabras que empiecen con estas letras
            @RequestParam(required = false) List<String> priority,     // Lista de prioridades ("HIGH", "MEDIUM", "LOW")
            @RequestParam(required = false) List<Boolean> done         // Lista de estados (true, false)
    ) {
        List<Todo> todos = todoService.findAll();  // Obtiene todas las tareas

        // Aplicar filtros y ordenamiento
        todos = todoService.filterAndSortTodos(todos, sortBy, ascending, startsWith, priority, done);

        return ResponseEntity.ok(todos);  // Devuelve la lista filtrada y ordenada
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
    public ResponseEntity<Void> updateDoneStatus(@PathVariable String id, @RequestBody Map<String, Boolean> request) {
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

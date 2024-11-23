package com.sergio.todolist.service;

import com.sergio.todolist.model.Todo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Optional;
import java.util.Map;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.Duration;

@Service
public class TodoService {
    private final Map<String, Todo> todoDatabase = new HashMap<>();
    public Todo save(Todo todo){
        if(todo.getId() == null){
            todo.setId(UUID.randomUUID().toString());
        }
        todo.setCreationDate(LocalDate.now());
        todoDatabase.put(todo.getId(), todo);
        System.out.println("Nuevo todo creado: " + todo);
        return todo;
    }

    public Optional<Todo> findById(String id){
        return Optional.ofNullable(todoDatabase.get(id));
    }

    public boolean deleteById(String id){
        if (todoDatabase.containsKey(id)){
            todoDatabase.remove(id);
            return true;
        }
        return false;
    }

    public boolean updateById(String id, Todo updateTodo){
        Todo existigTodo = todoDatabase.get(id);
        if (existigTodo != null){
            if(updateTodo.getText() != null){
                existigTodo.setText(updateTodo.getText());
            }
            if(updateTodo.getDueDate() != null){
                existigTodo.setDueDate(updateTodo.getDueDate());
            }
            if(updateTodo.getPriority() != null){
                existigTodo.setPriority(updateTodo.getPriority());
            }
            return true;
        }
        return false;
    }

    public boolean updateDoneStatus(String id, boolean done){
        Todo existingTodo = todoDatabase.get(id);
        if (existingTodo != null){
            existingTodo.setDone(done);
            if(done){
                existingTodo.setDoneDate(LocalDate.now());
            }
            else{
                existingTodo.setDoneDate(null);
            }
            return true;
        }
        return false;
    }
    
    public List<Todo> findAll(){
        return todoDatabase.values().stream().collect(Collectors.toList());
    }

    public List<Todo> filterAndSortTodos(
        List<Todo> todos,
        String sortBy,
        Boolean ascending,
        String startsWith,
        List<String> priorities,
        List<Boolean> doneStates
    ) {
    // Filtrar por palabras que comienzan con startsWith
    if (startsWith != null) {
        todos = todos.stream()
                .filter(todo -> todo.getText().toLowerCase().startsWith(startsWith.toLowerCase()))
                .collect(Collectors.toList());
    }

    // Filtrar por prioridades
    if (priorities != null && !priorities.isEmpty()) {
        todos = todos.stream()
                .filter(todo -> priorities.contains(todo.getPriority().toString()))
                .collect(Collectors.toList());
    }

    // Filtrar por estados (done/undone)
    if (doneStates != null && !doneStates.isEmpty()) {
        todos = todos.stream()
                .filter(todo -> doneStates.contains(todo.isDone()))
                .collect(Collectors.toList());
    }

    // Ordenar por dueDate o priority
    if (sortBy != null) {
        Comparator<Todo> comparator = "dueDate".equals(sortBy)
                ? Comparator.comparing(Todo::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()))
                : Comparator.comparing(Todo::getPriority);

        if (Boolean.FALSE.equals(ascending)) {
            comparator = comparator.reversed();
        }

        todos = todos.stream().sorted(comparator).collect(Collectors.toList());
    }

        return todos;
    }


    public List<Todo> getPage(List<Todo> todos, int page, int pageSize) {
        int fromIndex = page * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, todos.size());

        if (fromIndex > todos.size()) {
            return Collections.emptyList(); // Devuelve lista vacía si la página está fuera de rango
        }

        return todos.subList(fromIndex, toIndex);
    }


    public double calculateAverageTime() {
        List<Todo> pendingTodos = todoDatabase.values().stream()
                .filter(todo -> !todo.isDone() && todo.getDueDate() != null) // Filtra las tareas pendientes con dueDate
                .collect(Collectors.toList());
    
        return pendingTodos.stream()
                .mapToLong(todo -> Duration.between(todo.getCreationDate().atStartOfDay(), todo.getDueDate().atStartOfDay()).toMinutes())
                .average()
                .orElse(0); // Retorna 0 si no hay tareas pendientes con dueDate
    }
    

    public Map<Todo.Priority, Double> calculateAverageTimeByPriority() {
        return todoDatabase.values().stream()
                .filter(todo -> !todo.isDone() && todo.getDueDate() != null) // Filtra las tareas pendientes con dueDate
                .collect(Collectors.groupingBy(
                        Todo::getPriority,
                        Collectors.averagingDouble(todo -> Duration.between(todo.getCreationDate().atStartOfDay(), todo.getDueDate().atStartOfDay()).toMinutes())
                ));
    }
    
    
}

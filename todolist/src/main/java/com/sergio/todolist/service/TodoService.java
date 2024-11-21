package com.sergio.todolist.service;

import com.sergio.todolist.model.Todo;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Optional;
import java.util.Map;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
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
        List<String> priorities,  // Lista de prioridades
        List<Boolean> doneStates  // Lista de estados
) {
    // Filtro: Palabras que empiezan con "startsWith"
    if (startsWith != null) {
        todos = todos.stream()
                .filter(todo -> todo.getText().toLowerCase().startsWith(startsWith.toLowerCase()))
                .collect(Collectors.toList());
    }

    // Filtro: Filtrar por lista de prioridades
    if (priorities != null && !priorities.isEmpty()) {
        todos = todos.stream()
                .filter(todo -> priorities.contains(todo.getPriority().toString()))
                .collect(Collectors.toList());
    }

    // Filtro: Filtrar por lista de estados "done"
    if (doneStates != null && !doneStates.isEmpty()) {
        todos = todos.stream()
                .filter(todo -> doneStates.contains(todo.isDone()))
                .collect(Collectors.toList());
    }

    // Ordenar: Por "dueDate" o "priority"
    if (sortBy != null) {
        Comparator<Todo> comparator;
        switch (sortBy) {
            case "dueDate":
                comparator = Comparator.comparing(Todo::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "priority":
                comparator = Comparator.comparing(Todo::getPriority);
                break;
            default:
                throw new IllegalArgumentException("Sort by must be 'dueDate' or 'priority'");
        }

        if (Boolean.FALSE.equals(ascending)) {  // Si "ascending" es false, invierte el orden
            comparator = comparator.reversed();
        }

        todos = todos.stream().sorted(comparator).collect(Collectors.toList());
    }
   
    return todos;  // Devuelve la lista filtrada y ordenada
}




    
}

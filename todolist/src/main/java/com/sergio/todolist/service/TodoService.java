package com.sergio.todolist.service;

import com.sergio.todolist.model.Todo;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
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



    
}

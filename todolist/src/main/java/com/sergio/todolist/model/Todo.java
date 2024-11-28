package com.sergio.todolist.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;



@Data
public class Todo {
    private String id;
    
    @NotBlank(message = "Text is required")
    @Size(max = 120, message = "Text maximium length is 120 characters")
    private String text;

    private LocalDate dueDate;
    private boolean done;
    private LocalDate doneDate;

    @NotNull(message= "Priority is required")
    private Priority priority;

    private LocalDate creationDate;

    public enum Priority{
        HIGH, MEDIUM, LOW
    }
    public Todo() {
    }


    public Todo(String text, Priority priority, LocalDate dueDate){
        this.text =  text;
        this.priority = priority;
        
        this.creationDate = LocalDate.now();
        this.dueDate = dueDate;
        this.done = false;
    }
    
}

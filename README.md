# TODO App

## Introduction  
Welcome to the **TODO App**! This application was developed to help users manage their tasks efficiently.  
My name is **Sergio López Maldonado**, and this project demonstrates an intuitive and powerful task management solution.  

The purpose of this app is to provide users with an efficient tool to organize, prioritize, and track their daily tasks, ensuring they can achieve their goals productively.

---

## Functional Requirements  
This application meets the following client requirements:

1. **Create To-Do Tasks**  
   - Users can create tasks by specifying:  
     - Name  
     - Priority (e.g., High, Medium, Low)  
     - Optional due date  

2. **Edit Existing Tasks**  
   - Modify the task's name, priority, or due date.  
   - Option to clear the due date if not needed.

3. **Filter To-Do Tasks**  
   - Filter tasks by:  
     - Name (or part of it)  
     - Priority  
     - Completion status (done/undone).  

4. **Sort To-Do Tasks**  
   - Sort tasks by priority and/or due date.  
   - Example: View tasks with upcoming due dates sorted by priority to determine urgency.

5. **Mark Tasks as Done/Undone**  
   - Mark tasks as completed by clicking a checkbox.  
   - Option to undo marking a task as done (in case of a mistake).

6. **Pagination**  
   - Efficiently handle large lists of tasks by paginating them.

7. **Performance Metrics**  
   - Display the **average time** between task creation and completion for all completed tasks.  
   - Show this metric for all tasks and grouped by priority.

---

## Feature Walkthrough  

### Main Features  
#### **Task Management**  
- Create, edit, and delete tasks as needed.  
- Mark tasks as done or undone.  

#### **Filter and Sort**  
- Apply filters and sort options to view tasks based on specific criteria.  
- Prioritize tasks using filters for better focus and organization.

#### **Metrics and Analysis**  
- Analyze average time between task creation and completion.  
- Metrics are grouped by task priority to help users measure their performance.

---
# TODO App

## Table of Contents
- [Introduction](#introduction)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [How to Run the Project](#how-to-run-the-project)
- [Functional Requirements](#functional-requirements)
- [Endpoints](#endpoints)
- [Screenshots](#screenshots)

---

## Introduction

Welcome to the **TODO App**! This application is a comprehensive solution for managing daily tasks. With features such as task creation, editing, filtering, sorting, and performance metrics, the app ensures users can stay organized and productive.

This project is divided into two main components:
- **Frontend**: Built with React and Material-UI for an intuitive user interface.
- **Backend**: Powered by Spring Boot, providing a robust and scalable API for managing tasks.

---

## Frontend Overview

### Key Components:
1. **Metrics Component**  
   - Displays metrics, such as the average time to complete tasks.
   - Includes grouping metrics by task priority.
   - Powered by a context for managing metric-related state.

2. **Table Component**  
   - **TableFilter**: Provides options to filter tasks by name, priority, and status.  
   - **TableFooter**: Adds pagination to manage large task lists.  
   - **TableContent**: Displays the list of tasks with their details.  
   - **TodoTable**: Combines the above components into a cohesive table interface.

3. **TodoModal Component**  
   - A modal dialog for creating or editing tasks.  
   - Allows users to specify the task name, priority, and due date.  
   - Provides options to clear the due date if not needed.

4. **Material-UI (MUI)**  
   - **Material-UI** is used to design the entire user interface, providing:  
     - Pre-styled components such as buttons, modals, and tables.  
     - Full responsiveness for desktop, tablet, and mobile devices.  
     - Theme customization for maintaining consistent styling across the app.

5. **Common Components**  
   - Reusable UI components such as buttons, form inputs, and alerts.

---

## Dependencies

The following dependencies are required for the frontend:

### Core Dependencies:
- **React**: ^18.3.1 - A JavaScript library for building user interfaces.
- **TypeScript**: ^4.9.5 - Provides static typing for JavaScript.
- **Material-UI (MUI)**: ^6.1.8 - A modern React UI framework for building responsive applications.
- **Axios**: ^1.7.7 - Handles HTTP requests for backend communication.

### Development Dependencies:
- **Jest**: ^27.5.1 - A JavaScript testing framework.
- **@testing-library/react**: ^16.0.1 - Tools for testing React components.
- **@testing-library/jest-dom**: ^6.6.3 - Custom DOM matchers for Jest.

### Full `package.json` Dependencies
Below are the dependencies defined in the `package.json` file:

```json
{
  "dependencies": {
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.5",
    "@mui/icons-material": "^6.1.8",
    "@mui/material": "^6.1.8",
    "axios": "^1.7.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^4.9.5"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.6.3",
    "jest": "^27.5.1"
  }
}
``` 
## Architecture Overview

The backend follows a layered architecture for better maintainability and separation of concerns:

1. **Controller Layer (`TodoController`)**  
   - Exposes RESTful endpoints for the frontend.
   - Handles HTTP requests and maps them to service methods.
   - Validates incoming request data.

2. **Service Layer (`TodoService`)**  
   - Implements the core business logic for tasks.
   - Manages task data, filtering, sorting, pagination, and metrics calculation.

3. **Model Layer (`Todo`)**  
   - Represents the structure of a task, including fields like text, priority, due date, and completion status.
   - Defines validation rules using annotations such as `@NotBlank` and `@NotNull`.

### Data Storage
The backend uses a **HashMap** as an in-memory database to map task IDs to their corresponding `Todo` objects.  
- **Key**: The unique ID of the task.
- **Value**: The `Todo` object containing task details.

This design ensures fast access for read and write operations, making it ideal for prototyping and testing environments.

---

## Key Points

### Features Implemented
1. **Task Management**  
   - Create, update, delete, and mark tasks as done/undone.

2. **Filtering and Sorting**  
   - Filter tasks by text (using the `startsWith` parameter), priority, and completion status.
   - Sort tasks by due date or priority (ascending/descending).

3. **Pagination**  
   - Limits the number of tasks returned to the client.
   - Uses `page` and `pageSize` parameters to determine the subset of tasks to return.

4. **Metrics**  
   - Calculates the average time between task creation and completion.
   - Provides metrics grouped by task priority (`HIGH`, `MEDIUM`, `LOW`).

5. **GET `/todos` Functionality**  
   - **Filtering**: Filters tasks based on parameters such as:
     - `startsWith`: Tasks with text starting with the given value.
     - `priority`: Filters tasks by priority (HIGH, MEDIUM, LOW).
     - `done`: Filters tasks based on their completion status.
   - **Sorting**: Supports sorting tasks by `dueDate` or `priority`, in ascending or descending order.
   - **Pagination**: Returns only a subset of tasks based on the `page` and `pageSize` parameters to avoid overwhelming the client with the full task list.

---

## Dependencies

The backend uses the following key dependencies (defined in `pom.xml`):

1. **Spring Boot Starter Web**  
   Provides tools for building RESTful APIs with Spring MVC.

2. **Spring Boot Starter Validation**  
   Adds declarative validation to models using annotations.

3. **Lombok**  
   Reduces boilerplate code by generating getters, setters, and constructors.

4. **Spring Boot DevTools**  
   Speeds up development with live reload capabilities.

5. **JUnit 5**  
   Enables unit testing for business logic and endpoints.

---

## How to Run the Backend

### Prerequisites
1. **Java Development Kit (JDK)**: Version 21 or higher.
2. **Apache Maven**: Version 3.8.6 or higher.


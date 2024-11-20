
import axios from "axios";
import React, { useState }  from "react";

const TodoForm = () => {
    const [text, setTaskText] = useState('');
    const [priority, setPriority] = useState('LOW');
    const [dueDate, setDueDate] = useState('');


    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    const taskData = {
        text,
            priority,
            dueDate
    };
    console.log(taskData)
    try {
        const response = await axios.post('http://localhost:8080/todos', taskData, {
        headers: { 'Content-Type': 'application/json' },
        });
        alert('Task created successfully!');
        console.log(response.data);
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task. Check the console for more details.');
    }
    };


  return (
      <form className="w-full max-w-md bg-blue-900 p-20 rounded-lg shadow-lg" onSubmit={handleSubmit}>
         <h1 className="text-3xl font-extrabold text-white">Create New Task</h1>
    
        <div className="mb-4">
          <label className="block font-bold text-white text-sm mb-2" >
            Nombre:
          </label>
          <input
            placeholder="Add your task name"
            required
            type="text"
            value={text}
            onChange={(e) => setTaskText(e.target.value)}
            className="w-full px-4 py-3 text-black border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label  className="block font-bold text-white text-sm mb-2" >
            Correo electrónico:
          </label>
            <select className="w-full px-4 py-3 text-black border-gray-300 rounded-md" value={priority} onChange={(e) => setPriority(e.target.value)} >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
            </select>
        </div>

        <div className="mb-6">
          <label className ="block font-bold text-white text-sm mb-2">
            Due date
          </label>
            <input
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full px-4 py-3 text-black border-gray-300 rounded-md"
            />
        </div>

        <button type="submit">
          Add new task
        </button>
      </form>
  );
};

export default TodoForm;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  text: string;
  dueDate: string | null;
  done: boolean;
  priority: string;
}

const TaskTable: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/todos');
        console.log(response)
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const HandleDelete = async (id: string) => {
    try{
      await axios.delete(`http://localhost:8080/todos/${id}`);
      alert('Task deleted successfully');
    }catch(error){
      alert('Failed to delete task. Please try again.');
    }
  }
  return (
    <div>
      <h2>Task List</h2>
      <table  className=" table-auto w-full  text-black">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <input type="checkbox" checked={task.done} readOnly />
              </td>
              <td>{task.text}</td>
              <td>{task.priority}</td>
              <td>{task.dueDate ? task.dueDate : '-'}</td>
              <td>
                <button>Edit</button>
                <button  onClick={()=> HandleDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;



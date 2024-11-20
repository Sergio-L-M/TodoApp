import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import TodoPopUp from './components/UpdateCreateTodo/TodoPopUp';
import TaskTable from './components/TaskTable';
function App() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  return (
    <div className="App">
      <div className="h-screen flex flex-col items-center gap-6  text-white">
        <button onClick={()=> setShowCreateTask(true)} className="bg-violet-500 px-4 py-2 rounded-lg text-lg"> Create new Task</button>
        {showCreateTask && <TodoPopUp onClose={() => setShowCreateTask(false)}/>}
        <TaskTable/>
      </div>
      
    </div>
  );
}

export default App;

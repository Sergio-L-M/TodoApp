import React, { useState } from 'react';
import './App.css';
import TodoModal from './components/UpdateCreateTodo/TodoModal';
import TaskTable from './components/TaskTable';
import ParentComponent from './components/TodoFilter/TodoFilter';
function App() {
  const [showCreateTask, setShowCreateTask] = useState(false);

  const handleOpenModal = () => setShowCreateTask(true);
  const handleCloseModal = () => setShowCreateTask(false);

  return (
    <div className="App">

      <TaskTable />
    </div>
  );
}

export default App;

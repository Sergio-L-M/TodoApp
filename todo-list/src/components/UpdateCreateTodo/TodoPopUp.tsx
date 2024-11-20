import React, { useRef, useState} from 'react';
import { X } from 'lucide-react';
import TodoForm from './TodoForm';

interface TodoPopUp {
  onClose: () => void; // Función para cerrar el modal
}


const TodoPopUp: React.FC<TodoPopUp> = ({ onClose }) => {
  const [text, setTaskText] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [dueDate, setDueDate] = useState('');
  const CreateTaskRef = useRef<HTMLDivElement>(null);
  const closeCreateTask = (e: React.MouseEvent) => {
    if (CreateTaskRef.current === e.target) {
      onClose();
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      ref={CreateTaskRef}
      onClick={closeCreateTask}
    >
      <div className="rounded-xl px-20 py-10 flex flex-col gap-5 items-center mx-4">
        <button onClick={onClose} className="place-self-end">
          <X size={30} />
        </button>
        <TodoForm/>
      </div>
    </div>
  );
};


export default TodoPopUp;

import React, { useState } from "react";

interface StartsWithFilterProps {
  onFilter: (startsWith: string) => void; // Callback para aplicar el filtro
}

const StartsWithFilter: React.FC<StartsWithFilterProps> = ({ onFilter }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleApplyFilter = () => {
    onFilter(inputValue); // Envía el valor actual al componente padre
  };

  const handleClearFilter = () => {
    setInputValue(""); // Limpia el campo de entrada
    onFilter(""); // Restablece el filtro
  };

  return (
    <div className="flex items-center gap-4 px-5 py-2 w-[30%]">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Starts With"
        className="flex-grow border rounded-lg p-2 text-sm"
      />
      <button
        onClick={handleApplyFilter}
        className="bg-blue-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-blue-600"
      >
        Apply
      </button>
      <button
        onClick={handleClearFilter}
        className="border border-gray-300 text-gray-700 rounded-lg px-4 py-1 text-sm hover:bg-gray-100"
      >
        Clear
      </button>
    </div>
  );
};

export default StartsWithFilter;


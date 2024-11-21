import React, { useState } from "react";
import StartsWithFilter from "./StartsWithFilter";

const ParentComponent: React.FC = () => {
  const [filterText, setFilterText] = useState<string>("");

  const handleFilter = (startsWith: string) => {
    setFilterText(startsWith); // Actualiza el texto del filtro
    console.log("Filtering by:", startsWith);
    // Aquí puedes agregar lógica para filtrar datos
  };

  return (
    <div className="flex flex-col items-center justify-center w-[80%] mx-auto mt-10 border border-gray-300 rounded-lg shadow-lg p-5">
      <h1 className="text-lg font-bold mb-4">Task List</h1>
      <StartsWithFilter onFilter={handleFilter} />
      <p className="mt-4 text-gray-500">Current Filter: {filterText}</p>
      {/* Aquí iría la tabla o lista de tareas */}
    </div>
  );
};

export default ParentComponent;

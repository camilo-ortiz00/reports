import React, { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal";

interface RenameFormProps {
  show: boolean;
  currentName: string;
  onRename: (newName: string) => void;
  closeModal: () => void;
}

const RenameForm: React.FC<RenameFormProps> = ({
  show,
  currentName,
  onRename,
  closeModal,
}) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === "") {
      alert("El nombre no puede estar vacío");
      return;
    }
    onRename(newName.trim());
    closeModal();
  };

  return (
    <ModalComponent show={show} title="Renombrar Archivo/Carpeta" closeModal={closeModal}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newName" className="block text-sm font-medium text-gray-700">
            Nuevo Nombre
          </label>
          <input
            type="text"
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-1 block h-8 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Renombrar
          </button>
        </div>
      </form>
    </ModalComponent>
  );
};

export default RenameForm;

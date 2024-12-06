import React, { useState, useEffect } from "react";
import ModalComponent from "@/components/Modal"; // Asegúrate de que este componente esté correctamente importado

interface FolderNameFormProps {
  show: boolean;
  currentName: string;
  onRename: (newName: string) => void;
  closeModal: () => void;
}

const FolderNameForm: React.FC<FolderNameFormProps> = ({
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
    <ModalComponent show={show} title="Crear Nueva Carpeta" closeModal={closeModal}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newName" className="block text-sm font-medium text-gray-700">
            Nombre de la Carpeta
          </label>
          <input
            type="text"
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="input input-bordered input-md w-full"
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
            Crear Carpeta
          </button>
        </div>
      </form>
    </ModalComponent>
  );
};

export default FolderNameForm;

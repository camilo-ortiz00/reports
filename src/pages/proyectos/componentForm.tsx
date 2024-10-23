// components/ComponentForm.tsx
import React, { useState, useEffect } from 'react';
import { Component } from '@/model/projects.props';

interface ComponentFormProps {
  onSave: (component: Component) => void;
  initialData?: Component;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [workLines, setWorkLines] = useState(initialData?.work_lines || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setWorkLines(initialData.work_lines);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComponent = {
      id: initialData?.id || 0,
      name,
      description,
      work_lines: workLines,
    };
    onSave(newComponent);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <div className="mb-4">
        <label className="block text-sm font-bold">Nombre del Componente</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered input-md w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Líneas de Trabajo</label>
        <textarea
          value={workLines}
          onChange={(e) => setWorkLines(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Editar Componente' : 'Crear Componente'}
      </button>
    </form>
  );
};

export default ComponentForm;

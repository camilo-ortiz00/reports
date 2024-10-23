// components/ProjectForm.tsx
import React, { useState, useEffect } from 'react';
import { Project } from '@/model/projects.props';

interface ProjectFormProps {
  onSave: (project: Project) => void;
  initialData?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      id: initialData?.id || 0,
      name,
      description,
    };
    onSave(newProject);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <div className="mb-4">
        <label className="block text-sm font-bold">Nombre del Proyecto</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered input-md w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Descripción</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-bordered input-md w-full"
        />
      </div>
      
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Editar Rol' : 'Crear Rol'}
      </button>
    </form>
  );
};

export default ProjectForm;
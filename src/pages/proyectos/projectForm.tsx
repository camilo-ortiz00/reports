import React, { useState, useEffect } from 'react';
import { Project } from '@/model/projects.props';

interface Component {
  id: number;
  name: string;
}

interface ProjectFormProps {
  onSave: (project: Project) => void;
  initialData?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [componentId, setComponentId] = useState(initialData?.component_id || 0);
  const [components, setComponents] = useState<Component[]>([]); // Array para almacenar los componentes

  // Cargar los componentes al montar el formulario
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch('/api/projects/components');
        const data = await response.json();
        setComponents(data);
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchComponents();

    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setComponentId(initialData.component_id);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: initialData?.id || 0,
      name,
      description,
      component_id: componentId,
      component: components.find((comp) => comp.id === componentId) || { id: componentId, name: '' },
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
      <div className="mb-4">
        <label className="block text-sm font-bold">Componente</label>
        <select
          value={componentId}
          onChange={(e) => setComponentId(Number(e.target.value))}
          className="input input-bordered input-md w-full"
        >
          <option value={0}>Selecciona un componente</option>
          {components.map((component) => (
            <option key={component.id} value={component.id}>
              {component.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {initialData ? 'Editar Proyecto' : 'Crear Proyecto'}
      </button>
    </form>
  );
};

export default ProjectForm;

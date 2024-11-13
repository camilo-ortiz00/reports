import React, { useState } from 'react';
import { Component } from '@/model/projects.props';
import { User } from '@/model/user.props';

interface ComponentFormProps {
  onSave: (component: Partial<Component> & { userId: number | null }) => void;
  initialData?: Component;
  users: User[];
}

const ComponentForm: React.FC<ComponentFormProps> = ({ onSave, initialData, users }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(initialData?.user_id || null);
  
  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(event.target.value, 10);
    setSelectedUserId(isNaN(userId) ? null : userId);
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ id: initialData?.id, name, description, userId: selectedUserId });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full px-2 py-1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded w-full px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Asignar Coordinador</label>
        <select
          value={selectedUserId || 0}
          onChange={handleUserChange}
          className="border rounded w-full px-2 py-1"
        >
          <option value="">Sin asignar</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Guardar
      </button>
    </form>
  );
};

export default ComponentForm;

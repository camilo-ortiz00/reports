import { FC, useEffect, useState } from 'react';
import { User } from '@/model/user.props';

const UserForm: FC<{ user: User | null; onSave: (user: User) => void; onDelete?: (id: number) => void }> = ({ user, onSave, onDelete }) => {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [identityDocument, setIdentityDocument] = useState<string>(''); // Nuevo estado
  const [roleId, setRoleId] = useState<number>(1); // Añadido un estado para role_id

  useEffect(() => {
    if (user) {
      setId(user.id || 0); // Asignar 0 si user.id es undefined
      setName(user.name);
      setEmail(user.email);
      setIdentityDocument(user.identity_document); // Establecer el documento de identidad
      setRoleId(user.role_id); // Establecer role_id
    } else {
      // Reiniciar el formulario
      setId(0);
      setName('');
      setEmail('');
      setIdentityDocument(''); // Reiniciar documento de identidad
      setRoleId(1); // Reiniciar role_id
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser: User = {
      id,
      name,
      email,
      identity_document: identityDocument,
      role_id: roleId,
      role: user?.role || { id: 1, description: '', name: '' },
      profile_status: 0,
      password: ''
    };
  
    onSave(updatedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 bg-base-100 shadow-xl">
      {/* Campo para Nombre */}
      <div className="mb-4">
        <label className="block text-sm font-bold">Nombre</label>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input input-bordered input-md w-full"
        />
      </div>

      {/* Campo para Email */}
      <div className="mb-4">
        <label className="block text-sm font-bold">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input input-bordered input-md w-full"
        />
      </div>

      {/* Campo para Documento de Identidad */}
      <div className="mb-4">
        <label className="block text-sm font-bold">Documento de Identidad</label>
        <input
          type="text"
          placeholder="Documento de Identidad"
          value={identityDocument}
          onChange={(e) => setIdentityDocument(e.target.value)}
          required
          className="input input-bordered input-md w-full"
        />
      </div>

      <div className="flex justify-between">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Actualizar Usuario
        </button>
      </div>
    </form>
  );
};

export default UserForm;

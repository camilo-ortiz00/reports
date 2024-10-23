import { FC, useEffect, useState } from 'react';
import { User } from '@/model/user.props';

const UserForm: FC<{ user: User | null; onSave: (user: User) => void; onDelete?: (id: number) => void }> = ({ user, onSave, onDelete }) => {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [identityDocument, setIdentityDocument] = useState<string>(''); // Nuevo estado

  useEffect(() => {
    if (user) {
      setId(user.id);
      setName(user.name);
      setEmail(user.email);
      setPassword(''); // No mostrar la contraseña existente
      setIdentityDocument(user.identity_document); // Establecer el documento de identidad
    } else {
      // Reiniciar el formulario
      setId(0);
      setName('');
      setEmail('');
      setPassword('');
      setIdentityDocument(''); // Reiniciar documento de identidad
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedUser: User = {
      id,
      name,
      email,
      password,
      identity_document: identityDocument, // Agregar documento de identidad
      role: user?.role || { id: 1, description: '', name: '' }
    };
  
    onSave(updatedUser);
  };
  
  const handleDelete = () => {
    if (user && onDelete) {
      onDelete(user.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      {/* ... otros campos ... */}
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

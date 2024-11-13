import { useState } from 'react';

const ResetPasswordForm = () => {
  const [emailOrId, setEmailOrId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    // Llama a la API para restablecer la contraseña
    const response = await fetch('/api/user/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrId, newPassword }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage('Contraseña actualizada exitosamente');
      // Opcionalmente, redirigir a la página de inicio de sesión después de un tiempo
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Restablecer Contraseña</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo o Documento de Identificación</label>
          <input
            type="text"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            className="input input-bordered mt-1 block w-full px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered mt-1 block w-full px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-bordered mt-1 block w-full px-3 py-2"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Restablecer Contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

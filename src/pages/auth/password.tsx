import { useState } from 'react';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Llama a la API para solicitar un enlace de recuperación
    const response = await fetch('/api/user/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setMessage('Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Recuperar Contraseña</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            id='email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered mt-1 block w-full px-3 py-2"
            autoComplete='email'
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Enviar Enlace
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;

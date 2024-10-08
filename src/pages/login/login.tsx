import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';

const Login = () => {
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget; // Acceder al formulario
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result && !result.error) {
      router.push('/informes'); // Redirigir al inicio si el login es exitoso
    } else {
      console.error(result?.error); // Manejar errores de autenticación
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" type="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300" required />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;

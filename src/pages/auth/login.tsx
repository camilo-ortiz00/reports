import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession(); // Usa el hook useSession para verificar la sesión

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result && !result.error) {
      setErrorMessage(null);
      router.push('/'); 
    } else {
      setErrorMessage(result?.error || 'Ocurrió un error inesperado.'); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
        
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300" required autoComplete="email"/>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input id="password" type="password" name="password" className="mt-1 block w-full px-3 py-2 border border-gray-300" required autoComplete="current-password"/>
        </div>
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Iniciar sesión</button>
        </div>
        <div className='m-4'></div>
        <div>
          <Link href="/auth/register">
            <button className="w-full bg-green-500 text-white py-2 rounded">Registrarse</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

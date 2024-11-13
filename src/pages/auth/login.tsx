import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useForm, SubmitHandler } from 'react-hook-form';

interface LoginFormData {
  identifier: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar u ocultar la contraseña
  const router = useRouter();
  const { data: session, status } = useSession(); // Usa el hook useSession para verificar la sesión

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/'); // Redirige si ya está autenticado
    }
  }, [session, status, router]);

  // Aquí debes hacer la definición correcta del submitHandler
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const { identifier, password } = data;
  
    const result = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });
  
    if (result && result.error) {
      console.error('Error en el inicio de sesión:', result.error);
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>
        
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Correo o documento de identidad</label>
          <input
            id="identifier"
            type="text"
            {...register("identifier", { required: "Este campo es obligatorio" })}
            className={`input input-bordered w-full ${errors.identifier ? 'input-error' : ''}`} 
            autoComplete="identifier"
          />
          {errors.identifier && <span className="text-red-500">{errors.identifier.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold">Contraseña</label>
          <div className="flex items-center">
            <div className={`input w-full flex items-center gap-2 justify-between ${errors.password ? 'input-error' : 'input-bordered'}`}>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Este campo es obligatorio" })}
                placeholder="Contraseña"
                className="w-full"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="ml-2"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-black-500" size="lg" />
              </button>
            </div>
          </div>
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>
        <div className="m-2">
          <Link href="/auth/password">
            <h1 className="text-blue-500 underline hover:text-blue-700 cursor-pointer">
              ¿Olvidaste la contraseña?
            </h1>
          </Link>
        </div>
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Iniciar sesión</button>
        </div>
        <div className="m-4"></div>
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
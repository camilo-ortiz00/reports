import { useState, FC } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { FormData } from '@/model/user.props';

interface UserFormProps {
  handleCreate: () => void;
  handleClose: () => void;
  initialData?: FormData;
}

const Register: FC<UserFormProps> = ({
  handleCreate,
  initialData,
  handleClose,
}) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError, getValues } = useForm<FormData>({
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: initialData?.password || '',
      role: initialData?.role || { id: 1, name: '', description: '' },
    },
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');

  const onSubmit = handleSubmit(async (data: FormData) => {
    // Validación de contraseñas
    if (data.password !== passwordConfirm) {
      setError("password", { type: "manual", message: "Las contraseñas no coinciden." });
      return;
    }

    const id = parseInt(data.id.toString(), 10);
    const role_id = data.role?.id || 1;

    const userData = {
      email: data.email,
      password: data.password,
      id,
      name: data.name,
      role_id,
    };

    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const errorData = await res.json();
        // Asignar errores en función de la respuesta del servidor
        if (errorData.error === 'ID ya existe') {
          setError("id", { type: "manual", message: "El ID ya existe." });
        }
        if (errorData.error === 'Correo ya existe') {
          setError("email", { type: "manual", message: "La dirección correo ya existe." });
        }
        console.error('Error en el registro:', errorData);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={onSubmit} className="w-full max-w-md p-6 bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Registrarse</h1>
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">Número de documento</label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              id="id"
              type="text"
              className={`input grow border-0 rounded-none ${errors.id ? 'input-error' : ''}`} 
              autoComplete="id"
              {...register("id", { required: "Este campo es obligatorio", valueAsNumber: true })}
            />
          </label>
          {errors.id && <span className="text-red-500 text-sm">{errors.id.message}</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              id="name"
              type="text"
              className={`input grow border-0 rounded-none ${errors.name ? 'input-error' : ''}`} 
              autoComplete="name"
              {...register("name", { required: "Este campo es obligatorio" })}
            />
          </label>
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <label className="input input-bordered flex items-center gap-2">
            <input 
              id="email"
              type="email"
              className={`input grow border-0 rounded-none ${errors.email ? 'input-error' : ''}`} 
              placeholder="ejemplo@email.com"
              autoComplete="email"
              {...register("email", { required: "Este campo es obligatorio" })}
            />
          </label>
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              id="password"
              type="password"
              className={`input grow border-0 rounded-none ${errors.password ? 'input-error' : ''}`} 
              required
              autoComplete="new-password"
              {...register("password", { required: "Este campo es obligatorio" })}
            />
          </label>
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              id="passwordConfirm"
              type="password"
              className={`input grow border-0 rounded-none ${passwordConfirm && passwordConfirm !== '' && getValues('password') !== passwordConfirm ? 'input-error' : ''}`}
              required
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </label>
          {passwordConfirm && passwordConfirm !== '' && getValues('password') !== passwordConfirm && (
            <span className="text-red-500 text-sm">Las contraseñas no coinciden.</span>
          )}        
        </div>
        <div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Register;

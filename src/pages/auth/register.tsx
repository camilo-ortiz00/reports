import { useState, FC } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { User } from '@/model/user.props';

interface UserFormProps {
  handleCreate: () => void;
  handleClose: () => void;
  initialData?: User;
}

const Register: FC<UserFormProps> = ({
  handleCreate,
  initialData,
  handleClose,
}) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError, getValues } = useForm<User>({
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: initialData?.password || '',
      role: initialData?.role || { id: 1, name: '', description: '' },
      identity_document: initialData?.identity_document || '',
    },
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');

  const onSubmit = handleSubmit(async (data: User) => {
    if (data.password !== passwordConfirm) {
      setError("password", { type: "manual", message: "Las contraseñas no coinciden." });
      return;
    }

    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      role_id: data.role?.id || 1,
      identity_document: data.identity_document,
    };
    console.log(userData)
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
        if (errorData.error === 'Correo ya existe') {
          setError("email", { type: "manual", message: "La dirección correo ya existe." });
        }
      }
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={onSubmit} className="w-full max-w-md p-6 bg-white shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Registrarse</h1>
        
        {/* Campo para el documento de identidad */}
        <div className="mb-4">
          <label htmlFor="identity_document" className="block text-sm font-medium text-gray-700">Número de documento de identidad</label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              id="identity_document"
              type="text"
              className={`input grow border-0 rounded-none ${errors.identity_document ? 'input-error' : ''}`} 
              autoComplete="id"
              {...register("identity_document", { required: "Este campo es obligatorio" })}
            />
          </label>
          {errors.identity_document && <span className="text-red-500 text-sm">{errors.identity_document.message}</span>}
        </div>

        {/* Campo para el nombre */}
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

        {/* Campo para el email */}
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

        {/* Campo para la contraseña */}
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

        {/* Confirmar contraseña */}
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

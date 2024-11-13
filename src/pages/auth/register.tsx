import { useState, FC } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { User } from '@/model/user.props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface UserFormProps {
  handleCreate: () => void;
  handleClose: () => void;
  initialData?: User;
}

const Register: FC<UserFormProps> = ({ initialData }) => {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const onSubmit = handleSubmit(async (data: User) => {
    if (data.password !== passwordConfirm) {
      setError("password", { type: "manual", message: "Las contraseñas no coinciden." });
      return;
    }

    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      role_id: 2,
      identity_document: data.identity_document,
    };
    console.log(userData);
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
          <input
            id="identity_document"
            type="text"
            className={`input input-bordered w-full ${errors.identity_document ? 'input-error' : ''}`} 
            autoComplete="id"
            {...register("identity_document", { required: "Este campo es obligatorio" })}
          />
          {errors.identity_document && <span className="text-red-500 text-sm">{errors.identity_document.message}</span>}
        </div>
  
        {/* Campo para el nombre */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            id="name"
            type="text"
            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`} 
            autoComplete="name"
            {...register("name", { required: "Este campo es obligatorio" })}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
  
        {/* Campo para el email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email"
            type="email"
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} 
            placeholder="ejemplo@email.com"
            autoComplete="email"
            {...register("email", { required: "Este campo es obligatorio" })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
  
       {/* Campo para la contraseña */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <div className={`input w-full flex items-center gap-2 justify-between ${errors.password ? 'input-error' : 'input-bordered'}`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full"
              placeholder="Contraseña"
              {...register("password", {
                required: "Este campo es obligatorio",
                minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{6,}$/,
                  message: "La contraseña debe contener mayúsculas, minúsculas, números y un carácter especial"
                }
              })}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)} 
              className="ml-2"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-black-500" size="lg" />
            </button>
          </div>
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        {/* Confirmar contraseña */}
        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <div className={`input w-full flex items-center gap-2 justify-between ${passwordConfirm && passwordConfirm !== '' && getValues('password') !== passwordConfirm ? 'input-error' : 'input-bordered'}`}>
            <input
              id="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              className="w-full"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              placeholder="Confirmar contraseña"
            />
            <button 
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} 
              className="ml-2"
            >
              <FontAwesomeIcon icon={showPasswordConfirm ? faEyeSlash : faEye} className="text-black-500" size="lg" />
            </button>
          </div>
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

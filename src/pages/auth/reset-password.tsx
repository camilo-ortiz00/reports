import { useRouter } from "next/router";
import { useState } from "react";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const router = useRouter();
    const { token } = router.query;
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
  
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
  
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessage('Contraseña restablecida correctamente');
        router.push('/auth/login');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        {/* Formulario similar al anterior */}
      </form>
    );
  };

  export default ResetPassword;

  
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import { useSession } from 'next-auth/react'; // Usando NextAuth.js para autenticación

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession(); // Obtener el estado de la sesión
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login/login'); // Redirigir si el usuario no está autenticado
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>; // Mostrar mensaje de carga mientras se verifica la sesión
  }

  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

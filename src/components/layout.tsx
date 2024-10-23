import Navbar from './Navbar';
import { useSession } from 'next-auth/react'; 
import SideBar from './Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession(); 

  // Muestra un indicador de carga mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Cargando...</h1>
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  };

  return (
    <div>
      <SideBar />
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

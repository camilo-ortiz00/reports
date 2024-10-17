import Navbar from './Navbar';
import { useSession } from 'next-auth/react'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession(); 

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
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

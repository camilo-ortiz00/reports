'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';  // Importa useSession
import styles from './Page.module.css';

const Page = () => {
  const { data: session, status } = useSession();  // Obtén la sesión del usuario

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const isAdmin = session?.user?.role?.id === 1;  // Verifica si el rol del usuario es 1

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className='text-3xl font-bold mb-10 mt-10 text-center w-full'>Bienvenido a la página principal!</h1>
      <div className={styles.cardContainer}>

        {/* Tarjeta adicional con fondo animado */}
        <Link href="/user/profile">
          <div className={`card bg-gray-200 text-black-content w-96 h-[25em] relative cursor-pointer hover:scale-105 transition-transform ${styles.card}`}>
            <div className={styles.cardBackground}>
              <div className={`${styles.blob} ${styles.blob1}`}></div>
              <div className={`${styles.blob} ${styles.blob2}`}></div>
              <div className={`${styles.blob} ${styles.blob3}`}></div>
            </div>
            <div className="card-body">
              <h2 className="card-title">Perfil</h2>
              <p>Completa la información de tu perfil haciendo click aquí!</p>
            </div>
          </div>
        </Link>

        {/* Dividir la tarjeta de Proyectos en dos, solo si el usuario es admin */}
        {isAdmin && (
          <div className="flex flex-col space-y-4"> {/* Contenedor en columna */}

            <Link href="/proyectos/ComponentManagement">
              <div className={`card bg-gray-200 text-black-content w-96 h-[12em] relative cursor-pointer hover:scale-105 transition-transform ${styles.card}`}>
                <div className={styles.cardBackground}>
                  <div className={`${styles.blob} ${styles.blob1}`}></div>
                  <div className={`${styles.blob} ${styles.blob2}`}></div>
                  <div className={`${styles.blob} ${styles.blob3}`}></div>
                </div>
                <div className="card-body">
                  <h2 className="card-title">Componentes</h2>
                  <p>Continúa con la gestión de tu componente aquí.</p>
                </div>
              </div>
            </Link>

            <Link href="/proyectos/ProjectManagement">
              <div className={`card bg-gray-200 text-black-content w-96 h-[12em] relative cursor-pointer hover:scale-105 transition-transform ${styles.card}`}>
                <div className={styles.cardBackground}>
                  <div className={`${styles.blob} ${styles.blob1}`}></div>
                  <div className={`${styles.blob} ${styles.blob2}`}></div>
                  <div className={`${styles.blob} ${styles.blob3}`}></div>
                </div>
                <div className="card-body">
                  <h2 className="card-title">Proyectos</h2>
                  <p>Gestiona el primer paso de tu proyecto aquí.</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Card con fondo animado */}
        <Link href="/informes/reports/report_list/report_list">
          <div className={`card bg-gray-200 text-black-content w-96 h-[25em] relative cursor-pointer hover:scale-105 transition-transform ${styles.card}`}>
            <div className={styles.cardBackground}>
              <div className={`${styles.blob} ${styles.blob1}`}></div>
              <div className={`${styles.blob} ${styles.blob2}`}></div>
              <div className={`${styles.blob} ${styles.blob3}`}></div>
            </div>
            <div className="card-body">
              <h2 className="card-title">Informes</h2>
              <p>Accede a la interfaz de creación de informes.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

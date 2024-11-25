import Link from 'next/link';
import React from 'react';
import { useSession } from 'next-auth/react'; 

const SideBar = () => {
  const { data: session, status } = useSession(); 

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const isAdmin = session?.user?.role?.id === 1;

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
      </div>

      <div className="drawer-side fixed top-[64px] left-0 z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-[15%] bg-white text-base-content min-h-[calc(100vh-64px)] p-4 shadow-lg">
          
          {isAdmin && (
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="accordion" id="accordion1" className="peer" defaultChecked />
              <label htmlFor="accordion1" className="collapse-title text-xl font-medium cursor-pointer">
                Usuario
              </label>
              <div className="collapse-content pl-0">
                <Link href="/user/roleList">
                  <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Roles
                  </p>
                </Link>
                <Link href="/user/AssignRole">
                  <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Asignar Roles
                  </p>
                </Link>
                <Link href="/user/userList">
                  <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Admin. Usuarios
                  </p>
                </Link>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="accordion" id="accordion2" className="peer" />
              <label htmlFor="accordion2" className="collapse-title text-xl font-medium cursor-pointer">
                Proyectos
              </label>
              <div className="collapse-content pl-0">
                <Link href="/proyectos/ProjectManagement">
                  <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Proyectos
                  </p>
                </Link>
                <Link href="/proyectos/ComponentManagement">
                  <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Componentes
                  </p>
                </Link>
              </div>
            </div>
          )}
           {isAdmin && (
            <div className="collapse collapse-arrow bg-base-100">
              <input type="radio" name="accordion" id="accordion2" className="peer" />
              <label htmlFor="accordion2" className="collapse-title text-xl font-medium cursor-pointer">
                Informes
              </label>
              <div className="collapse-content pl-0">
              <Link href="/informes/reports/report_list/report_list">
              <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Creación de Informes
                  </p>
                </Link>
                <Link href="/informes/tracking/reportTracking">
                  <p className="m-1 p-2 w-full border-b border-gray-400 hover:bg-gray-200 hover:text-black transition-colors duration-300 rounded">
                    Seguimiento de Informes
                  </p>
                </Link>
              </div>
            </div>
          )}

        </ul>
      </div>

      <style jsx>{`
        .drawer-toggle:checked ~ .drawer-side > .drawer-overlay {
          background-color: transparent !important;
        }

        .drawer-side .collapse {
          visibility: visible !important;
        }
      `}</style>
    </div>
  );
};

export default SideBar;

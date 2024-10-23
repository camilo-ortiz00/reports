import Link from 'next/link';
import React from 'react';

const SideBar = () => {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
      </div>

      <div className="drawer-side fixed top-[64px] left-0 z-50">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-[15%] bg-white text-base-content min-h-[calc(100vh-64px)] p-4 shadow-lg">

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="accordion" id="accordion1" className="peer" defaultChecked />
            <label htmlFor="accordion1" className="collapse-title text-xl font-medium cursor-pointer">
              Usuario
            </label>
            <div className="collapse-content">
              <Link href="/user/roleList">
                <p className='m-4'>Roles</p>
              </Link>
              <Link href="/user/AssignRole">
                <p className='m-4'>Asignar roles</p>
              </Link>
              <Link href="/user/userList">
                <p className='m-4'>Administrar usuarios</p>
              </Link>
            </div>
          </div>

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="accordion" id="accordion2" className="peer" />
            <label htmlFor="accordion2" className="collapse-title text-xl font-medium cursor-pointer">
              Proyectos
            </label>
            <div className="collapse-content">
            <Link href="/proyectos/ProjectManagement">
                <p className='m-4'>Proyectos</p>
              </Link>
              <Link href="/proyectos/ComponentManagement">
              <p className='m-4'>Componentes</p>
              </Link>
              </div>
          </div>

          <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="accordion" id="accordion3" className="peer" />
            <label htmlFor="accordion3" className="collapse-title text-xl font-medium cursor-pointer">
              Opción 3
            </label>
            <div className="collapse-content">
              <p>Contenido de la Opción 3</p>
            </div>
          </div>

        </ul>
      </div>

      <style jsx>{`
        .drawer-toggle:checked ~ .drawer-side > .drawer-overlay {
          background-color: transparent !important;
        }

        /* Anular la visibilidad de DaisyUI */
        .drawer-side .collapse {
            visibility: visible !important; /* Anula la propiedad de DaisyUI */
        }
      `}</style>
    </div>
  );
};

export default SideBar;

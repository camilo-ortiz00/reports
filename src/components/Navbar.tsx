import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100 border-b border-gray-200">
      <div className="flex-none">
        {/* Botón que abre el sidebar */}
        <label htmlFor="my-drawer" className="btn drawer-button">
          <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <Link href="/informes/">
          <h1 className="btn btn-ghost text-xl">Inicio</h1>
        </Link>
      </div>

      <div className="flex-none">
        {session ? (
          <>
            <h1 className="mr-2">{session.user?.name || 'Usuario'}</h1> 
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    width={500}
                    height={300}
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <a>Perfil</a>
                </li>
                <li><a onClick={() => signOut()}>Cerrar sesión</a></li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/auth/login" className="btn">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100 border-b border-gray-200">
      <div className="flex-none">
        {/* Botón que abre el sidebar */}
        <label htmlFor="my-drawer" className="btn bg-white text-black border border-gray-800 drawer-button">
          <svg className="w-6 h-6 text-black-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <Link href="/informes/">
          <h1 className="btn btn-ghost text-xl font-bold">Inicio</h1>
        </Link>
      </div>

      <div className="flex-none">
        {session ? (
          <>
            <h1 className="mr-2 font-bold">{session.user?.name || 'Usuario'}</h1> 
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2">
                  <FontAwesomeIcon icon={faUser} size='2x'/>                
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-[12em] p-2 shadow">
                <li className="flex justify-start hover:bg-gray-100 rounded-md">
                  <Link href="/user/profile" className="flex items-center justify-start space-x-2 p-2">
                    <FontAwesomeIcon icon={faIdCard} className="text-2xl" />
                    <h1 className="text-md font-bold">Perfil</h1>
                  </Link>
                </li>
                <div className='border-b border-gray-400 m-1'></div>
                <li className="flex justify-start hover:bg-gray-100 rounded-md">
                  <div className="flex items-center space-x-2 p-2">
                    <FontAwesomeIcon icon={faRightToBracket} className="text-2xl" />
                    <h1 onClick={() => signOut()} className="text-md font-bold cursor-pointer">Cerrar sesión</h1>
                  </div>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link href="/auth/login" className="btn font-bold">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

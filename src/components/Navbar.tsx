import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react'; // Usando NextAuth.js para el cierre de sesión

const Navbar = () => {
  const [theme, setTheme] = useState('light');
  const { data: session } = useSession(); // Obtener datos de la sesión

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/informes/">
          <h1 className="btn btn-ghost text-xl">Inicio</h1>
        </Link>
      </div>

      <div className="mx-3">
        <label className="swap swap-rotate">
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} style={{ opacity: 0 }} />
          <svg className="swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            {/* Sun icon */}
            <path d="..." />
          </svg>
          <svg className="swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            {/* Moon icon */}
            <path d="..." />
          </svg>
        </label>
      </div>

      <div className="flex-none">
        {session ? (
          <>
            <h1>{session.user?.name || 'Usuario'}</h1> 
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="Profile" src={session.user?.image || '/default-avatar.png'} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <a>Profile</a>
                </li>
                <li><a>Settings</a></li>
                <li><a onClick={() => signOut()}>Logout</a></li> {/* Cierre de sesión */}
              </ul>
            </div>
          </>
        ) : (
          <Link href="/login" className="btn">Login</Link> // Link a la página de inicio de sesión
        )}
      </div>
    </div>
  );
};

export default Navbar;

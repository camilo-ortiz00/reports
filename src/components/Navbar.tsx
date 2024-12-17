import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const Navbar = () => {
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const userId = session?.user.id ? Number(session.user.id) : null;

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/updateUser?id=${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al obtener datos de usuario');
          }
          return res.json();
        })
        .then((data) => {
          if (data.profile_picture) {
            const imageBuffer = new Uint8Array(Object.values(data.profile_picture));
            const mimeType = data.profile_picture_type || 'image/jpeg';
            const blob = new Blob([imageBuffer], { type: mimeType });
            const imageUrl = URL.createObjectURL(blob);
            setProfilePicture(imageUrl);
          } else {
            setProfilePicture('/default-image.jpg'); // Imagen por defecto si no existe
          }
          
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  return (
    <div className="navbar bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn bg-white text-black border border-gray-800 drawer-button">
          <svg className="w-6 h-6 text-black-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>
        </label>
      </div>
      <div className="flex">
        <Link href="/">
          <h1 className="btn btn-ghost text-xl font-bold">Inicio</h1>
        </Link>
        
      </div>
      <div className="flex flex-row justify-center items-center bg-gray-100 pr-4 pl-4 space-x-4 rounded-lg w-max mx-auto">
        <Image
          src="/logos/colombiapv.png"
          alt="Logo colombiapv"
          width={80}
          height={80}
          priority
        />
        <div className="h-8 border-l border-gray-300"></div>
        <Image
          src="/logos/mindefensa.png"
          alt="Logo mindefensa"
          width={80}
          height={80}
          priority
        />
        <div className="h-8 border-l border-gray-300"></div>
        <Image
          src="/logos/mincultura.png"
          alt="Logo mincultura"
          width={80}
          height={80}
          priority
        />
        <div className="h-8 border-l border-gray-300"></div>
        <Image
          src="/logos/armada.png"
          alt="Logo armada"
          width={80}
          height={80}
          priority
        />
        <div className="h-8 border-l border-gray-300"></div>
        <Image
          src="/logos/dimar.png"
          alt="Logo dimar"
          width={140}
          height={140}
          priority
        />
        <div className="h-8 border-l border-gray-300"></div>
        <Image
          src="/logos/escuelanaval.png"
          alt="Logo escuela naval"
          width={40}
          height={40}
          priority
        />
        <div className="h-8 border-l border-gray-300"></div>
        <Image
          src="/logos/icanh.png"
          alt="Logo icanh"
          width={80}
          height={80}
          priority
        />
      </div>
      <div className="flex-none ml-auto flex items-center space-x-2">
        {session ? (
          <>
            <h1 className="mr-2 font-bold">{session.user?.name || 'Usuario'}</h1> 
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2">
                  {profilePicture ? (
                     <Image
                     src={profilePicture || '/default-image.jpg'}
                     alt="Profile Picture"
                     width={40}
                     height={40}
                     style={{ objectFit: 'cover' }}
                   />
                  ) : (
                    <FontAwesomeIcon icon={faUser} size="3x"/>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-[12em] p-2 shadow">
                <li className="flex justify-start hover:bg-gray-100 rounded-md">
                  <Link href="/user/profile" className="flex items-center justify-start space-x-2 p-2">
                    <FontAwesomeIcon icon={faIdCard} className="text-2xl" />
                    <h1 className="text-md font-bold">Perfil</h1>
                  </Link>
                </li>
                <div className="border-b border-gray-400 m-1"></div>
                <li className="flex justify-start hover:bg-gray-100 rounded-md">
                <div 
                  className="flex items-center space-x-2 p-2 cursor-pointer"
                  onClick={() => signOut()}
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="text-2xl" />
                  <h1 className="text-md font-bold">Cerrar sesión</h1>
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

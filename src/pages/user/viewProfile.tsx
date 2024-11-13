import React, { FC, useEffect, useState } from 'react';
import { User } from '@/model/user.props';
import { useSession } from "next-auth/react";
import { faCircleArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Importa Link

interface UserFormProps {
  userData?: User;
}

const ViewProfile: FC<UserFormProps> = ({ userData }) => {
    const router = useRouter(); // Inicializa el router
    const { id } = router.query; // Obtiene el ID del usuario desde la query
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!userData) {
            fetch(`/api/user/updateUser?id=${id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Error al obtener usuarios');
                    }
                    return res.json();
                })
                .then((data) => setUser(data))
                .catch((error) => {
                    console.error(error);
                    setUser(null);
                });
        } else {
            setUser(userData);
        }
    }, [userData, id]);

    if (!user) return <div>Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
                <Link href="/user/userList">
                    <button className="btn btn-outline text-black mt-8 mr-8 px-4 py-2 rounded">
                    <FontAwesomeIcon icon={faCircleArrowLeft} size='2x'/>
                     Regresar a Admin. Usuarios
                    </button>
                </Link>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Información Personal</h2>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content w-24 h-24 rounded-full overflow-hidden relative">
                                {user.profile_picture ? (
                                    <Image
                                        src={user.profile_picture || '/default-image.jpg'}
                                        alt="Profile Picture"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUser} size="3x" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                            <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.date}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.phone}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.address}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Número de Documento de Identidad</label>
                            <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.identity_document}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Información de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de Contacto</label>
                        <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.contact_person_name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
                        <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.contact_person_phone}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo de Contacto</label>
                        <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.contact_person_email}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold">Información Adicional</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Sangre</label>
                        <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.blood_type}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                        <p className="border rounded-lg p-2 mt-1 w-full bg-gray-200">{user.marital_status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;

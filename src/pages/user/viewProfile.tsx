import React, { FC, useEffect, useState } from 'react';
import { User } from '@/model/user.props';
import { useSession } from "next-auth/react";
import { faCircleArrowLeft, faDownload, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import AlertComponent from '@/components/Alert';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Importa Link

interface UserFormProps {
  userData?: User;
}

const ViewProfile: FC<UserFormProps> = ({ userData }) => {
    const router = useRouter(); // Inicializa el router
    const { id } = router.query; // Obtiene el ID del usuario desde la query
    const [user, setUser] = useState<User | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (!userData) {
            fetch(`/api/user/updateUser?id=${id}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Error al obtener usuarios');
                    }
                    return res.json();
                })
                .then((data) => {
                  console.log(data);
        
                  setUser((prevUsers) => ({
                    ...data,
                    profile_status: data.profile_status ?? 0,
                  }));
        
                  if (data.profile_picture && data.profile_picture.data) {
                    const imageBuffer = new Uint8Array(data.profile_picture.data);
                    const imageType = data.profile_picture.mimeType; // Asegúrate de que tienes el tipo MIME adecuado (por ejemplo, 'image/jpeg', 'image/png', etc.)
                    const blob = new Blob([imageBuffer], { type: imageType });
                    setProfilePicture(URL.createObjectURL(blob));
                  }
                })
                .catch((error) => {
                  console.error(error);
                  setUser((prevUsers) => ({
                    ...prevUsers,
                    name: '',
                    email: '',
                    profile_status: 0,
                  }));
                });
            } else {
              setUser(userData);
        
              // Convertir el buffer de la imagen en URL si ya existe en userData
              if (userData.profile_picture && Buffer.isBuffer(userData.profile_picture)) {
                const blob = new Blob([new Uint8Array(userData.profile_picture)], { type: 'image/jpeg' });
                setProfilePicture(URL.createObjectURL(blob));
              }
            }
    }, [userData, id]);

    if (!user) return <div>Cargando...</div>;

    const handleDownload = async (fileType: string) => {
        try {
          const response = await fetch(`/api/user/downloadFile?fileType=${fileType}&userId=${user.id}`);
          if (!response.ok) {
            throw new Error('Error al descargar el archivo');
          }
      
          const fileBlob = await response.blob();
          const fileUrl = URL.createObjectURL(fileBlob);
      
          // Obtener el nombre original del archivo desde los encabezados
          const contentDisposition = response.headers.get('Content-Disposition');
          let fileName = 'archivo';
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) {
              fileName = match[1];
            }
          }
      
          // Crear enlace de descarga
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(fileUrl);
        } catch (error) {
          setAlertType('error');
          setAlertMessage('Error al intentar descargar el archivo');
          setShowAlert(true);
          console.error(error);
        }
      };

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
        {profilePicture ? (
          <Image
            src={profilePicture || '/default-image.jpg'}
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

  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold">Documentación</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
      <div>
      <label htmlFor="cv_file" className="block text-sm font-medium text-gray-700">
        Hoja de vida
      </label>
      <div className="flex items-center space-x-2">
          <span
          className="border rounded-lg p-2 mt-1 w-full bg-gray-200 text-gray-600 cursor-pointer hover:underline"
          onClick={() => handleDownload('cv_file')}
          >
          {user.cv_file_name || 'Ningún archivo seleccionado'}
          </span>
          <FontAwesomeIcon
          icon={faDownload}
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleDownload('cv_file')}
          />
      </div>
      </div>

      <div>
      <label htmlFor="id_file" className="block text-sm font-medium text-gray-700">
        Documento de Identidad
      </label>
      <div className="flex items-center space-x-2">
          <span
          className="border rounded-lg p-2 mt-1 w-full bg-gray-200 text-gray-600 cursor-pointer hover:underline"
          onClick={() => handleDownload('id_file')}
          >
          {user.id_file_name || 'Ningún archivo seleccionado'}
          </span>
          <FontAwesomeIcon
          icon={faDownload}
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleDownload('id_file')}
          />
      </div>
      </div>

      <div>
      <label htmlFor="academic_support_files" className="block text-sm font-medium text-gray-700">
          Archivos de Soporte Académico
      </label>
      <div className="flex items-center space-x-2">
          <span
          className="border rounded-lg p-2 mt-1 w-full bg-gray-200 text-gray-600 cursor-pointer hover:underline"
          onClick={() => handleDownload('academic_support_files')}
          >
          {user.academic_support_name || 'Ningún archivo seleccionado'}
          </span>
          <FontAwesomeIcon
          icon={faDownload}
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleDownload('academic_support_files')}
          />
      </div>
      </div>
  </div>
  </div>

    <AlertComponent
      show={showAlert}
      type={alertType}
      message={alertMessage}
      onClose={setShowAlert}
    />
        </div>
    );
};

export default ViewProfile;
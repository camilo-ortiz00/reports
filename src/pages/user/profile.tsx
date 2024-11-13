import React, { FC, useEffect, useState } from 'react';
import { User } from '@/model/user.props';
import { useSession } from "next-auth/react";
import { faPen, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import AlertComponent from '@/components/Alert';

interface UserFormProps {
  userData?: User;
  onSubmit: (data: User) => void;
}

const Profile: FC<UserFormProps> = ({ userData, onSubmit }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [Users, setUsers] = useState<User>({
    id: userId ? Number(userId) : undefined,
    name: '',
    email: '',
    date: '',
    phone: '',
    password: '',
    role_id: Number(session?.user.id) || 0,
    address: '',
    profile_picture: '',
    work_lines: '',
    contact_person_name: '',
    contact_person_phone: '', 
    contact_person_email: '',
    blood_type: '',
    identity_document: '',
    marital_status: '',
    id_file: '',
    cv_file: '',
    academic_support_files: '',
    profile_status: 0,
    role: { id: 0, name: '', description: '' },
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!userData) {
      fetch(`/api/user/updateUser?id=${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al obtener usuarios');
          }
          return res.json();
        })
        .then((data) => {
          // Asegurarse de que profile_status se inicialice desde la base de datos o se calcule si no existe
          setUsers((prevUsers) => ({
            ...data,
            profile_status: data.profile_status ?? 0,  // Inicializa con el valor de la base de datos
          }));
          calculateProfileStatus(data);  // Pasar el data cargado desde la base de datos para el cálculo
        })
        .catch((error) => {
          console.error(error);
          setUsers((prevUsers) => ({
            ...prevUsers,
            name: '',
            email: '',
            profile_status: 0,  // Valor por defecto si hay error
          }));
        });
    } else {
      setUsers(userData);
      calculateProfileStatus(userData);  // Calcular el porcentaje con los datos de usuario ya disponibles
    }
  }, [userData, userId]);
  
  const calculateProfileStatus = (user: User) => {
    let completedFields = 0;
    const totalFields = 15;  // Número total de campos a evaluar
  
    // Lista de campos a evaluar
    const fields = [
      'name', 'email', 'date', 'phone', 'address', 'profile_picture', 'identity_document',
      'contact_person_name', 'contact_person_phone', 'contact_person_email', 
      'blood_type', 'marital_status', 'id_file', 'cv_file', 'academic_support_files'
    ];
  
    // Evaluamos los campos que ya están completos
    fields.forEach(field => {
      if (user[field as keyof User] && user[field as keyof User] !== '') {
        completedFields++;
      }
    });
  
    // Si el campo de imagen de perfil está configurado, lo contamos también
    if (user.profile_picture) {
      completedFields++;
    }
  
    // Calcular el porcentaje de completitud
    const profileStatus = (completedFields / totalFields) * 100;
    console.log("Profile Status Calculado:", profileStatus);  // Verifica el cálculo aquí
  
    setUsers(prevUsers => ({
      ...prevUsers,
      profile_status: profileStatus,  // Actualizar el profile_status con el valor calculado
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsers({ ...Users, [name]: value });
    calculateProfileStatus(Users);  // Pasa 'Users' como argumento
  };

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
  
      setUsers((prevUsers) => {
        const updatedUser = {
          ...prevUsers,
          profile_picture: imageUrl,
        };
        return updatedUser;
      });
      calculateProfileStatus(Users);  // Llamar a la función después de actualizar el estado
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure profile status is always calculated before submission
    calculateProfileStatus(Users); 
  
    try {
      const formData = new FormData();
  
      for (const key in Users) {
        const value = Users[key as keyof typeof Users];
        if (key === 'password') continue;

        if (key === 'profile_picture' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      }
  
      // Append the calculated profile status
      formData.append('profile_status', String(Users.profile_status || 0));  // Default to 0 if undefined
  
      const response = await fetch(`/api/user/updateUser?id=${Users.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario');
      }
  
      const updatedData = await response.json();
      setAlertType('success');
      setAlertMessage('¡Perfil actualizado con éxito!');
      setShowAlert(true);
      console.log('Datos actualizados desde el servidor:', updatedData);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error al actualizar el perfil.');
      setShowAlert(true);
      console.error('Error al enviar los datos del formulario:', error);
    }
  };
  

  return (
  <form onSubmit={handleSubmit} className="space-y-6 max-w-[80%] mx-auto">
  <div className="w-full bg-gray-700 h-2 rounded-full">
    <div
      className="bg-gray-400 h-full rounded-full transition-all duration-500"
      style={{ width: `${Users.profile_status}%` }}
    ></div>
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
          <label
            htmlFor="profile_picture"
            className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-full cursor-pointer"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => document.getElementById('profileInput')?.click()}
          >
            <FontAwesomeIcon icon={faPen} />
          </label>
          <input
          id="profile_picture"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                id="name"
                value={Users.name}
                onChange={handleChange}
                className="border rounded-lg p-2 mt-1 w-full"
                required
                disabled
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                value={Users.email}
                onChange={handleChange}
                className="border rounded-lg p-2 mt-1 w-full"
                required
                disabled
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input
                type="date"
                name="date"
                id="date"
                value={Users.date}
                onChange={handleChange}
                className="border rounded-lg p-2 mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={Users.phone}
                onChange={handleChange}
                className="border rounded-lg p-2 mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                name="address"
                id="address"
                value={Users.address}
                onChange={handleChange}
                className="border rounded-lg p-2 mt-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="identity_document" className="block text-sm font-medium text-gray-700">Número de Documento de Identidad</label>
              <input
                type="text"
                name="identity_document"
                id="identity_document"
                value={Users.identity_document}
                onChange={handleChange}
                className="border rounded-lg p-2 mt-1 w-full"
                required
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Información de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_person_name" className="block text-sm font-medium text-gray-700">Nombre de Contacto</label>
            <input
              type="text"
              name="contact_person_name"
              id="contact_person_name"
              value={Users.contact_person_name}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="contact_person_phone" className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
            <input
              type="tel"
              name="contact_person_phone"
              id="contact_person_phone"
              value={Users.contact_person_phone}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="contact_person_email" className="block text-sm font-medium text-gray-700">Correo de Contacto</label>
            <input
              type="email"
              name="contact_person_email"
              id="contact_person_email"
              value={Users.contact_person_email}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Información Adicional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">Tipo de Sangre</label>
            <select
              name="blood_type"
              id="blood_type"
              value={Users.blood_type}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 w-full"
            >
              <option value="">Seleccione su tipo de sangre</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">Estado Civil</label>
            <select
              name="marital_status"
              id="marital_status"
              value={Users.marital_status}
              onChange={handleChange}
              className="border rounded-lg p-2 mt-1 w-full"
            >
              <option value="">Seleccione su estado civil</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="divorciado">Divorciado/a</option>
              <option value="viudo">Viudo/a</option>
              <option value="union_libre">Unión libre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Documentación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cv_file" className="block text-sm font-medium text-gray-700">CV</label>
            <input
              type="file"
              name="cv_file"
              id="cv_file"
              accept=".pdf, .doc, .docx"
              onChange={handleChange}
              className="file-input border rounded-lg p-2 mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="academic_support_files" className="block text-sm font-medium text-gray-700">Archivos de Soporte Académico</label>
            <input
              type="file"
              name="academic_support_files"
              id="academic_support_files"
              accept=".pdf, .doc, .docx"
              onChange={handleChange}
              className="file-input border rounded-lg p-2 mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="id_file" className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
            <input
              type="file"
              name="id_file"
              id="id_file"
              accept=".pdf, .doc, .docx"
              onChange={handleChange}
              className="file-input border rounded-lg p-2 mt-1 w-full"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-center mb-8">
        <button
          type="submit"
          className="w-18 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Guardar Cambios
        </button>
      </div>
      <div></div>
      <AlertComponent
        show={showAlert}
        type={alertType}
        message={alertMessage}
        onClose={setShowAlert}
      />
    </form>
);

};

export default Profile;

import React, { FC, useEffect, useState } from 'react';
import { User } from '@/model/user.props';
import { useSession } from "next-auth/react";
import { faDownload, faPen, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import AlertComponent from '@/components/Alert';
import CircularProgress from '@/components/CircularProgress';

interface UserFormProps {
  userData?: User;
  onSubmit: (data: User) => void;
}

const Profile: FC<UserFormProps> = ({ userData, onSubmit }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [selectedFileName, setSelectedFileName] = useState<Record<string, string>>({});

  const [Users, setUsers] = useState<User>({
    id: userId ? Number(userId) : undefined,
    name: '',
    email: '',
    date: '',
    phone: '',
    password: '',
    role_id: Number(session?.user.id) || 0,
    address: '',
    profile_picture: Buffer.from(''),
    profile_picture_name: '',
    profile_picture_type: '',
    work_lines: '',
    contact_person_name: '',
    contact_person_phone: '',
    contact_person_email: '',
    blood_type: '',
    identity_document: '',
    marital_status: '',
    id_file: Buffer.from(''),
    cv_file: Buffer.from(''),
    academic_support_files: Buffer.from(''),
    academic_support_name: '',
    profile_status: 0,
    role: { id: 0, name: '', description: '' },
  });

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
          console.log(data);

          setUsers((prevUsers) => ({
            ...data,
            profile_status: data.profile_status ?? 0,
          }));
          calculateProfileStatus(data);

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
          console.error(error);
          setUsers((prevUsers) => ({
            ...prevUsers,
            name: '',
            email: '',
            profile_status: 0,
          }));
        });
    } else {
      setUsers(userData);
      calculateProfileStatus(userData);

      // Convertir el buffer de la imagen en URL si ya existe en userData
      if (userData.profile_picture && typeof userData.profile_picture === 'object') {
        const imageBuffer = new Uint8Array(Object.values(userData.profile_picture));
        const blob = new Blob([imageBuffer], { type: userData.profile_picture_type || 'image/jpeg' });
        setProfilePicture(URL.createObjectURL(blob));
      }      
    }
  }, [userData, userId]);

  const calculateProfileStatus = (user: User) => {
    let completedFields = 0;
    const totalFields = 17; 

    const fields = [
      'name', 'email', 'date', 'phone', 'address', 'profile_picture', 'identity_document',
      'contact_person_name', 'work_lines','contact_person_phone', 'contact_person_email', 
      'blood_type', 'marital_status', 'id_file', 'cv_file', 'academic_support_files'
    ];

    fields.forEach(field => {
      if (user[field as keyof User] && user[field as keyof User] !== '') {
        completedFields++;
      }
    });

    if (user.profile_picture) {
      completedFields++;
    }

    const profileStatus = (completedFields / totalFields) * 100;

    setUsers(prevUsers => ({
      ...prevUsers,
      profile_status: profileStatus,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsers({ ...Users, [name]: value });
    calculateProfileStatus(Users);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
  
      if (!validateFileType(file)) {
        setAlertType('error');
        setAlertMessage('Tipo de archivo no válido. Solo se permiten PDF, DOC, DOCX, JPEG y PNG.');
        setShowAlert(true);
        return;
      }
  
      // Procesar el archivo si es válido
      setUsers((prevUsers) => ({
        ...prevUsers,
        [`${name}_name`]: file.name,
        [name]: file,
      }));
  
      setSelectedFileName((prevState) => ({
        ...prevState,
        [name]: file.name,
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Lee el archivo como binario y convierte a Buffer
      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer);

        setProfilePicture(URL.createObjectURL(file));

        setUsers((prevUsers) => {
          const updatedUser = {
            ...prevUsers,
            profile_picture: buffer, 
            profile_picture_name: file.name,
            profile_picture_type: file.type
          };
          return updatedUser;
        });

        calculateProfileStatus(Users);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    calculateProfileStatus(Users);
  
    const formData = new FormData();
    console.log('Datos de Users:', Users);
  
    // Agrega el estado del perfil
    formData.append('profile_status', String(Users.profile_status || 0));
  
    // Procesa los campos de texto y archivos
    Object.keys(Users).forEach((key) => {
      const value = Users[key as keyof typeof Users];
      if (key === 'password') return; // Excluir contraseña
  
      if (key === 'profile_picture' && Users.profile_picture) {
        const blob = new Blob([Users.profile_picture], { type: Users.profile_picture_type || 'image/jpeg' });
        formData.append('profile_picture', blob, Users.profile_picture_name || 'profile_picture.jpg');
      } else if (['cv_file', 'academic_support_files', 'id_file'].includes(key)) {
        const fileInput = document.querySelector(`input[name=${key}]`) as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          formData.append(key, file, file.name);
        }
      } else if (value) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
  
    console.log('FormData después de procesar:', Array.from(formData.entries()));
  
    try {
      const response = await fetch(`/api/user/updateUser?id=${Users.id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      console.log('Datos actualizados desde el servidor:', data);
  
      if (response.ok) {
        setAlertType('success');
        setAlertMessage('Perfil actualizado con éxito.');
      } else {
        throw new Error(data.message || 'Error al actualizar el perfil.');
      }
    } catch (error) {
      console.error(error);
      setAlertType('error');
      setAlertMessage('Error al actualizar el perfil.');
    } finally {
      setShowAlert(true);
    }
  };
  
  
  const handleDownload = async (fileType: string) => {
    try {
      const response = await fetch(`/api/user/downloadFile?fileType=${fileType}&userId=${Users.id}`);
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
  
  const validateFileType = (file: File): boolean => {
    const supportedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    
    if (!supportedMimeTypes.includes(file.type)) {
      console.error(`Tipo MIME no soportado: ${file.type} para ${file.name}`);
      return false;
    }
    
    return true;
  };
  
  
  return (
  <>
  <form onSubmit={handleSubmit} className="space-y-6 max-w-[80%] mx-auto">
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
              value={Users.name ?? ''}
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
              value={Users.email ?? ''}
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
              value={Users.date ?? ''}
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
              value={Users.phone ?? ''}
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
              value={Users.address ?? ''}
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
              value={Users.identity_document ?? ''}
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
            value={Users.contact_person_name ?? ''}
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
            value={Users.contact_person_phone ?? ''}
            onChange={handleChange}
            className="border rounded-lg p-2 mt-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="contact_person_email" className="block text-sm font-medium text-gray-700">Email de Contacto</label>
          <input
            type="email"
            name="contact_person_email"
            id="contact_person_email"
            value={Users.contact_person_email ?? ''}
            onChange={handleChange}
            className="border rounded-lg p-2 mt-1 w-full"
          />
        </div>
        <div>
          <label htmlFor="work_lines" className="block text-sm font-medium text-gray-700">Linea(s) de trabajo</label>
          <input
            type="text"
            name="work_lines"
            id="work_lines"
            value={Users.work_lines ?? ''}
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
            value={Users.blood_type  ?? ''}
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
            value={Users.marital_status  ?? ''}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full">

        {/* CV File */}
        <div>
          <label htmlFor="cv_file" className="block text-sm font-medium text-gray-700">
            Hoja de vida (Archivo PDF, DOC, DOCX)
          </label>
          <div className="flex items-center space-x-2">
            <span
              className="text-gray-600 cursor-pointer hover:underline"
              onClick={() => handleDownload('cv_file')}
            >
              {selectedFileName.cv_file || Users.cv_file_name || 'Ningún archivo seleccionado'}
            </span>
            <FontAwesomeIcon
              icon={faDownload}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => handleDownload('cv_file')}
            />
          </div>
          <input
            type="file"
            name="cv_file"
            id="cv_file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="file-input border rounded-lg p-2 mt-1 w-full"
          />
        </div>

        {/* ID File */}
        <div>
          <label htmlFor="id_file" className="block text-sm font-medium text-gray-700">
            Documento de Identidad (PDF, DOC, DOCX)
          </label>
          <div className="flex items-center space-x-2">
            <span
              className="text-gray-600 cursor-pointer hover:underline"
              onClick={() => handleDownload('id_file')}
            >
              {selectedFileName.id_file || Users.id_file_name || 'Ningún archivo seleccionado'}
            </span>
            <FontAwesomeIcon
              icon={faDownload}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => handleDownload('id_file')}
            />
          </div>
          <input
            type="file"
            name="id_file"
            id="id_file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="file-input border rounded-lg p-2 mt-1 w-full"
          />
        </div>

        {/* Academic Support Files */}
        <div>
          <label htmlFor="academic_support_files" className="block text-sm font-medium text-gray-700">
            Archivos de Soporte Académico (PDF, DOC, DOCX)
          </label>
          <div className="flex items-center space-x-2">
            <span
              className="text-gray-600 cursor-pointer hover:underline"
              onClick={() => handleDownload('academic_support_files')}
            >
              {selectedFileName.academic_support_files || Users.academic_support_name || 'Ningún archivo seleccionado'}
            </span>
            <FontAwesomeIcon
              icon={faDownload}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => handleDownload('academic_support_files')}
            />
          </div>
          <input
            type="file"
            name="academic_support_files"
            id="academic_support_files"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
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

    <AlertComponent
      show={showAlert}
      type={alertType}
      message={alertMessage}
      onClose={setShowAlert}
    />
  </form>
  <div className="fixed bottom-24 right-5 mt-4 flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg z-50">
    <CircularProgress percentage={Math.round(Users.profile_status)} />
  </div>
  </>
);};

export default Profile;

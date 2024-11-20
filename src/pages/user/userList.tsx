import React, { FC, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import UserForm from './userForm';
import ModalComponent from '@/components/Modal';
import { User } from '@/model/user.props';
import AlertComponent from '@/components/Alert';
import { useRouter } from 'next/router';

const UserList: FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'error' | 'success' | 'warning'>('success');

  useEffect(() => {
    fetch('/api/user/users')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener usuarios');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => {
        console.error(error);
        setUsers([]);
      });
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.identity_document.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Función para determinar el color del círculo según el progreso
  const getStatusColor = (profileStatus: number) => {
    return profileStatus === 100 ? 'bg-green-500' : 'bg-yellow-500';
  };

  const columns = [
    {
      name: 'ID',
      selector: (row: User) => row.id ?? 0,
      sortable: true,
      width: '5em',
    },
    {
      name: 'Nombre',
      selector: (row: User) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: User) => row.email,
    },
    {
      name: 'Documento de Identidad',
      selector: (row: User) => row.identity_document,
    },
    {
      name: 'Perfil completado',
      cell: (row: User) => (
        <div className="flex items-center space-x-2">
          <div
            className={`w-6 h-6 rounded-full ${getStatusColor(row.profile_status)}`}
          />
            <span>{Math.round(row.profile_status)}%</span>
          </div>
      ),
    },
    {
      name: 'Acciones',
      cell: (row: User) => (
        <div className="flex space-x-2 w-full"> {/* Asegura que el contenedor sea suficientemente ancho */}
          <button
            className="bg-blue-500 text-white font-bold px-4 py-1 rounded whitespace-nowrap" // Asegura que el texto no se envuelva
            onClick={() => handleEditUser(row)}
          >
            Editar
          </button>
          <button
            className="bg-green-500 text-white font-bold px-4 py-1 rounded" // Asegura que el texto no se envuelva
            onClick={() => {
              if (row.id !== undefined) {
                handleViewUser(row.id);
              }
            }}
          >
            Ver info. completa
          </button>
        </div>
      ),
    }
    
    
  ];

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleViewUser = (id: number) => {
    router.push(`/user/viewProfile?id=${id}`);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleSaveUser = async (user: User) => {
    try {
      const url = `/api/user/users/${user.id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error al guardar el usuario:', errorResponse);
        setAlertMessage('Error al guardar el usuario');
        setAlertType('error');
        setShowAlert(true);
        return;
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      setShowModal(false);
      setAlertMessage('Usuario guardado exitosamente');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error en la operación');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>

      <ModalComponent show={showModal} title={'Editar Usuario'} closeModal={handleCloseModal}>
        <UserForm user={selectedUser} onSave={handleSaveUser} />
      </ModalComponent>

      <AlertComponent show={showAlert} type={alertType} message={alertMessage} onClose={setShowAlert} />

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuario por nombre, email o documento"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>

      <DataTable
      className='card bg-gray-100 p-4 shadow-lg rounded'
        columns={columns}
        data={Array.isArray(filteredUsers) ? filteredUsers : []}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay usuarios disponibles"
      />
    </div>
  );
};

export default UserList;

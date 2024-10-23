import React, { FC, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import UserForm from './userForm';
import ModalComponent from '@/components/Modal';
import { User } from '@/model/user.props';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert';

const UserList: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'error' | 'success' | 'warning'>('success');

  // Obtener la lista de usuarios
  useEffect(() => {
    fetch('/api/user/users')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener usuarios');
        }
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error(error);
        setUsers([]); // Establecer array vacío en caso de error
      });
  }, []);

 // En UserList.tsx
const columns = [
  {
    name: 'ID',
    selector: (row: User) => row.id,
    sortable: true,
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
    name: 'Documento de Identidad', // Nueva columna
    selector: (row: User) => row.identity_document,
  },
  {
    name: 'Acciones',
    cell: (row: User) => (
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
          onClick={() => handleEditUser(row)}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white px-4 py-1 rounded"
          onClick={() => handleShowDeleteModal(row)}
        >
          Eliminar
        </button>
      </div>
    ),
  },
];


  // Función para manejar la edición de usuarios
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Función para manejar la creación de un nuevo usuario
  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  // Función para guardar un usuario
  const handleSaveUser = async (user: User) => {
    try {
      // Solo se utiliza PUT para actualizar
      const url = `/api/user/users/${user.id}`; // Asegúrate de que el ID esté en la URL
      const response = await fetch(url, {
        method: 'PUT', // Solo PUT
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
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)) // Actualiza el usuario
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
  

  // Función para mostrar el modal de eliminación
  const handleShowDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Función para manejar la confirmación de la eliminación
  const handleConfirmDeleteUser = async () => {
    if (userToDelete) {
      await handleDeleteUser(userToDelete.id);
    }
    setShowDeleteModal(false);
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/user/users?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      setUsers(users.filter((user) => user.id !== id)); // Eliminar el usuario de la lista
      setAlertMessage('Usuario eliminado exitosamente');
      setAlertType('warning');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('Hubo un error al eliminar el usuario');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Cerrar el modal de eliminación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      <ModalComponent
        show={showModal}
        title={'Editar Usuario'}
        closeModal={handleCloseModal}
      >
        <UserForm
          user={selectedUser}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      </ModalComponent>

      <ModalDeleteComponent
        show={showDeleteModal}
        title="Confirmar Eliminación"
        closeModal={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteUser}
      >
        <p>¿Estás seguro de que deseas eliminar al usuario {userToDelete?.name}?</p>
      </ModalDeleteComponent>

      <AlertComponent 
        show={showAlert} 
        type={alertType} 
        message={alertMessage} 
        onClose={setShowAlert} 
      />

      <DataTable
        columns={columns}
        data={Array.isArray(users) ? users : []}
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

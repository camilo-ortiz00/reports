import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import RoleForm from './roleForm';
import ModalComponent from '@/components/Modal';
import { Role } from '@/model/role.props';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert'; // Importa el componente de alerta

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>(undefined);
  const [showAlert, setShowAlert] = useState<boolean>(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState<string>(''); // Mensaje de alerta
  const [alertType, setAlertType] = useState<'error' | 'success' | 'warning'>('success'); // Tipo de alerta

  useEffect(() => {
    fetch('/api/user/roles')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener roles');
        }
        return res.json();
      })
      .then((data) => setRoles(data))
      .catch((error) => {
        console.error(error);
        setRoles([]); 
      });
  }, []);

  const handleSaveRole = async (role: Role) => {
    try {
      const method = role.id ? 'PUT' : 'POST';
      const response = await fetch('/api/user/roles', {
        method,
        headers: { 'Content-Type': 'application/json' 
        },
        body: JSON.stringify(role),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error al guardar el rol:', errorResponse);
        setAlertMessage('Error al guardar el rol');
        setAlertType('error');
        setShowAlert(true);
        return;
      }

      const updatedRole = await response.json();
      setRoles((prevRoles) => {
        if (role.id) {
          return prevRoles.map((r) => (r.id === updatedRole.id ? updatedRole : r));
        } else {
          return [...prevRoles, updatedRole]; 
        }
      });

      setShowModal(false);
      setAlertMessage('Rol guardado exitosamente');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error en la operación');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  // Función para eliminar un rol
  const handleDeleteRole = async (id: number) => {
    try {
      const response = await fetch(`/api/user/roles?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      setRoles((prev) => prev.filter((role) => role.id !== id));
      setAlertMessage('Rol eliminado exitosamente');
      setAlertType('warning');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('Hubo un error al eliminar el rol');
      setAlertType('error');
      setShowAlert(true);
    }
  };

 const handleShowDeleteModal = (role: Role) => {
  setRoleToDelete(role);
  setShowDeleteModal(true);
};

const handleConfirmDeleteRole = async () => {
  if (roleToDelete) {
    await handleDeleteRole(roleToDelete.id);
  }
  setShowDeleteModal(false); 
};

const handleEditRole = (role: Role) => {
  setSelectedRole(role);
  setShowModal(true);
};

const handleCreateRole = () => {
  setSelectedRole(undefined); 
  setShowModal(true);
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const columns = [
    {
      name: 'ID',
      selector: (row: Role) => row.id,
      sortable: true,
      width: '8em',
    },
    {
      name: 'Nombre',
      selector: (row: Role) => row.name,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row: Role) => row.description,
    },
    {
      name: 'Acciones',
      cell: (row: Role) => (
        <div>
          <button
            className="bg-blue-500 text-white font-bold px-4 py-1 rounded mr-2"
            onClick={() => handleEditRole(row)}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white font-bold px-4 py-1 rounded"
            onClick={() => handleShowDeleteModal(row)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Roles</h2>
      <button
        onClick={handleCreateRole}
        className="mt-4 mb-8 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
      >
        Crear Nuevo Rol
      </button>

      <ModalComponent
        show={showModal}
        title={selectedRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
        closeModal={handleCloseModal}
      >
        <RoleForm
          onSave={handleSaveRole}
          initialData={selectedRole}
        />
      </ModalComponent>

      <ModalDeleteComponent
        show={showDeleteModal}
        title="Confirmar Eliminación"
        closeModal={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteRole}
      >
        <p>¿Estás seguro de que deseas eliminar el rol {roleToDelete?.name}?</p>
      </ModalDeleteComponent>

      <AlertComponent 
        show={showAlert} 
        type={alertType} 
        message={alertMessage} 
        onClose={setShowAlert} 
      />

      <DataTable
        className='card bg-gray-100 p-4 shadow-lg rounded'
        columns={columns}
        data={Array.isArray(roles) ? roles : []}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay roles disponibles"
      />
    </div>
  );
};

export default RoleList;

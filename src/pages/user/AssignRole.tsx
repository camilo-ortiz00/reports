import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Role } from '@/model/role.props';
import { User } from '@/model/user.props';
import AlertComponent from '@/components/Alert'; // Asegúrate de que la ruta sea correcta

const AssignRoleForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'success'>('success');
  const [alertMessage, setAlertMessage] = useState('');

  // Obtener la lista de usuarios
  useEffect(() => {
    fetch('/api/user/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Obtener la lista de roles
  useEffect(() => {
    fetch('/api/user/roles')
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error('Error fetching roles:', error));
  }, []);

  // Manejar el cambio de rol
  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      const res = await fetch('/api/user/userRoles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roleId }),
      });

      if (res.ok) {
        const updatedRole = roles.find((role) => role.id === roleId);
        if (updatedRole) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, role: updatedRole } : user
            )
          );
        }
        // Mostrar mensaje de éxito
        setAlertMessage('Rol asignado correctamente');
        setAlertType('success');
        setShowAlert(true);
      } else {
        // Mostrar mensaje de error
        setAlertMessage('Error al asignar el rol');
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setAlertMessage('Error al asignar el rol');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  // Definir las columnas para react-data-table-component
  const columns = [
    {
      name: 'ID',
      selector: (row: User) => row.id,
      sortable: true,
      width: '8em',
      cell: (row: User) => (
        <div className="text-center">{row.id}</div>
      ),
    },
    {
      name: 'Nombre',
      selector: (row: User) => row.name,
      sortable: true,
      width: '15em',
      cell: (row: User) => (
        <div className="text-center">{row.name}</div>
      ),
    },
    {
      name: 'Rol',
      selector: (row: User) => row.role?.name || 'Sin rol asignado',
      sortable: true,
      width: '8em',
      cell: (row: User) => (
        <div className="text-center">{row.role?.name || 'Sin rol asignado'}</div>
      ),
    },
    {
      name: 'Asignar Rol',
      cell: (row: User) => (
        <div className="flex justify-center">
          <select
            value={row.role?.id || ''}
            onChange={(e) => handleRoleChange(row.id, Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '20em',
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center mt-10 w-4/5 mx-auto">
      <DataTable
        title="Asignar Roles a Usuarios"
        columns={columns}
        data={users}
        pagination
        highlightOnHover
        customStyles={{
          headRow: {
            style: {},
          },
          headCells: {
            style: {
              marginLeft: '0.8rem',
              textAlign: 'center',
            },
          },
        }}
      />
      {/* Componente de alerta */}
      <AlertComponent 
        show={showAlert} 
        type={alertType} 
        message={alertMessage} 
        onClose={setShowAlert} 
      />
    </div>
  );
};

export default AssignRoleForm;

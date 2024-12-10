import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ModalComponent from '@/components/Modal';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert';
import { Component } from '@/model/projects.props';
import ComponentForm from './componentForm';
import { User } from '@/model/user.props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

const ComponentManagement = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | undefined>(undefined);
  const [componentToDelete, setComponentToDelete] = useState<Component | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'warning'>('success'); 


  useEffect(() => {
    fetch('/api/projects/components')
      .then((res) => res.json())
      .then((data) => setComponents(data))
      .catch((error) => console.error('Error fetching components:', error));
  }, []);

  useEffect(() => {
    fetch('/api/user/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSaveComponent = async (component: Partial<Component> & { userId: number | null }) => {
    try {
      const method = selectedComponent ? 'PUT' : 'POST';
      const response = await fetch('/api/projects/components', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(component),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error al guardar el componente:', errorResponse);
        setAlertMessage('Error al guardar el componente');
        setAlertType('error');
        setShowAlert(true);
        return;
      }
  
      const updatedComponent = await response.json();
      setComponents((prevComponents) => {
        if (selectedComponent) {
          return prevComponents.map((c) => (c.id === updatedComponent.id ? updatedComponent : c));
        } else {
          return [...prevComponents, updatedComponent];
        }
      });
  
      fetch('/api/projects/components')
        .then((res) => res.json())
        .then((data) => setComponents(data))
        .catch((error) => console.error('Error fetching updated components:', error));
  
      setShowModal(false);
      setAlertMessage('Componente guardado exitosamente');
      setAlertType('success');
      setShowAlert(true);
  
      setSelectedComponent(undefined);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error en la operación');
      setAlertType('error');
      setShowAlert(true);
    }
  };
  

  const handleDeleteComponent = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/components?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el componente');
      }

      setComponents((prev) => prev.filter((component) => component.id !== id));
      setAlertMessage('Componente eliminado exitosamente');
      setAlertType('warning');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('Hubo un error al eliminar el Componente');
      setAlertType('error');
      setShowAlert(true);
    }
  };
  
  const handleConfirmDeleteComponent = async () => {
    if (componentToDelete) {
      await handleDeleteComponent(componentToDelete.id);
    }
    setShowDeleteModal(false); 
  };
  
  const handleCreateComponent = () => {
    setSelectedComponent(undefined); 
    setShowModal(true);
  };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
    const handleCloseDeleteModal = () => {
      setShowDeleteModal(false);
    };

    const columns = [
      { name: 'ID', selector: (row: Component) => row.id, sortable: true, width: '8em',},
      { name: 'Nombre', selector: (row: Component) => row.name, sortable: true,},
      {
        name: 'Descripción',
        selector: (row: Component) => row.description,
        cell: (row: Component) => (
        <div className="truncate max-w-xs" title={row.description}>
          {row.description}
        </div>        
        ),
      },      
      {
        name: 'Coordinador(es)',
        selector: (row: Component) => (
            row.user ? row.user.name : 'Sin asignar'
        ),
      },
      {
        name: 'Acciones',
        cell: (row: Component) => (
          <>
            <button
              onClick={() => {
                setSelectedComponent(row);
                setShowModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
            >
              Editar
            </button>
            <button
              onClick={() => {
                setComponentToDelete(row);
                setShowDeleteModal(true);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              Eliminar
            </button>
          </>
        ),
      },
    ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
      <h1 className='text-2xl font-bold mb-4'>Gestión de Componentes</h1>
        <Link href="/proyectos/ProjectManagement">
            <button className="btn btn-outline text-black mt-8 mr-8 px-4 py-2 rounded">
            <FontAwesomeIcon icon={faFolderOpen} size='2x'/>
              Ir a Proyectos
            </button>
        </Link>
      </div>
      <button 
        onClick={handleCreateComponent}
        className="mt-4 mb-8 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
        >
          Agregar Componente
          </button>
          <ModalComponent
        show={showModal}
        title={selectedComponent ? 'Editar Componente' : 'Crear Nuevo Componente'}
        closeModal={handleCloseModal}
      >
        <ComponentForm
          onSave={handleSaveComponent}
          initialData={selectedComponent}
          users={users}        />
      </ModalComponent>

      <ModalDeleteComponent
        show={showDeleteModal}
        title="Confirmar Eliminación"
        closeModal={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteComponent}
      >
      <p>¿Estás seguro de que deseas eliminar el componente {componentToDelete?.name}?</p>
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
        data={Array.isArray(components) ? components : []}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay componentes disponibles"
      />
    </div>
  );
};

export default ComponentManagement;
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ModalComponent from '@/components/Modal';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert';
import { Component } from '@/model/projects.props';
import ComponentForm from './componentForm';

const ComponentManagement = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | undefined>(undefined);
  const [componentToDelete, setComponentToDelete] = useState<Component | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'warning'>('success'); // Tipo de alerta


  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/projects/components');
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleSaveComponent = async (component: Component) => {
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
        if (component.id) {
          return prevComponents.map((c) => (c.id === updatedComponent.id ? updatedComponent : c));
        } else {
          return [...prevComponents, updatedComponent]; 
        }
      });

      setShowModal(false);
      setAlertMessage('Componente guardado exitosamente');
      setAlertType('success');
      setShowAlert(true);
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
        throw new Error('Error al eliminar el rol');
      }

      setComponents((prev) => prev.filter((component) => component.id !== id));
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
  const handleShowDeleteModal = (component: Component) => {
    setComponentToDelete(component);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDeleteComponent = async () => {
    if (componentToDelete) {
      await handleDeleteComponent(componentToDelete.id);
    }
    setShowDeleteModal(false); 
  };
  
  const handleEditComponent = (component: Component) => {
    setSelectedComponent(component);
    setShowModal(true);
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
    { name: 'ID', selector: (row: Component) => row.id, sortable: true },
    { name: 'Nombre', selector: (row: Component) => row.name, sortable: true },
    { name: 'Descripción', selector: (row: Component) => row.description },
    {
      name: 'Acciones',
      cell: (row: Component) => (
        <>
          <button onClick={() => {
            setSelectedComponent(row);
            setShowModal(true);
          }}>Editar</button>
          <button onClick={() => {
            setSelectedComponent(row);
            setShowDeleteModal(true);
          }}>Eliminar</button>
        </>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className='text-2xl font-bold mb-4'>Gestión de Componentes</h1>
      <button 
        onClick={handleCreateComponent}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
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
        />
      </ModalComponent>

      <ModalDeleteComponent
        show={showDeleteModal}
        title="Confirmar Eliminación"
        closeModal={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteComponent}
      >
        <p>¿Estás seguro de que deseas eliminar el rol {componentToDelete?.name}?</p>
      </ModalDeleteComponent>

      <AlertComponent 
        show={showAlert} 
        type={alertType} 
        message={alertMessage} 
        onClose={setShowAlert} 
      />

      <DataTable
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

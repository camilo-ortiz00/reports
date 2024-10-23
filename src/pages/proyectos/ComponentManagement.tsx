import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ModalComponent from '@/components/Modal';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert';
import { Component } from '@/model/projects.props'; // Asegúrate de tener la interfaz Component

const ComponentManagement = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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

  const handleCreateOrUpdateComponent = async (component: Component) => {
    const method = selectedComponent ? 'PUT' : 'POST';
    const url = selectedComponent ? `/api/projects/components/${selectedComponent.id}` : `/api/projects/components`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(component),
      });

      if (response.ok) {
        const updatedComponent = await response.json();
        if (method === 'POST') {
          setComponents((prev) => [...prev, updatedComponent]);
        } else {
          setComponents((prev) =>
            prev.map((c) => (c.id === updatedComponent.id ? updatedComponent : c))
          );
        }
        setAlertMessage('Componente guardado exitosamente');
      } else {
        setAlertMessage('Error al guardar el componente');
      }
    } catch (error) {
      console.error('Error saving component:', error);
      setAlertMessage('Error al guardar el componente');
    } finally {
      setShowAlert(true);
      setShowModal(false);
      setSelectedComponent(null);
    }
  };

  const handleDeleteComponent = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/components?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComponents((prev) => prev.filter((component) => component.id !== id));
        setAlertMessage('Componente eliminado exitosamente');
      } else {
        setAlertMessage('Error al eliminar el componente');
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      setAlertMessage('Error al eliminar el componente');
    } finally {
      setShowAlert(true);
      setShowDeleteModal(false);
    }
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
    <div>
      <h1>Gestión de Componentes</h1>
      <button onClick={() => setShowModal(true)}>Agregar Componente</button>
      <DataTable
        columns={columns}
        data={components}
        pagination
      />
      {showModal && (
        <ModalComponent
          component={selectedComponent}
          onClose={() => setShowModal(false)}
          onSave={handleCreateOrUpdateComponent}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteComponent
          item={selectedComponent}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => selectedComponent && handleDeleteComponent(selectedComponent.id)}
        />
      )}
      {showAlert && (
        <AlertComponent message={alertMessage} onClose={() => setShowAlert(false)} />
      )}
    </div>
  );
};

export default ComponentManagement;

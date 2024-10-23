import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ModalComponent from '@/components/Modal';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert';
import { Project } from '@/model/projects.props'; // Asegúrate de tener la interfaz Project

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'warning'>('success'); 

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSaveProject = async (project: Project) => {
    try {
      const method = selectedProject ? 'PUT' : 'POST';
      const response = await fetch('/api/projects/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error al guardar el rol:', errorResponse);
        setAlertMessage('Error al guardar el rol');
        setAlertType('error');
        setShowAlert(true);
        return;
      }

      const updatedProject = await response.json();
      setProjects((prevProject) => {
        if (project.id) {
          return prevProject.map((r) => (r.id === updatedProject.id ? updatedRole : r));
        } else {
          return [...prevProject, updatedProject]; 
        }
      });

      setShowModal(false);
      setAlertMessage('Proyecto guardado exitosamente');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error en la operación');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const response = await fetch(`/api/projects/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        setAlertMessage('Proyecto eliminado exitosamente');
      } else {
        setAlertMessage('Error al eliminar el proyecto');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setAlertMessage('Error al eliminar el proyecto');
    } finally {
      setShowAlert(true);
      setShowDeleteModal(false);
    }
  };

  const columns = [
    { name: 'ID', selector: (row: Project) => row.id, sortable: true },
    { name: 'Nombre', selector: (row: Project) => row.name, sortable: true },
    { name: 'Descripción', selector: (row: Project) => row.description },
    {
        name: 'Acciones',
        cell: (row: Project) => (
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
              onClick={() => handleEditProject(row)}
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
  
  const handleShowDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteRole = async () => {
    if (projectToDelete) {
      await handleDeleteProject(projectToDelete.id);
    }
    setShowDeleteModal(false); 
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  // Función para manejar la creación de un nuevo rol
  const handleCreateProject = () => {
    setSelectedProject(undefined); // Cambiado de null a undefined
    setShowModal(true);
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
    <div>
      <h1>Gestión de Proyectos</h1>
      <button onClick={() => setShowModal(true)}>Agregar Proyecto</button>
      <DataTable
        columns={columns}
        data={projects}
        pagination
      />
      {showModal && (
        <ModalComponent
          show={showModal}
          title={selectedProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          closeModal={handleCloseModal}
        />
      )}
      {showDeleteModal && (
        <ModalDeleteComponent
          show={showDeleteModal}
          title="Confirmar Eliminación"
          closeModal={handleCloseDeleteModal}
          onConfirm={handleConfirmDeleteRole}
          />
      )}
      {showAlert && (
        <AlertComponent 
        show={showAlert}
        type={alertType}
        message={alertMessage} 
        onClose={setShowAlert} />
      )}
    </div>
  );
};

export default ProjectManagement;

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import ModalComponent from '@/components/Modal';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import AlertComponent from '@/components/Alert';
import { Project } from '@/model/projects.props'; 
import ProjectForm from './projectForm';

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
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
          'Content-Type': 'application/json',},
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error al guardar el proyecto:', errorResponse);
        setAlertMessage('Error al guardar el proyecto');
        setAlertType('error');
        setShowAlert(true);
        return;
      }

      const updatedProject = await response.json();
      setProjects((prevProject) => {
        if (project.id) {
          return prevProject.map((r) => (r.id === updatedProject.id ? updatedProject : r));
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
      if (!response.ok) {
        throw new Error('Error al eliminar el rol');
      }

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        setAlertMessage('Proyecto eliminado exitosamente');
        setAlertType('warning');
        setShowAlert(true);
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

  const handleCreateProject = () => {
    setSelectedProject(undefined); 
    setShowModal(true);
  };
  
 const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  
  const columns = [
    { name: 'ID', selector: (row: Project) => row.id, sortable: true },
    { name: 'Nombre', selector: (row: Project) => row.name, sortable: true },
    { name: 'Descripción', selector: (row: Project) => row.description },
    {
      name: 'Componente', // Columna para mostrar los usuarios asignados
      selector: (row: Project) => (
          row.component ? row.component.name : 'Sin asignar'
      ),
    },
    {
        name: 'Acciones',
        cell: (row: Project) => (
          <div>
            <button
              className="bg-blue-500 text-white font-bold px-4 py-1 rounded mr-2"
              onClick={() => handleEditProject(row)}
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
      <h1 className='text-2xl font-bold mb-4'>Gestión de Proyectos</h1>
      <button 
        onClick={handleCreateProject}
        className="mt-4 mb-8 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
        >
          Agregar Proyecto
        </button>

        <ModalComponent
          show={showModal}
          title={selectedProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          closeModal={handleCloseModal}
        >
          <ProjectForm
            onSave={handleSaveProject}
            initialData={selectedProject}
          />
        </ModalComponent>

        <ModalDeleteComponent
        show={showDeleteModal}
        title="Confirmar Eliminación"
        closeModal={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteRole}
      >
        <p>¿Estás seguro de que deseas eliminar el rol {projectToDelete?.name}?</p>
      </ModalDeleteComponent>

      <DataTable
      className='card bg-gray-100 p-4 shadow-lg rounded'
        columns={columns}
        data={Array.isArray(projects) ? projects : []}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay proyectos disponibles"
      />
        <AlertComponent 
        show={showAlert}
        type={alertType}
        message={alertMessage} 
        onClose={setShowAlert} />
    </div>
  );
};

export default ProjectManagement;

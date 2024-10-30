// pages/reports/Page.tsx
import React, { useState, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import TechnicalSummaryTable from '../Tables/TechnicalSummaryTable'
import DeliverableTable from '../Tables/DeliverablesTable';
import AnnexesTable from '../Tables/AnnexesTable';
import TechnicalForm from '../Forms/TechnicalForm';
import DeliverableForm from '../Forms/DeliverableForm';
import AnnexForm from '../Forms/AnnexForm';
import ModalComponent from '@/components/Modal';
import styles from "./report_list.module.css";
import { AnnexData, DeliverableData, FormData, TechnicalSummaryData } from '@/model/reports.props';
import AlertComponent from '@/components/Alert';
import SummaryAlert from '@/components/AlertSummary';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import { Project } from '@/model/projects.props';

const Page = () => {
  const { data: session, status } = useSession();
  const [technicalSummary, setTechnicalSummary] = useState<TechnicalSummaryData[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableData[]>([]);
  const [annexes, setAnnexes] = useState<AnnexData[]>([]);
  const [reports, setReports] = useState<FormData[]>([]);
  const [filteredReports, setFilteredReports] = useState<FormData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<FormData | null>(null);
  const [selectedReportTechnical, setSelectedReportTechnical] = useState<TechnicalSummaryData | null>(null);
  const [selectedReportDeliverable, setSelectedReportDeliverable] = useState<DeliverableData | null>(null);
  const [selectedReportAnnex, setSelectedReportAnnex] = useState<AnnexData | null>(null);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [showSummaryAlert, setShowSummaryAlert] = useState(false);
  const [summaryAlertMessage, setSummaryAlertMessage] = useState(''); 
  const [alertMessage, setAlertMessage] = useState('');
  const [showModalTechnical, setShowModalTechnical] = useState(false);
  const [showModalDeliverable, setShowModalDeliverable] = useState(false);
  const [showModalAnnex, setShowModalAnnex] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(selectedReport?.summary || '');
  const [isCreatingNewReport, setIsCreatingNewReport] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [refresh, setRefresh] = useState(0);  
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const fetchData = async () => {
    const fetchPromises = [
      fetch('/api/reports/reports'),
      fetch('/api/reports/technical-summary'),
      fetch('/api/reports/deliverables'),
      fetch('/api/reports/annexes'),
      fetch('/api/projects/projects')
    ];
  
    try {
      const responses = await Promise.all(fetchPromises);
      const data = await Promise.all(responses.map(res => {
        if (!res.ok) throw new Error('Error en la respuesta');
        return res.json();
      }));
  
      setReports(data[0]);
      setTechnicalSummary(data[1]);
      setDeliverables(data[2]);
      setAnnexes(data[3]);
      setProjects(data[4])
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setAlertMessage('Error al obtener los datos');
      setAlertType('error');
      setShowAlert(true);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);  

  useEffect(() => {
    if (selectedReport) {
      setSummaryText(selectedReport.summary || '');
    } else {
      setSelectedReportTechnical(null);
      setSelectedReportDeliverable(null);
      setSelectedReportAnnex(null);
      setSummaryText('');
    }
  }, [selectedReport, technicalSummary, deliverables, annexes]);
  
 //resumen
 const handleEditClick = () => {
  if (isEditing && selectedReport) {
    if (!summaryText) {
      setAlertMessage('El resumen no puede estar vacío.');
      setShowAlert(true);
      return;
    }

    const updatedReport = { ...selectedReport, summary: summaryText };
    updateReportSummary(updatedReport);
    const updatedReports = reports.map(report =>
      report.id === selectedReport.id ? updatedReport : report
    );

    setReports(updatedReports);
    setSelectedReport(updatedReport);
    setFilteredReports(updatedReports);
  } else {
    setSummaryAlertMessage('Deslizar hacia abajo si el texto del resumen es muy grande o no se aprecia completamente');
    setShowSummaryAlert(true);
  }

  setIsEditing(!isEditing);
};

const updateReportSummary = async (updatedReport: FormData) => {
  try {
    const response = await fetch(`/api/reports/reports`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: updatedReport.id,
        summary: updatedReport.summary,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el resumen del informe');
    }

    const data = await response.json();
    console.log('Resumen actualizado:', data);

    // Muestra un mensaje de éxito
    setAlertMessage('El resumen ha sido actualizado con éxito');
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al actualizar el resumen');
    setAlertType('error');
    setShowAlert(true);
  }
};

//select
const handleCheckboxChange = (reportId: number) => {
  if (selectedReportId === reportId) {
    setSelectedReportId(null); 
    setSelectedReport(null);
  } else {
    setSelectedReportId(reportId); 
    const report = reports.find(report => report.id === reportId);
    setSelectedReport(report || null);
  }
};

  // Modales
  const handleOpenModal = (type: 'technical' | 'deliverable' | 'annex') => {
    switch (type) {
      case 'technical':
        if (selectedReport?.id) {
        setShowModalTechnical(true);
      } else {
        console.error('No se puede abrir el formulario: No se ha seleccionado un reporte válido.');
      }
        break;
      case 'deliverable':
        if (selectedReport?.id) {
          setShowModalDeliverable(true);
        } else {
          console.error('No se puede abrir el formulario: No se ha seleccionado un reporte válido.');
        }
        break;
      case 'annex':
        if (selectedReport?.id) {
        setShowModalAnnex(true);
      } else {
        console.error('No se puede abrir el formulario: No se ha seleccionado un reporte válido.');
      }
        break;
      default:
        break;
    }
};

const handleButtonClick = (type: 'technical' | 'deliverable' | 'annex') => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    handleOpenModal(type);
};
  
  const handleCloseModal = () => {
    setShowModalTechnical(false);
    setShowModalDeliverable(false);
    setShowModalAnnex(false);
    setSelectedReportAnnex(null);
  };

  const handleDeleteClick = (id: number, type: string) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true); 
  };
  
  const confirmDelete = async () => {
    if (itemToDelete) { 
      const { id, type } = itemToDelete;
      
      try {
        if (type === 'annex') {
          await handleDeleteAnnex(id);
        } else if (type === 'deliverable') {
          await handleDeleteDeliverable(id);
        }else if (type === 'report') {
          await handleDeleteReport(id);
        } else if (type === 'activity') {
          await handleDeleteTechnicalSummary(id); 
        }
  
        setShowDeleteModal(false); 
        setItemToDelete(null); 
        setAlertMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} eliminado con éxito`);
        setAlertType('success');
        setShowAlert(true);
      } catch (error) {
        console.error('Error:', error);
        setAlertMessage(`Error al eliminar ${type}`);
        setAlertType('error');
        setShowAlert(true);
      }
    }
  };
    
//Crear
const handleCreateReport = async () => {

  if (!session || !session.user) {
    console.error("Usuario no autenticado");
    return; 
  }
  const formData = {
    summary: "",
    project_id: selectedProjectId,
    user_id: parseInt(session?.user.id),
    status: 0,
  };

  console.log("Form data enviado:", formData);
  try {
    const response = await fetch('/api/reports/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    console.log('Informe creado:', data);

    setReports((prevReports) => [...prevReports, data]);
    setFilteredReports((prevReports) => [...prevReports, data]);
    setSelectedReport(data);

    setAlertMessage('Informe creado con éxito');
    setAlertType('success');
    setShowAlert(true);
    setIsCreatingNewReport(false);

  } catch (error: unknown) { 
    console.error('Error', error);
    let errorMessage = 'Error al crear el informe';

    if (error instanceof Error) {
      errorMessage = error.message; 
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    setAlertMessage('Error al crear el informe ' + errorMessage);
    setAlertType('error');
    setShowAlert(true);
  }
};

const handleCreateTechnicalSummary = async (technical: TechnicalSummaryData) => {
  console.log('Datos a enviar:', technical); 
  const { report_id, id, obtained_result, product_description, support_annex, observations } = technical;

  try {
    const method = id ? 'PUT' : 'POST';
    const response = await fetch('/api/reports/technical-summary', {
    method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        report_id: report_id, 
        obtained_result,
        product_description,
        support_annex: support_annex || '',
        observations: observations || '',
      }), 
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al crear el Sinopsis técnica:', errorResponse);
      throw new Error('Error al crear el Sinopsis técnica');
    }

    const data = await response.json();
    console.log('Sinopsis técnica creado:', data);
    if (id) {
      setTechnicalSummary((prevTechnicalSummaries) =>
        prevTechnicalSummaries.map((summary) => (summary.id === id ? data : summary))
      );
      setAlertMessage('Sinopsis técnica actualizado con éxito');
    } else {
      setTechnicalSummary((prevTechnicalSummaries) => [...prevTechnicalSummaries, data]);
      setAlertMessage('Sinopsis técnica creado con éxito');
    }
    setRefresh((prev) => prev + 1);
    setShowModalTechnical(false)
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el Sinopsis técnica');
    setAlertType('warning');
    setShowAlert(true);
  }
};
  
const handleCreateDeliverable = async (deliverables: DeliverableData) => {
  console.log('Datos a enviar:', deliverables); 
  const { report_id, id, description, date, approved_changes, contingency_plan } = deliverables;

  try {
    const method = id ? 'PUT' : 'POST';
    const response = await fetch('/api/reports/deliverables', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        report_id: report_id,
        description,
        date,
        approved_changes,
        contingency_plan,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al crear el entregable:', errorResponse);
      throw new Error('Error al crear el entregable');
    }

    const data = await response.json();
    console.log('Entregable creado:', data);
    if (id) {
      setDeliverables((prevDeliverables) =>
        prevDeliverables.map((deliverable) => (deliverable.id === id ? data : deliverable))
      );
      setAlertMessage('Entregable actualizado con éxito');
    } else {
      setDeliverables((prevDeliverables) => [...prevDeliverables, data]);
      setAlertMessage('Entregable creado con éxito');
    }
    setRefresh((prev) => prev + 1);
    setShowModalDeliverable(false)
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el entregable');
    setAlertType('warning');
    setShowAlert(true);
  }
};  

const handleCreateAnnex = async (annexes: AnnexData) => {
  console.log('Datos a enviar:', annexes);
  const { report_id, id, description, url } = annexes;

  if (!description || !url) {
    setAlertMessage('La descripción y la URL son necesarias para crear un anexo.');
    setAlertType('error');
    setShowAlert(true);
    return;
  }

  try {
    const method = id ? 'PUT' : 'POST'; // Usar POST para nuevos anexos, PUT para actualizarlos
    const response = await fetch('/api/reports/annexes', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        report_id: report_id,
        description,
        url,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al crear el anexo:', errorResponse);
      throw new Error('Error al crear el anexo');
    }

    const data = await response.json();
    console.log('Anexo creado:', data);
    if (id) {
      setAnnexes((prevAnnexes) =>
        prevAnnexes.map((annex) => (annex.id === id ? data : annex))
      );
      setAlertMessage('Anexo actualizado con éxito');
    } else {
      setAnnexes((prevAnnexes) => [...prevAnnexes, data]);
      setAlertMessage('Anexo creado con éxito');
    }
    setRefresh((prev) => prev + 1);
    setShowModalAnnex(false)
    setAlertType('success');
    setShowAlert(true);
    handleRowDeselected(); 
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el anexo');
    setAlertType('warning');
    setShowAlert(true);
  }
};

const handleDeleteTechnicalSummary = async (id: number) => {
  try {
    const response = await fetch(`/api/reports/technical-summary?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar la Sinopsis técnica');

    setTechnicalSummary(prev => prev.filter(summary => summary.id !== id));
    setAlertMessage('Sinopsis técnica eliminada con éxito');
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al eliminar la sinopsis técnica');
    setAlertType('error');
    setShowAlert(true);
  }
};

const handleDeleteDeliverable = async (id: number) => {
  try {
    const response = await fetch(`/api/reports/deliverables?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el entregable');

    setDeliverables(prev => prev.filter(deliverables => deliverables.id !== id));
    setAlertMessage('Entregable eliminado con éxito');
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al eliminar el entregable');
    setAlertType('error');
    setShowAlert(true);
  }
};

const handleDeleteAnnex = async (id: number) => {
  try {
    const response = await fetch(`/api/reports/annexes?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el anexo');

    setAnnexes(prev => prev.filter(annexes => annexes.id !== id));
    setAlertMessage('Anexo eliminado con éxito');
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al eliminar el Anexo');
    setAlertType('error');
    setShowAlert(true);
  }
};

const handleDeleteReport = async (id: number) => {
  if (!selectedReport) return;

  try {
    const response = await fetch(`/api/reports/reports?id=${selectedReport.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== selectedReport.id)
      );
      setAlertMessage('Informe eliminado con éxito');
      setSelectedReport(null); 
    } else {
      setAlertMessage('Error al eliminar el informe');
    }

    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error al eliminar el informe:', error);
    setAlertMessage('Hubo un error al eliminar el informe');
    setAlertType('warning');
    setShowAlert(true);
  }
};

const reportSelection = selectedReport?.id ? { id: selectedReport.id } : null;

  //Selecionar fila
  const handleTechnicalRowSelected = (technical: TechnicalSummaryData) => {
    setSelectedReportTechnical(technical);
  };

  const handleDeliverableRowSelected = (deliverable: DeliverableData) => {
    setSelectedReportDeliverable(deliverable);
  };
  
  const handleAnnexRowSelected = (annexes: AnnexData) => {
    setSelectedReportAnnex(annexes);
  };

  const handleRowDeselected = () => {
    setSelectedReportTechnical(null);
    setSelectedReportDeliverable(null);
    setSelectedReportAnnex(null);
  };

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = reports.filter(
      (item) =>
        item.project.name.toLowerCase().includes(lowerCaseQuery) ||
        item.user.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredReports(filteredData);
  };

  return (
    <div className={styles.report_listContainer}>
      <div className={`${styles.header} flex justify-center items-center flex-col card bg-gray-100 p-4 shadow-lg rounded mb-4`}>
      <div className='mt-4'>
        <div className="mb-4 ml-10 card bg-white p-4 shadow-lg rounded mb-4">
          <p className='text-xs'>Antes de crear un informe, por favor selecciona el proyecto al que pertenece</p>
          <label htmlFor="project"><strong>Seleccionar Proyecto</strong></label>
          <select
            id="project"
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
            className="select w-full mt-2"
          >
            <option value="" disabled>Seleccione un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className={`${styles.ReportAction} flex flex-row items-center mb-4 card bg-white p-4 shadow-lg rounded`}>
          <div className={`dropdown ${isEditing ? 'disabled' : ''}`}>
            <div 
              tabIndex={0} 
              role="button" 
              className={`btn m-1 ${isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={() => {
                if (isEditing) return;
              }}
            >
              {selectedReport ? `Informe: ${selectedReport.id}` : 'Seleccionar Informe'}
            </div>

            <ul 
              tabIndex={0} 
              className={`dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow ${isEditing ? 'hidden' : ''}`}
            >
              {reports.map((report) => (
                <li key={report.id}>
                <label className="cursor-pointer flex items-center">
                <input
                  type="checkbox"
                  defaultChecked 
                  className="checkbox checkbox-success checkbox-lg"
                  checked={selectedReportId === report.id}
                  onChange={() => {
                    if (report.id !== undefined) {
                      handleCheckboxChange(report.id); 
                    }
                  }}                
                />
                <span className="ml-2">{report.id}</span>
                </label>
              </li>
              ))}
            </ul>
          </div>

          <div className='mt-4'>
            <button 
              onClick={() => {
                if (selectedReport) {
                  setSelectedReport(null);
                }
                setIsEditing(true);
                setSummaryText(''); 
                handleCreateReport();
              }} 
              className={`bg-green-500 hover:bg-green-700 px-4 py-2 rounded text-white ${isEditing || !selectedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isEditing || !selectedProjectId} 
            >
              Crear nuevo informe
            </button>
            {selectedReport && (
              <>
                <button
                  onClick={() => handleDeleteClick(selectedReport.id!, 'report')}
                  className={`ml-4 bg-red-500 hover:bg-red-700 px-4 py-2 rounded text-white ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isEditing} 
                >
                  Eliminar informe
                </button>
                <button
                  className={`ml-4 bg-yellow-500 hover:bg-yellow-700 px-4 py-2 rounded text-white ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isEditing}
                  onClick={() => {
                    const url = `http://localhost:3000/informes/reports/reports/reports?report=${encodeURIComponent(JSON.stringify(selectedReport))}`;
                    window.open(url, '_blank'); 
                  }}
                >
                  Generar informe
                </button>
              </>
            )}
        </div>
        </div>
      </div>
      </div>
          {(selectedReport || isCreatingNewReport) && (
      <div className='body'>
        <div className={`${styles.summary} flex justify-center items-center flex-col card bg-gray-100 p-4 shadow-lg rounded mb-4`}>
          <div className='flex flex-col card bg-white p-4 shadow-lg rounded mb-4'>
            <label htmlFor="summary"><strong>Resumen</strong></label>
            <div className='flex flex-row'>
              {isEditing ? (
            <>
            <textarea
              value={summaryText || ''}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder='Escribe el resumen del informe aquí'
              className="textarea w-[76em] mt-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            ></textarea>
            </>
              ) : (
                <p className="w-full break-words">{selectedReport?.summary || 'No hay resumen disponible'}</p>
              )}
              <div className='flex flex-col border-l border-gray-400 m-4'>
              <button
                onClick={handleEditClick}
                className="h-20 w-16 mt-4 px-5 py-1 ml-4 text-white rounded transition-transform transform hover:scale-105"
              >
              {isEditing ? (
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="5"
                  height="1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 16v-3h.375a.626.626 0 0 1 .625.626v1.749a.626.626 0 0 1-.626.625H6Zm6-2.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-1 0v-2Z"/>
                  <path fillRule="evenodd" d="M11 7V2h7a2 2 0 0 1 2 2v5h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h6a2 2 0 0 0 2-2Zm7.683 6.006 1.335-.024-.037-2-1.327.024a2.647 2.647 0 0 0-2.636 2.647v1.706a2.647 2.647 0 0 0 2.647 2.647H20v-2h-1.335a.647.647 0 0 1-.647-.647v-1.706a.647.647 0 0 1 .647-.647h.018ZM5 11a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 9 15.375v-1.75A2.626 2.626 0 0 0 6.375 11H5Zm7.5 0a2.5 2.5 0 0 0-2.5 2.5v2a2.5 2.5 0 0 0 5 0v-2a2.5 2.5 0 0 0-2.5-2.5Z" clipRule="evenodd"/>
                  <path d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Z"/>
                </svg>
                ) : (
                <svg
                  className="w-12 h-12 text-gray-800 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="1"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
                </svg>
                )}              
                </button>
                {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false); 
                    setSummaryText(selectedReport?.summary || '');
                  }}
                  className="h-16 w-16 items-alight-center mt-4 px-5 py-1 ml-4 bg-red-700 text-white rounded hover:bg-red-800 transition-transform transform hover:scale-105"
                >
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                  </svg>
                </button>
                )}
              </div>
            </div>
          </div>
          <SummaryAlert 
              showAlert={showSummaryAlert} 
              alertMessage={summaryAlertMessage} 
              onClose={() => setShowSummaryAlert(false)} 
            />
        </div>
        <div className='m-16 border-b border-gray-400'></div>

        <div className={`${styles.table} flex justify-center flex-col card bg-gray-100 p-4 shadow-lg rounded mb-4`}>
        <div className='technical card bg-gray-100 p-4 shadow-lg rounded mb-4'>
        <div className='flex flex-row'>
          <TechnicalSummaryTable
            technical={technicalSummary.filter(tech => tech.report_id === selectedReport?.id)}
            onActivityRowSelected={handleTechnicalRowSelected}
            onRowDeselected={handleRowDeselected}
            onSearch={handleSearch}
            key={refresh}
          />
          <div className="flex flex-col border-l border-gray-400 m-4 ml-8 mt-16">
            <button
              onClick={handleButtonClick('technical')}
              className={`${styles.createButton} h-16 w-16 mt-4 ml-4 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-700 shadow-lg transition-transform transform hover:scale-105`}
              >
            {selectedReportTechnical ? (
            
             <svg
             className="w-12 h-12 text-gray-800 dark:text-white"
             xmlns="http://www.w3.org/2000/svg"
             width="10"
             height="1"
             fill="none"
             viewBox="0 0 24 24"
           >
           <path
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
           />
           </svg>
            ) : (
            <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
              )}
            </button>
            {selectedReportTechnical && (
            <button
              onClick={() => handleDeleteClick(selectedReportTechnical.id!, 'activity')}
              className={`${styles.deleteButton} h-16 w-16 mt-4 px-2 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700 transition-transform transform hover:scale-105`}
            >
              <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>            
            </button>
            )}
            <ModalComponent
              show={showModalTechnical}
              title={selectedReportTechnical ? 'Editar Actividad Técnica' : 'Crear Actividad Técnica'}
              closeModal={handleCloseModal}
            >
            <TechnicalForm
              handleCreateTechnicalSummary={handleCreateTechnicalSummary}
              initialData={selectedReportTechnical || undefined}
              handleClose={handleCloseModal}
              selectedReport={reportSelection}
              />
            </ModalComponent>
          </div>
        </div>
        </div>

        <div className='m-16 border-b border-gray-400'></div>
        <div className='deliverables card bg-gray-100 p-4 shadow-lg rounded mb-4'>
        <div className='flex flex-row'>
        <DeliverableTable
              deliverables={deliverables.filter(del => del.report_id === selectedReport?.id)}
              onRowSelected={handleDeliverableRowSelected}
              onRowDeselected={handleRowDeselected}
              onSearch={handleSearch}
              key={refresh}
            />
          <div className="flex flex-col border-l border-gray-400 m-4 ml-8 mt-16">
            <button
              onClick={handleButtonClick('deliverable')}
              className={`${styles.createButton} h-16 w-16 mt-4 ml-4 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-700 shadow-lg transition-transform transform hover:scale-105`}
              >
            {selectedReportDeliverable ? (
            
             <svg
             className="w-12 h-12 text-gray-800 dark:text-white"
             xmlns="http://www.w3.org/2000/svg"
             width="10"
             height="1"
             fill="none"
             viewBox="0 0 24 24"
           >
           <path
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
           />
           </svg>
            ) : (
            <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
              )}
            </button>
            {selectedReportDeliverable && (
            <button
              onClick={() => handleDeleteClick(selectedReportDeliverable.id!, 'activity')}
              className={`${styles.deleteButton} h-16 w-16 mt-4 px-2 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700 transition-transform transform hover:scale-105`}
            >
              <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>            
            </button>
            )}
          <ModalComponent
              show={showModalDeliverable}
              title={selectedReportDeliverable ? 'Editar Entregable' : 'Crear Nuevo Entregable'}
              closeModal={handleCloseModal}
            >
            <DeliverableForm
              handleCreateDeliverable={handleCreateDeliverable}
              initialData={selectedReportDeliverable || undefined}
              handleClose={handleCloseModal}
              selectedReport={reportSelection}
            />
            </ModalComponent>
          </div>
        </div>
    
        </div>
        <div className='m-16 border-b border-gray-400'></div>
        <div className='annexes card bg-gray-100 p-4 shadow-lg rounded mb-4'>
        <div className='flex flex-row'>
        <AnnexesTable
              annexes={annexes.filter(ann => ann.report_id === selectedReport?.id)}
              onRowSelected={handleAnnexRowSelected}
              onRowDeselected={handleRowDeselected}
              onSearch={handleSearch}
              key={refresh}
            />
            <div className="flex flex-col border-l border-gray-400 m-4 ml-8 mt-16">
            <button
              onClick={handleButtonClick('annex')}
              className={`${styles.createButton} h-16 w-16 mt-4 ml-4 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-700 shadow-lg transition-transform transform hover:scale-105`}
              >
            {selectedReportAnnex ? (
            
             <svg
             className="w-12 h-12 text-gray-800 dark:text-white"
             xmlns="http://www.w3.org/2000/svg"
             width="10"
             height="1"
             fill="none"
             viewBox="0 0 24 24"
           >
           <path
             stroke="currentColor"
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeWidth="2"
             d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
           />
           </svg>
            ) : (
            <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
              )}
            </button>
            {selectedReportAnnex && (
            <button
              onClick={() => handleDeleteClick(selectedReportAnnex.id!, 'activity')}
              className={`${styles.deleteButton} h-16 w-16 mt-4 px-2 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700 transition-transform transform hover:scale-105`}
            >
              <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>            
            </button>
            )}
            <ModalComponent
              show={showModalAnnex}
              title={selectedReportAnnex ? 'Editar Anexo' : 'Crear Nuevo Anexo'}
              closeModal={handleCloseModal}
            >
            <AnnexForm
              handleCreateAnnex={handleCreateAnnex}
              initialData={selectedReportAnnex || undefined}
              handleClose={handleCloseModal}
              selectedReport={reportSelection}
            />
            </ModalComponent>
          </div>
        </div>
            
           
        </div>

        {showDeleteModal && (
          <ModalDeleteComponent
            show={true}
            title="Confirmar eliminación"
            closeModal={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          >
            <p>
              ¿Estás seguro de que deseas eliminar {itemToDelete?.type === 'annex' ? 'este anexo' : itemToDelete?.type === 'deliverable' ? 'este entregable': itemToDelete?.type === 'activity' ? 'esta actividad' : 'este informe'}?
            </p>
          </ModalDeleteComponent>
        )}
      </div>
      </div>
    )}
    <AlertComponent
      show={showAlert}
      type={alertType}
      message={alertMessage}
      onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default Page;
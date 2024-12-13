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
import { AnnexData, DeliverableData, ReportData, TechnicalSummaryData } from '@/model/reports.props';
import AlertComponent from '@/components/Alert';
import SummaryAlert from '@/components/AlertSummary';
import ModalDeleteComponent from '@/components/ModalEliminacion';
import { Project } from '@/model/projects.props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCirclePlus, faFloppyDisk, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const Page = () => {
  const { data: session, status } = useSession();
  const [technicalSummary, setTechnicalSummary] = useState<TechnicalSummaryData[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableData[]>([]);
  const [annexes, setAnnexes] = useState<AnnexData[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [selectedReportTechnical, setSelectedReportTechnical] = useState<TechnicalSummaryData | null>(null);
  const [selectedReportDeliverable, setSelectedReportDeliverable] = useState<DeliverableData | null>(null);
  const [selectedReportAnnex, setSelectedReportAnnex] = useState<AnnexData | null>(null);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSummaryAlert, setShowSummaryAlert] = useState(false);
  const [summaryAlertMessage, setSummaryAlertMessage] = useState(''); 
  const [activeModal, setActiveModal] = useState<'technical' | 'deliverable' | 'annex' | null>(null);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setAlertMessage(`Error al obtener los datos: ${errorMessage}`);
      console.error('Error al obtener los datos:', error);
      setAlertType('error');
      setShowAlert(true);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [refresh]);  

  useEffect(() => {
    if (selectedReport) {
      setSummaryText(selectedReport.summary || '');
    } else {
      setSelectedReportTechnical(null);
      setSelectedReportDeliverable(null);
      setSelectedReportAnnex(null);
      setSummaryText('');
    }
  }, [selectedReport]);

  useEffect(() => {
    console.log('selectedReportId cambió:', selectedReportId);
  }, [selectedReportId]); // Este useEffect se ejecutará cada vez que `selectedReportId` cambie
  
 //resumen
 const handleEditClick = () => {
  if (isEditing && selectedReport) {
    if (!summaryText) {
      setAlertMessage('El resumen no puede estar vacío.');
      setShowAlert(true);
      return;
    }

    const updatedReport = { ...selectedReport, summary: summaryText };
    updateReportSummary(updatedReport); // Llamada con argumento
    const updatedReports = reports.map(report =>
      report.id === selectedReport.id ? updatedReport : report
    );

    setReports(updatedReports);
    setSelectedReport(updatedReport);
  } else {
    setSummaryAlertMessage('Deslizar hacia abajo si el texto del resumen es muy grande o no se aprecia completamente');
    setShowSummaryAlert(true);
  }

  setIsEditing(!isEditing);
};

const updateReportSummary = async (updatedReport: ReportData) => {
  if (!updatedReport || !updatedReport.summary) {
    setAlertMessage('El resumen no puede estar vacío.');
    setAlertType('error');
    setShowAlert(true);
    return;
  }

  const data = {
    id: updatedReport.id,
    summary: updatedReport.summary,
    updated_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(`/api/reports/reports`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), // Solo enviar id, summary y updated_at
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Detalles del error:', errorDetails);
      throw new Error('Error al actualizar el resumen del informe');
    }

    // Actualiza el estado con los datos actualizados (solo el resumen)
    const updatedReports = reports.map(report =>
      report.id === updatedReport.id ? { ...report, summary: updatedReport.summary, updated_at: data.updated_at } : report
    );

    setReports(updatedReports);
    setSelectedReport(updatedReport);

    setAlertMessage('Resumen actualizado con éxito');
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
  if (selectedReport?.id === reportId) {
    setSelectedReport(null);
    setSelectedReportId(null);
  } else {
    const report = reports.find(report => report.id === reportId);
    setSelectedReport(report || null);
    setSelectedReportId(report?.id || null);
  }
};


// Modales
const handleOpenModal = (type: 'technical' | 'deliverable' | 'annex') => {
  if (!selectedReport?.id) {
    console.error('No se ha seleccionado un reporte válido.');
    return;
  }
  setActiveModal(type);
};

const handleButtonClick = (type: 'technical' | 'deliverable' | 'annex') => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    handleOpenModal(type);
};
  
const handleCloseModal = () => setActiveModal(null);

  const handleDeleteClick = (id: number, type: string) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true); 
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete) return;
  
    const deleteHandlers = {
      annex: handleDeleteAnnex,
      deliverable: handleDeleteDeliverable,
      report: handleDeleteReport,
      activity: handleDeleteTechnicalSummary,
    };
  
    try {
      await deleteHandlers[itemToDelete.type](itemToDelete.id);
      setAlertMessage(`${itemToDelete.type} eliminado con éxito`);
      setAlertType('success');
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage(`Error al eliminar ${itemToDelete.type}`);
      setAlertType('error');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
      setShowAlert(true);
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
    user_id: parseInt(session.user.id),
    status: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/reports/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const newReport = await response.json();
    console.log('Informe creado:', newReport);

    // Agregar el nuevo informe a la lista
    setReports((prevReports) => {
      const updatedReports = [...prevReports, newReport];
      console.log('Reports actualizados:', updatedReports);
      return updatedReports;
    });
    setSelectedReport(newReport);
    setSelectedReportId(newReport.report.id); 
    console.log('newreport', newReport)
    console.log('selectedReportId después de crear:', newReport.report.id); // Verifica que se actualiza

    // Mostrar alerta de éxito
    setAlertMessage('Informe creado con éxito');
    setAlertType('success');
    setShowAlert(true);

    setIsCreatingNewReport(false);
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    setAlertMessage(`Error al crear el informe: ${errorMessage}`);
    setAlertType('error');
    setShowAlert(true);
  }
};

const updateReportModifiedDate = async (reportId: number) => {
  try {
    const response = await fetch(`/api/reports/reports`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: reportId }), // Agrega el report_id en el cuerpo
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al actualizar la fecha de modificación del reporte:', errorResponse);
      throw new Error('Error al actualizar la fecha de modificación');
    }
    console.log('Fecha de modificación del reporte actualizada');
  } catch (error) {
    console.error('Error al actualizar la fecha:', error);
  }
};

const handleCreateTechnicalSummary = async (technical: TechnicalSummaryData) => {
  console.log('Datos a enviar:', technical); 
  const { report_id, id, name_technical, obtained_result, product_description, support_annex_id, observations } = technical;

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
        name_technical, 
        obtained_result,
        product_description,
        support_annex_id: support_annex_id || '',
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
      setTechnicalSummary((prevTechnicalSummaries) => {
        const updatedSummaries = prevTechnicalSummaries.map((summary) =>
          summary.id === id ? { ...summary, ...data, support_annex: data.support_annex } : summary
        );
        return updatedSummaries;
      });
      await fetchData();
      setAlertMessage('Sinopsis técnica actualizado con éxito');
    } else {
      setTechnicalSummary((prevTechnicalSummaries) => [...prevTechnicalSummaries, data]);
      setAlertMessage('Sinopsis técnica creado con éxito');
      await fetchData();
    }
    if (isNaN(report_id)) {
      console.error('El report_id no es válido');
      throw new Error('El report_id no es válido');
    }
    await updateReportModifiedDate(report_id);
    setRefresh((prev) => prev + 1);
    handleCloseModal()
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el Sinopsis técnica');
    setAlertType('warning');
    setShowAlert(true);
  }
};
  
const handleCreateDeliverable = async (formData: FormData) => {
  try {
    const method = formData.get('id') ? 'PUT' : 'POST';
    console.log('Datos enviados:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    const response = await fetch('/api/reports/deliverables', {
      method,
      body: formData,
      });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al crear el entregable:', errorResponse);
      throw new Error('Error al crear el entregable');
    }

    const data = await response.json();
    console.log('Entregable creado:', data);
    if (formData.has('id')) {
      setDeliverables((prevDeliverables) =>
        prevDeliverables.map((deliverable) => (deliverable.id === data.id ? data : deliverable))
      );
      setAlertMessage('Entregable actualizado con éxito');
    } else {
      setDeliverables((prevDeliverables) => [...prevDeliverables, data]);
      setAlertMessage('Entregable creado con éxito');
    }
    const reportId = Number(formData.get('report_id'));
    if (isNaN(reportId)) {
      console.error('El report_id no es válido');
      throw new Error('El report_id no es válido');
    }
    await updateReportModifiedDate(reportId);
    
    setRefresh((prev) => prev + 1);
    handleCloseModal()
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el entregable');
    setAlertType('warning');
    setShowAlert(true);
  }
};  

const handleCreateAnnex = async (formData: FormData) => {
  try {
    const method = formData.get('id') ? 'PUT' : 'POST';
    console.log('Datos enviados:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
      console.log('Usando método:', method);
    });    
    const response = await fetch('/api/reports/annexes', {
      method,
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al crear el anexo:', errorResponse);
      throw new Error('Error al crear el anexo');
    }

    const data = await response.json();
    console.log('Anexo creado:', data);
    if (formData.has('id')) {
      setAnnexes((prevAnnexes) =>
        prevAnnexes.map((annex) => (annex.id === data.id ? data : annex))
      );
      setAlertMessage('Anexo actualizado con éxito');
    } else {
      setAnnexes((prevAnnexes) => [...prevAnnexes, data]);
      setAlertMessage('Anexo creado con éxito');
    }
    const reportId = Number(formData.get('report_id'));
    if (isNaN(reportId)) {
      console.error('El report_id no es válido');
      throw new Error('El report_id no es válido');
    }
    await updateReportModifiedDate(reportId);
    setRefresh((prev) => prev + 1);
    handleCloseModal()
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

//Eliminar
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
    handleRowDeselected();
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
    handleRowDeselected();
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
    handleRowDeselected();
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
                    sessionStorage.setItem('selectedReport', JSON.stringify(selectedReport));
                    window.open('/informes/reports/reports/reports', '_blank');
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
                className={`h-12 w-12 mt-4 ml-4 rounded text-black p-2 border border-gray-400 rounded transition-transform transform hover:scale-105 flex items-center justify-center`}
                >
              {isEditing ? (
                <FontAwesomeIcon icon={faFloppyDisk} size="2x"/>
              ) : (
                <FontAwesomeIcon icon={faPenToSquare} size="2x"/>
              )}            
              </button>
              {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false); 
                  setSummaryText(selectedReport?.summary || '');
                }}
                className="h-12 w-12 items-alight-center mt-4 px-2 py-1 ml-4 bg-red-700 text-white rounded hover:bg-red-800 transition-transform transform hover:scale-105"
              >
                <FontAwesomeIcon icon={faBan} size='2x'/>           
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
            key={refresh}
          />
          <div className="flex flex-col border-l border-gray-400 m-4 ml-8 mt-16">
          <button
              onClick={handleButtonClick('technical')}
              className={`h-12 w-12 mt-4 ml-4 bg-green text-green-400 rounded text-black transition-transform transform hover:scale-105 flex items-center justify-center`}
            >
              {selectedReportTechnical ? (
                <FontAwesomeIcon icon={faPenToSquare} size="2x" className="p-2 border border-gray-400 rounded" />
              ) : (
                <FontAwesomeIcon icon={faCirclePlus} size="3x" />
              )}
            </button>
            {selectedReportTechnical && (
            <button
              onClick={() => handleDeleteClick(selectedReportTechnical.id!, 'activity')}
              className={`h-12 w-12 mt-4 px-2 py-2 ml-4 bg-red-700 text-white rounded hover:bg-red-700 transition-transform transform hover:scale-105`}
            >
              <FontAwesomeIcon icon={faTrash} size='2x'/>
              </button>
            )}
            <ModalComponent
              show={activeModal === 'technical'}
              title={selectedReportTechnical ? 'Editar Actividad Técnica' : 'Crear Actividad Técnica'}
              closeModal={handleCloseModal}
            >
              
            <TechnicalForm
              handleCreateTechnicalSummary={handleCreateTechnicalSummary}
              initialData={selectedReportTechnical || undefined}
              handleClose={handleCloseModal}
              selectedReport={reportSelection}
              annexes={annexes}
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
              key={refresh}
            />
          <div className="flex flex-col border-l border-gray-400 m-4 ml-8 mt-16">
          <button
              onClick={handleButtonClick('deliverable')}
              className={`${styles.createButton} h-12 w-12 mt-4 ml-4 bg-green text-green-400 rounded text-black transition-transform transform hover:scale-105 flex items-center justify-center`}
            >
              {selectedReportDeliverable ? (
                <FontAwesomeIcon icon={faPenToSquare} size="2x" className="p-2 border border-gray-400 rounded" />
              ) : (
                <FontAwesomeIcon icon={faCirclePlus} size="3x" />
              )}
            </button>
            {selectedReportDeliverable && (
            <button
              onClick={() => handleDeleteClick(selectedReportDeliverable.id!, 'deliverable')}
              className={`${styles.deleteButton} h-12 w-12 mt-4 px-2 py-2 ml-4 bg-red-700 text-white rounded hover:bg-red-700 transition-transform transform hover:scale-105`}
            >
              <FontAwesomeIcon icon={faTrash} size='2x'/>
              </button>
            )}
          <ModalComponent
              show={activeModal === 'deliverable'}
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
              key={refresh}
            />
            <div className="flex flex-col border-l border-gray-400 m-4 ml-8 mt-16">
            <button
              onClick={handleButtonClick('annex')}
              className={`${styles.createButton} h-12 w-12 mt-4 ml-4 bg-green text-green-400 rounded text-black transition-transform transform hover:scale-105 flex items-center justify-center`}
            >
              {selectedReportAnnex ? (
                <FontAwesomeIcon icon={faPenToSquare} size="2x" className="p-2 border border-gray-400 rounded" />
              ) : (
                <FontAwesomeIcon icon={faCirclePlus} size="3x" />
              )}
            </button>
            {selectedReportAnnex && (
            <button
              onClick={() => handleDeleteClick(selectedReportAnnex.id!, 'annex')}
              className={`${styles.deleteButton} h-12 w-12 mt-4 px-2 py-2 ml-4 bg-red-700 text-white rounded hover:bg-red-700 transition-transform transform hover:scale-105`}
            >
              <FontAwesomeIcon icon={faTrash} size='2x'/>
            </button>
            )}
            <ModalComponent
              show={activeModal === 'annex'}
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
              ¿Estás seguro de que deseas eliminar {itemToDelete?.type === 'annex' ? 'este anexo' : itemToDelete?.type === 'deliverable' ? 'este entregable': itemToDelete?.type === 'activity' ? 'esta sinopsis técnica' : 'este informe'}?
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
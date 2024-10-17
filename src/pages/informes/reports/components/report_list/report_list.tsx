// pages/reports/Page.tsx
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import TechnicalSummaryTable from '../Tables/TechnicalSummaryTable'
import DeliverableTable from '../Tables/DeliverablesTable';
import AnnexesTable from '../Tables/AnnexesTable';
import TechnicalForm from '../Forms/TechnicalForm';
import DeliverableForm from '../Forms/DeliverableForm';
import AnnexForm from '../Forms/AnnexForm';
import ModalComponent from '@/components/Modal';
import styles from "./report_list.module.css";
import { AnnexData, DeliverableData, FormData, TechnicalSummaryData } from '../../../../../model/reports.props';
import AlertComponent from '@/components/Alert';
import SummaryAlert from '@/components/AlertSummary';
import ModalDeleteComponent from '@/components/ModalEliminacion';

const Page = () => {
  const [technicalSummary, setTechnicalSummary] = useState<TechnicalSummaryData[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableData[]>([]);
  const [annexes, setAnnexes] = useState<AnnexData[]>([]);
  const [reports, setReports] = useState<FormData[]>([]);
  const [filteredReports, setFilteredReports] = useState<FormData[]>([]);
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
      fetch('/api/reports'),
      fetch('/api/technical-summary'),
      fetch('/api/deliverables'),
      fetch('/api/annexes'),
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
    const response = await fetch(`/api/reports`, {
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
  const formData = {
    summary: "Resumen del informe",
    project_id: 1,  // ID del proyecto que deseas usar
    user_id: 1002324366,     // ID del usuario que deseas usar
    status: 0,      // Estado inicial, por ejemplo
  };

  console.log("Form data enviado:", formData);

  try {
    
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Error al crear el nuevo informe');
    }

    const data = await response.json();
    console.log('Informe creado:', data);

    // Agregar el nuevo informe al estado
    setReports((prevReports) => [...prevReports, data]);
    setFilteredReports((prevReports) => [...prevReports, data]);
    setSelectedReportId(data.id); 
    setSelectedReport(data);
    setSummaryText(data.summary || '');

    // Muestra un mensaje de éxito
    setAlertMessage('Informe creado con éxito');
    setAlertType('success');
    setShowAlert(true);
    setIsCreatingNewReport(false);

  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear el informe');
    setAlertType('error');
    setShowAlert(true);
  }
};

const handleCreateTechnicalSummary = async (technical: TechnicalSummaryData) => {
  console.log('Datos a enviar:', technical); 
  const { report_id, id, obtained_result, product_description, support_annex, observations } = technical;

  try {
    const method = id ? 'PUT' : 'POST';
    const response = await fetch('/api/technical-summary', {
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
      console.error('Error al crear el resumen técnico:', errorResponse);
      throw new Error('Error al crear el resumen técnico');
    }

    const data = await response.json();
    console.log('Resumen técnico creado:', data);
    if (id) {
      setTechnicalSummary((prevTechnicalSummaries) =>
        prevTechnicalSummaries.map((summary) => (summary.id === id ? data : summary))
      );
      setAlertMessage('Resumen técnico actualizado con éxito');
    } else {
      setTechnicalSummary((prevTechnicalSummaries) => [...prevTechnicalSummaries, data]);
      setAlertMessage('Resumen técnico creado con éxito');
    }
    setRefresh((prev) => prev + 1);
    setShowModalTechnical(false)
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el resumen técnico');
    setAlertType('warning');
    setShowAlert(true);
  }
};
  
const handleCreateDeliverable = async (deliverables: DeliverableData) => {
  console.log('Datos a enviar:', deliverables); 
  const { report_id, id, description, date, approved_changes, contingency_plan } = deliverables;

  try {
    const method = id ? 'PUT' : 'POST';
    const response = await fetch('/api/deliverables', {
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

  // Asegúrate de que solo se llame a esta función cuando realmente se desee crear un nuevo anexo.
  if (!description || !url) {
    setAlertMessage('La descripción y la URL son necesarias para crear un anexo.');
    setAlertType('error');
    setShowAlert(true);
    return;
  }

  try {
    const method = id ? 'PUT' : 'POST'; // Usar POST para nuevos anexos, PUT para actualizarlos
    const response = await fetch('/api/annexes', {
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
    const response = await fetch(`/api/technical-summary?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el resumen técnico');

    setTechnicalSummary(prev => prev.filter(summary => summary.id !== id));
    setAlertMessage('Resumen técnico eliminado con éxito');
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al eliminar el resumen técnico');
    setAlertType('error');
    setShowAlert(true);
  }
};

const handleDeleteDeliverable = async (id: number) => {
  try {
    const response = await fetch(`/api/deliverables?id=${id}`, {
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
    const response = await fetch(`/api/annexes?id=${id}`, {
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
    const response = await fetch(`/api/reports?id=${selectedReport.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== selectedReport.id)
      );
      setAlertMessage('Informe eliminado con éxito');
      setSelectedReport(null);  // Desseleccionar el informe
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


const technicalInitialData = selectedReportTechnical || {
  report_id: selectedReport?.id || 0,
  obtained_result: '',
  product_description: '',
  support_annex: '',
  observations: ''
};
const deliverableInitialData = selectedReportDeliverable || {
  report_id: selectedReport?.id || 0, 
  description: '',
  date: '',
  approved_changes: '',
  contingency_plan: ''
};
const annexInitialData = selectedReportAnnex || {
  report_id: selectedReport?.id || 0,
  description: '',
  url: ''
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
      <div className={styles.header}>
      <div className={`${styles.ReportAction} flex justify-between items-center mb-4`}>
        <div className={`dropdown ${isEditing ? 'disabled' : ''}`}>
          <div 
            tabIndex={0} 
            role="button" 
            className={`btn m-1 ${isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={isEditing ? undefined : undefined} // Agregar lógica aquí si quieres prevenir la acción de clic
          >
            {selectedReport ? `Informe: ${selectedReport.id} - ${selectedReport.project ? selectedReport.project.name : ''}` : 'Seleccionar Informe'}
          </div>

          <ul 
            tabIndex={0} 
            className={`dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow ${isEditing ? 'hidden' : ''}`}
          >
            {reports.map((report) => (
            <li key={report.id}>
              <label className="cursor-pointer flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-success w-6 h-6"
                checked={selectedReportId === report.id}
                onChange={() => {
                  if (report.id !== undefined) {
                    handleCheckboxChange(report.id); 
                  }
                }}                
              />
              <span className="ml-2">{report.id} - {report.project ? report.project.name : ''}</span>
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
              handleCreateReport();
            }} 
            className={`bg-green-500 hover:bg-green-700 px-4 py-2 rounded text-white ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isEditing} // Deshabilitar el botón de crear
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
                const url = `http://localhost:3000/informes/reports/components/reports/reports?report=${encodeURIComponent(JSON.stringify(selectedReport))}`;
                window.open(url, '_blank'); // Abre en una nueva pestaña
              }}
            >
              Generar informe
            </button>
            </>
          )}
        </div>
      </div>
      </div>
          {(selectedReport || isCreatingNewReport) && (
          <div className='body'>
          <div className={styles.summary}>
          <div className='mb-4'>
            <label htmlFor="summary"><strong>Resumen</strong></label>
            <button
              onClick={handleEditClick}
              className="mt-4 px-4 py-2 ml-4 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Guardar' : 'Editar Resumen'}
            </button>
            {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false); 
                setSummaryText(selectedReport?.summary || '');
              }}
              className="mt-4 px-4 py-2 ml-1 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Cancelar
            </button>
            )}
          </div>

          {isEditing ? (
            <>
            <textarea
              value={summaryText || ''}
              onChange={(e) => setSummaryText(e.target.value)}
              className="textarea w-full mt-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            ></textarea>
            <SummaryAlert 
              showAlert={showSummaryAlert} 
              alertMessage={summaryAlertMessage} 
              onClose={() => setShowSummaryAlert(false)} 
            />
            </>
          ) : (
            <p className="w-full break-words">{selectedReport?.summary || 'No hay resumen disponible'}</p>
          )}
        </div>

        <div className={styles.table}>
        <div className='technical'>
          <div className={styles.SwitchButton}>
            <button
              onClick={handleButtonClick('technical')}
              className={`${styles.createButton} mt-4 px-4 py-2 ml-16 bg-blue-500 text-white rounded hover:bg-blue-700`}
            >
            {selectedReportTechnical ? 'Editar Actividad' : 'Crear Nueva Actividad'}
            </button>
            {selectedReportTechnical && (
            <button
              onClick={() => handleDeleteClick(selectedReportTechnical.id!, 'activity')}
              className={`${styles.deleteButton} mt-4 px-4 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700`}
            >
              Eliminar Actividad
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
          <TechnicalSummaryTable
            technical={technicalSummary.filter(tech => tech.report_id === selectedReport?.id)}
            onActivityRowSelected={handleTechnicalRowSelected}
            onRowDeselected={handleRowDeselected}
            onSearch={handleSearch}
            key={refresh}
          />
        </div>

        <div className='deliverables'>
          <div className={styles.SwitchButton}>
            <button
              onClick={handleButtonClick('deliverable')}
              className={`${styles.createButton} mt-4 px-4 py-2 ml-16 bg-blue-500 text-white rounded hover:bg-blue-700`}
            >
              {selectedReportDeliverable ? 'Editar Entregable' : 'Crear Nuevo Entregable'}
            </button>
            {selectedReportDeliverable && (
            <button
              onClick={() => handleDeleteClick(selectedReportDeliverable.id!, 'deliverable')}
              className={`${styles.deleteButton} mt-4 px-4 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700`}
            >
              Eliminar Entregable
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
            <DeliverableTable
              deliverables={deliverables.filter(del => del.report_id === selectedReport?.id)}
              onRowSelected={handleDeliverableRowSelected}
              onRowDeselected={handleRowDeselected}
              onSearch={handleSearch}
              key={refresh}
            />
        </div>

        <div className='annexes'>
          <div className={styles.SwitchButton}>
            <button
              onClick={handleButtonClick('annex')}
              className={`${styles.createButton} mt-4 px-4 py-2 ml-16 bg-blue-500 text-white rounded hover:bg-blue-700`}
            >
            {selectedReportAnnex ? 'Editar Anexo' : 'Crear Nuevo Anexo'}
            </button>
            {selectedReportAnnex && (
            <button
              onClick={() => handleDeleteClick(selectedReportAnnex.id!, 'annex')}
              className={`${styles.deleteButton} mt-4 px-4 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700`}
            >
              Eliminar Anexo
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
            <AnnexesTable
              annexes={annexes.filter(ann => ann.report_id === selectedReport?.id)}
              onRowSelected={handleAnnexRowSelected}
              onRowDeselected={handleRowDeselected}
              onSearch={handleSearch}
              key={refresh}
            />
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
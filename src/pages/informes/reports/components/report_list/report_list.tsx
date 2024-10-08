// pages/reports/Page.tsx

import React, { useState, useEffect } from 'react';
import TechnicalSummaryTable from '../Tables/TechnicalSummaryTable'
import DeliverableTable from '../Tables/DeliverablesTable';
import AnnexesTable from '../Tables/AnnexesTable';
import TechnicalForm from '../Forms/TechnicalForm';
import DeliverableForm from '../Forms/DeliverableForm';
import AnnexForm from '../Forms/AnnexForm';
import ModalComponent from '@/components/Modal';
import styles from "./report_list.module.css";
import { AnnexData, DeliverableData, FormData, TechnicalSummaryData } from '../../model/reports.props';
import AlertComponent from '@/components/Alert';
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
  const [alertMessage, setAlertMessage] = useState('');
  const [showModalTechnical, setShowModalTechnical] = useState(false);
  const [showModalDeliverable, setShowModalDeliverable] = useState(false);
  const [showModalAnnex, setShowModalAnnex] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(selectedReport?.summary || '');
  const [isCreatingNewReport, setIsCreatingNewReport] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  

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
const handleDropdownSelect = (reportId: number) => {
  if (!isEditing) {
    const report = reports.find(report => report.id === reportId);
    setSelectedReport(report || null);
    setSummaryText(report?.summary || '');
    setSelectedReportTechnical(null);
    setSelectedReportDeliverable(null);
    setSelectedReportAnnex(null);
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
    event.preventDefault(); // Prevenir comportamiento por defecto si es necesario
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
    setShowDeleteModal(true); // Muestra el modal de confirmación
  };
  
  const confirmDelete = async () => {
    if (itemToDelete) { // Verifica que itemToDelete no sea null
      const { id, type } = itemToDelete;
      
      try {
        if (type === 'annex') {
          await handleDeleteAnnex(id); // Llama a la función para eliminar el anexo
        } else if (type === 'deliverable') {
          await handleDeleteDeliverable(id); // Llama a la función para eliminar el entregable
        } else if (type === 'activity') {
          await handleDeleteTechnicalSummary(id); // Llama a la función para eliminar la actividad
        }
  
        setShowDeleteModal(false); // Cierra el modal después de la eliminación
        setItemToDelete(null); // Resetea el estado
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
    user_id: 1,     // ID del usuario que deseas usar
    status: 0,      // Estado inicial, por ejemplo
  };

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
    setAlertType('success');
    setShowAlert(true);
  } catch (error) {
    console.error('Error:', error);
    setAlertMessage('Error al crear/actualizar el entregableo');
    setAlertType('warning');
    setShowAlert(true);
  }
};  

const handleCreateAnnex = async (annexes: AnnexData) => {
  debugger;
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
    setAlertType('success');
    setShowAlert(true);
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
  console.log('ID del anexo a eliminar:', id);

  try {
    debugger;
    const response = await fetch(`/api/annexes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al eliminar el anexo:', errorResponse);
      throw new Error('Error al eliminar el anexo');
    }

    console.log('Anexo eliminado correctamente');
    // Actualiza el estado para eliminar el anexo en el frontend
    setAnnexes(prevAnnexes => prevAnnexes.filter(annex => annex.id !== id));
  } catch (error) {
    console.error('Error en la eliminación:', error);
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
        <div className={`${styles.ReportAction}`}>
          <div className="flex justify-between items-center mb-4">
          <select onChange={(e) => handleDropdownSelect(Number(e.target.value))}>
            <option value="">Seleccionar Informe</option>
            {reports.map(report => (
              <option key={report.id} value={report.id}>
                  {report.id} - {report.project ? report.project.name : ''}
                  </option>       
                 ))}
          </select>
          </div>
          <div className='mt-4 px-4 py-2 ml-4 bg-green-500 text-white rounded hover:bg-green-700'>
            <button onClick={handleCreateReport}>Crear nuevo informe</button>
          </div>
        </div>
      </div>
      {(selectedReport || isCreatingNewReport) && (
        <div>
      <div className={styles.summary}>
        <div className='mb-4'>
          <label htmlFor="summary"><strong>Resumen</strong></label>
          <button
            onClick={handleEditClick}
            className={`${styles.SummaryButton} mt-4 px-4 py-2 ml-4 bg-blue-500 text-white rounded hover:bg-blue-700`}
          >
            {isEditing ? 'Guardar' : 'Editar Resumen'}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false); 
                setSummaryText(selectedReport?.summary || '');
              }}
              className={`${styles.SummaryButton} mt-4 px-4 py-2 ml-1 bg-red-700 text-white rounded hover:bg-red-800`}
            >
              Cancelar
            </button>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={summaryText || ''}
            onChange={(e) => setSummaryText(e.target.value)}
            style={{ width: '800px' }}
            className="mt-2 px-2 py-1 border rounded"
          ></textarea>
        ) : (
          <p>{selectedReport?.summary !== undefined && selectedReport?.summary !== null ? selectedReport.summary : 'No hay resumen disponible'}</p>
        )}
      </div>
      <div className={styles.table}>
        <div>
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
            initialData={technicalInitialData}
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
        />
        </div>
        <div>
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
                initialData={deliverableInitialData}
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
          />
        </div>
        <div>
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
                {showDeleteModal && (
                  <ModalDeleteComponent
                    show={true}
                    title="Confirmar eliminación"
                    closeModal={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                  >
                    <p>
                      ¿Estás seguro de que deseas eliminar esta {itemToDelete?.type === 'annex' ? 'anexo' : itemToDelete?.type === 'deliverable' ? 'entregable' : 'actividad'}?
                    </p>
                  </ModalDeleteComponent>
                )}
            <ModalComponent
              show={showModalAnnex}
              title={selectedReportAnnex ? 'Editar Anexo' : 'Crear Nuevo Anexo'}
              closeModal={handleCloseModal}
            >
              <AnnexForm
                handleCreateAnnex={handleCreateAnnex}
                initialData={annexInitialData}
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
          />
        </div>
      </div>
      </div>)}
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
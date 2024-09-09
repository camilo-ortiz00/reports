// pages/reports/Page.tsx

import React, { useState, useEffect } from 'react';
import ReportListTable from "./report_listTable";
import ReportForm from "./report_form";
import ModalComponent from '@/components/Modal';
import styles from "./report_list.module.css";
import { FormData } from '../../model/reports.props';
import AlertComponent from '@/components/Alert';

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState<FormData[]>([]);
  const [filteredReports, setFilteredReports] = useState<FormData[]>([]);
  const [selectedReport, setSelectedReport] = useState<FormData | null>(null);
  const [projectName, setProjectName] = useState('');
  const [researcherName, setResearcherName] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('Error al obtener los informes');
        }
        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    setFilteredReports(reports);
  }, [reports]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  
  const handleCreateReport = async (formData: FormData) => {
    console.log('Datos enviados:', formData);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Respuesta de error:', errorResponse);
        throw new Error('Error al crear el informe');
      }
  
      const data = await response.json();
      console.log('Informe creado:', data);
  
      if (selectedReport) {
        const updatedReports = reports.map(report => (report.id === data.id ? data : report));
        setReports(updatedReports);
        setFilteredReports(updatedReports);
      } else {
        const newReports = [...reports, data];
        setReports(newReports);
        setFilteredReports(newReports);
      }
  
      // Mostrar mensaje de éxito en la alerta
      setAlertMessage('El informe se ha creado/actualizado con éxito');
      setAlertType('success'); // Asignar el tipo correcto
      setShowAlert(true);
      setProjectName(formData.project_name);
      setResearcherName(formData.researcher_name);
      handleCloseModal();
    } catch (error) {
      // Mostrar mensaje de error en la alerta
      setAlertMessage('Hubo un error al crear/actualizar el informe');
      setAlertType('warning'); // Asignar el tipo correcto
      setShowAlert(true);
    }
  };
  

  const handleDeleteReport = async () => {
    if (selectedReport) {
      try {
        const response = await fetch(`/api/reports?id=${selectedReport.id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Error al eliminar el informe');
        }
  
        // Eliminar el informe del estado local
        const updatedReports = reports.filter(report => report.id !== selectedReport.id);
        setReports(updatedReports);
        setFilteredReports(updatedReports);
        setSelectedReport(null);
  
        // Mostrar mensaje de éxito en la alerta
        setAlertMessage('El informe se ha eliminado con éxito');
        setAlertType('info'); // Asignar el tipo correcto
        setShowAlert(true);
      } catch (error) {
        // Mostrar mensaje de error en la alerta
        setAlertMessage('Hubo un error al eliminar el informe');
        setAlertType('error'); // Asignar el tipo correcto
        setShowAlert(true);
      }
    }
  };
  

  const handleRowSelected = (report: FormData) => {
    setSelectedReport(report);
    setProjectName(report.project_name);
    setResearcherName(report.researcher_name);
  };

  const handleRowDeselected = () => {
    setSelectedReport(null);
  };

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = reports.filter(
      (item) =>
        item.project_name.toLowerCase().includes(lowerCaseQuery) ||
        item.researcher_name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredReports(filteredData);
  };

  return (
    <div className={styles.report_listContainer}>
      <AlertComponent
        show={showAlert}
        type={alertType}
        message={alertMessage}
        onClose={setShowAlert}
      />
      <div className={styles.header}>
        <div className={styles.user_name}>
          <h1>{researcherName || 'Nombre del investigador'}</h1>
        </div>
        <div className={styles.project_name}>
          <h1>{projectName || 'Nombre del proyecto'}</h1>
        </div>
      </div>
      <div className={`${styles.SwitchButton}`}>
        <button
          onClick={handleOpenModal}
          className={`${styles.createButton} mt-4 px-4 py-2 ml-16 bg-blue-500 text-white rounded hover:bg-blue-700`}
        >
          {selectedReport ? 'Editar Informe' : 'Crear Nuevo Informe'}
        </button>
        {selectedReport && (
          <button
            onClick={handleDeleteReport}
            className={`${styles.deleteButton} mt-4 px-4 py-2 ml-4 bg-red-500 text-white rounded hover:bg-red-700`}
          >
            Eliminar Informe
          </button>
        )}
      </div>
      <ModalComponent show={showModal} title={selectedReport ? 'Editar Informe' : 'Crear Nuevo Informe'} closeModal={handleCloseModal}>
        <ReportForm onSubmit={handleCreateReport} initialData={selectedReport || undefined} handleClose={handleCloseModal} />
      </ModalComponent>
      <div className={styles.table}>
        <ReportListTable reports={filteredReports} onRowSelected={handleRowSelected} onRowDeselected={handleRowDeselected} onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default Page;

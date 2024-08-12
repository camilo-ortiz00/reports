// pages/reports/Page.tsx

import React, { useState, useEffect } from 'react';
import ReportListTable from "./report_listTable";
import ReportForm from "./report_form";
import ModalComponent from '@/components/Modal';
import styles from "./report_list.module.css";
import { FormData } from '../../model/reports.props';

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [reports, setReports] = useState<FormData[]>([]);
  const [filteredReports, setFilteredReports] = useState<FormData[]>([]);
  const [selectedReport, setSelectedReport] = useState<FormData | null>(null);
  const [projectName, setProjectName] = useState('');
  const [researcherName, setResearcherName] = useState('');

  useEffect(() => {
    setFilteredReports(reports);
  }, [reports]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleCreateReport = (formData: FormData) => {
    if (selectedReport) {
      const updatedReports = reports.map(report => (report === selectedReport ? formData : report));
      setReports(updatedReports);
      setFilteredReports(updatedReports);
    } else {
      const newReports = [...reports, formData];
      setReports(newReports);
      setFilteredReports(newReports);
    }
    setProjectName(formData.project_name);
    setResearcherName(formData.researcher_name);
    handleCloseModal();
  };

  const handleDeleteReport = () => {
    if (selectedReport) {
      const updatedReports = reports.filter(report => report !== selectedReport);
      setReports(updatedReports);
      setFilteredReports(updatedReports);
      setSelectedReport(null);
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
      <div className={styles.header}>
        <div className={styles.user_name}>
          <h1>{researcherName || 'Nombre del investigador'}</h1>
        </div>
        <div className={styles.project_name}>
          <h1>{projectName || 'Nombre del proyecto'}</h1>
        </div>
      </div>
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

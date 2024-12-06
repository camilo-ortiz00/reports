import React, { FC, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ReportTrackingProps, ReportTracking } from '@/model/reports.props';
import ModalComponent from '@/components/Modal';
import AlertComponent from '@/components/Alert';
import TrackingForm from './TrackingForm';

const ReportTrackingComponent: FC<ReportTrackingProps> = () => {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [newNote, setNewNote] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info' | 'warning'>('success');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [trackingData, setTrackingData] = useState<ReportTracking[]>([]);
  const [trackingId, setTrackingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrackings = async () => {
      try {
        const response = await fetch('/api/reports/tracking');
        if (response.ok) {
          const data = await response.json();
          setTrackingData(data); // Cargar los datos en el estado
        } else {
          console.error('Error al cargar los trackings:', response.statusText);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
      }
    };
  
    fetchTrackings();
  }, []);
  

  const handleClose = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleSaveTracking = async (data: { report_id: number; note: string; tracking_id: number }) => {
    console.log('Form Data:', data); // Verifica los valores antes de enviarlos

    try {
      const response = await fetch(`/api/reports/tracking?id=${data.tracking_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.tracking_id,
          report_id: data.report_id,
          note: data.note,
        }),
      });
  
      if (!response.ok) throw new Error('Error al actualizar la nota');
      const updatedTracking = await response.json();
      setTrackingData((prev) =>
        prev.map((track) => (track.id === updatedTracking.id ? updatedTracking : track))
      );
      setAlertMessage('Nota actualizada con éxito');
      setAlertType('success');
      setShowAlert(true);
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error(error);
      setAlertMessage('Error al actualizar la nota');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const getStatusColor = (status: number) => {
    if (status < 50) return 'bg-red-500'; // Menor que 50, rojo
    if (status === 50) return 'bg-orange-500'; // Igual a 50, naranja
    if (status < 80) return 'bg-yellow-500'; // Menor que 80, amarillo
    if (status === 100) return 'bg-green-500'; // Igual a 100, verde
    return 'bg-gray-400'; // Por defecto, gris
  };

  const columns: TableColumn<ReportTracking>[] = [
    {
      name: 'ID Reporte',
      selector: (row) => row.report_id,
      sortable: true,
    },
    {
      name: 'Usuario',
      selector: (row) => row.report?.user?.name || 'Desconocido',
      sortable: true,
    },
    {
      name: 'Creación',
      selector: (row) =>
        row.report?.created_at ? new Date(row.report.created_at).toLocaleString() : 'Sin fecha',
      sortable: true,
    },
    {
      name: 'Última modificación',
      selector: (row) =>
        row.report?.updated_at ? new Date(row.report.updated_at).toLocaleString() : 'Sin fecha',
      sortable: true,
    },    
    {
    name: 'Estado',
    cell: (row) => (
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 rounded-full ${getStatusColor(row.report?.status || 0)}`} />
        <span>{Math.round(row.report?.status || 0)}%</span>
      </div>
    ),
    sortable: true,
    },
    {
      name: 'Nota',
      selector: (row) => row.note,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedReportId(row.report_id);
            setNewNote(row.note || '');
            setTrackingId(row.id);  // Set the tracking ID here
            setIsModalOpen(true);
          }}
          className="btn btn-sm btn-success"
        >
          Editar Nota
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="card bg-gray-100 p-4 shadow-lg rounded text-2xl font-semibold mb-4">Seguimiento del Reporte</h2>
      <DataTable
      className='card bg-gray-100 p-4 shadow-lg rounded'
        columns={columns}
        data={trackingData}
        pagination
        highlightOnHover
        striped
        responsive
      />

      <ModalComponent
        show={isModalOpen}
        title="Agregar Seguimiento"
        closeModal={handleClose}
      >
        <TrackingForm
          selectedReportId={selectedReportId}
          onSubmit={handleSaveTracking}
          handleClose={handleClose}
          newNote={newNote}
          trackingId={trackingId}
        />
      </ModalComponent>

      <AlertComponent
        type={alertType}
        message={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

export default ReportTrackingComponent;

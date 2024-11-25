import React from 'react';
import DataTable from 'react-data-table-component';
import { DeliverableData } from '@/model/reports.props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface DeliverableTableProps {
   deliverables: DeliverableData[];
  onRowSelected: (deliverables: DeliverableData) => void;
  onRowDeselected: () => void;
}
const DeliverableTable: React.FC<DeliverableTableProps > = ({ deliverables, onRowSelected, onRowDeselected }) => {
  const columns = [
    {
      name: 'N°',
      selector: (row: DeliverableData) => row?.id || 'N/A',
      width: '5em',
      sortable: true,
    },
    {
      name: 'Entregable',
      selector: (row: DeliverableData) => row?.description || 'N/A',
      sortable: true,
    },
    {
      name: 'Fecha de ejecución',
      selector: (row: DeliverableData) => row?.date || 'N/A',
      sortable: true,
    },
    {
      name: 'URL del anexo',
      cell: (row: DeliverableData) => (
        <div className="flex items-center space-x-2">
          <span
            className="text-gray-600 cursor-pointer hover:underline"
            onClick={() => handleDownload(row.id)} 
          >
            {row?.support_name || 'N/A'}
          </span>
          <FontAwesomeIcon
            icon={faDownload}
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => handleDownload(row.id)} 
          />
        </div>
      ),
      sortable: true,
    },
    {
      name: 'Cambios aprobados por supervisor',
      selector: (row: DeliverableData) => row?.approved_changes || 'N/A',
      sortable: true,
    },
    {
      name: 'Plan de contingencia',
      selector: (row: DeliverableData) => row?.contingency_plan || 'N/A',
      sortable: true,
    },
    {
      name: '% Avance Mes',
      selector: (row: DeliverableData) => row?.percent_month || 'N/A',
      sortable: true,
    },
    {
      name: '% Avance Acumulado',
      selector: (row: DeliverableData) => row?.percent_cumulative || 'N/A',
      sortable: true,
    },
  ];

  const handleDownload = async (deliverableId: number) => {
    try {
      const response = await fetch(`/api/reports/downloadFile?deliverableId=${deliverableId}`);
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const fileBlob = await response.blob();
      const fileUrl = URL.createObjectURL(fileBlob);

      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'archivo';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error('Error al intentar descargar el archivo:', error);
    }
  };

  const handleRowSelected = (state: any) => {
    if (state.selectedRows.length > 0) {
      onRowSelected(state.selectedRows[0]);
    } else {
      onRowDeselected();
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-xl font-semibold mb-4 card p-4 bg-white shadow-lg rounded">CRONOGRAMA EJECUCIÓN ENTREGABLES </h2>
      <DataTable
        columns={columns}
        data={deliverables}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        customStyles={{
          rows: {
            style: {
              backgroundColor: 'white', // Cambia el color de fondo de las filas
            },
          },
          headCells: {
            style: {
              backgroundColor: '#f3f4f6', // Cambia el color del encabezado
              color: '#374151',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </div>
  );
};

export default DeliverableTable;

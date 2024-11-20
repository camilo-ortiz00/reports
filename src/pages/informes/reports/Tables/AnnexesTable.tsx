import React from 'react';
import DataTable from 'react-data-table-component';
import { AnnexData } from '@/model/reports.props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface AnnexesFormProps {
  annexes: AnnexData[];
  onRowSelected: (report: AnnexData) => void;
  onRowDeselected: () => void;
}

const AnnexesTable: React.FC<AnnexesFormProps> = ({ annexes, onRowSelected, onRowDeselected }) => {
  const columns = [
    {
      name: 'N°',
      selector: (row: AnnexData) => row?.id || 'N/A',
      width: '5em',
      sortable: true,
    },
    {
      name: 'Descripción del anexo',
      selector: (row: AnnexData) => row?.description || 'N/A',
      sortable: true,
      width: '30em',
    },
    {
      name: 'URL del anexo',
      cell: (row: AnnexData) => (
        <div className="flex items-center space-x-2">
          <span
            className="text-gray-600 cursor-pointer hover:underline"
            onClick={() => handleDownload(row.id)} 
          >
            {row?.file_name || 'N/A'}
          </span>
          <FontAwesomeIcon
            icon={faDownload}
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => handleDownload(row.id)} // Pasa el ID del anexo para descargar el archivo
          />
        </div>
      ),
      sortable: true,
      width: '20em', // Puedes ajustar el ancho si lo deseas
    }
  ];

  const handleDownload = async (annexId: number) => {
    try {
      const response = await fetch(`/api/reports/downloadFile?annexId=${annexId}`);
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const fileBlob = await response.blob();
      const fileUrl = URL.createObjectURL(fileBlob);

      // Obtener el nombre original del archivo desde los encabezados (si se aplica)
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
      <h2 className="text-xl font-semibold mb-4 card p-4 bg-white shadow-lg rounded">ANEXOS</h2>
      <DataTable
        columns={columns}
        data={annexes}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={handleRowSelected}
      />
    </div>
  );
};

export default AnnexesTable;

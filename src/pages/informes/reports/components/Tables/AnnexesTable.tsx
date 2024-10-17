import React from 'react';
import DataTable from 'react-data-table-component';
import { AnnexData } from '../../../../../model/reports.props';

interface AnnexesFormProps {
  annexes: AnnexData[];
  onRowSelected: (report: AnnexData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}

const annexesesTable: React.FC<AnnexesFormProps> = ({ annexes, onRowSelected, onRowDeselected, onSearch  }) => {
  const columns = [
    {
      name: 'N°',
      selector: (row: AnnexData) => row?.id || 'N/A',
      sortable: true,
    },
    {
      name: 'Descripción del anexo',
      selector: (row: AnnexData) => row?.description || 'N/A',
      sortable: true,
    },
    {
      name: 'URL del anexo',
      selector: (row: AnnexData) => row?.url || 'N/A',
      sortable: true,
    },
  ];

  const handleRowSelected = (state: any) => {
    if (state.selectedRows.length > 0) {
      onRowSelected(state.selectedRows[0]);
    } else {
      onRowDeselected();
    }
  };

  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={annexes}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        subHeader
        customStyles={{
          rows: {
            style: {
              backgroundColor: 'white', // Cambia el color de fondo de las filas
            },
          },
          headCells: {
            style: {
              backgroundColor: '#f3f4f6', // Cambia el color del encabezado
              color: '#374151', // Cambia el color del texto del encabezado
              fontWeight: 'bold', // Negrita
            },
          },
        }}
      />
    </div>
  );
};

export default annexesesTable;

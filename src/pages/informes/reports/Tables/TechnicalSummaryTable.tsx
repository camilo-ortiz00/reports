import React from 'react';
import DataTable from 'react-data-table-component';
import { TechnicalSummaryData } from '@/model/reports.props';

interface TechnicalFormProps {
  technical: TechnicalSummaryData[];
  onActivityRowSelected: (technical: TechnicalSummaryData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}

const TechnicalSummaryTable: React.FC<TechnicalFormProps> = ({
  technical,
  onActivityRowSelected,
  onRowDeselected,
  onSearch,
}) => {
  const columns = [
    {
      name: 'N°',
      selector: (row: TechnicalSummaryData) => row.id || 'N/A',
      sortable: true,
      width: '5em',
      cell: (row: TechnicalSummaryData, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      name: 'Actividad',
      selector: (row: TechnicalSummaryData) => row.name_technical || 'Sin resultado',
      sortable: true,
    },
    {
      name: 'Resultado obtenido',
      selector: (row: TechnicalSummaryData) => row.obtained_result || 'Sin resultado',
      sortable: true,
    },
    {
      name: 'Descripción/Producto',
      selector: (row: TechnicalSummaryData) => row.product_description || 'Sin descripción',
      sortable: true,
    },
    {
      name: 'Anexo de la sinopsis',
      selector: (row: TechnicalSummaryData) => row.annex?.description || 'Sin Soporte', // Acceder a la descripción
      sortable: true,
    },
    {
      name: 'Observaciones',
      selector: (row: TechnicalSummaryData) => row.observations || 'Sin observación',
      sortable: true,
    },
  ];

  const handleRowSelected = (state: any) => {
    if (state.selectedRows.length > 0) {
      onActivityRowSelected(state.selectedRows[0]);
    } else {
      onRowDeselected();
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-xl font-semibold mb-4 card p-4 bg-white shadow-lg rounded">SINOPSIS TÉCNICA</h2>
      <DataTable
        columns={columns}
        data={technical}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        customStyles={{
          rows: {
            style: {
              backgroundColor: 'white',
            },
          },
          headCells: {
            style: {
              backgroundColor: '#f3f4f6',
              color: '#374151',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </div>
  );
};

export default TechnicalSummaryTable;

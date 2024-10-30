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
      selector: (row: TechnicalSummaryData) => row.obtained_result || 'Sin resultado',
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
      name: 'Soporte Anexo',
      selector: (row: TechnicalSummaryData) => row.support_annex || 'Sin Soporte',
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
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">SINOPSIS TÉCNICA</h2>
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

export default TechnicalSummaryTable;

import React from 'react';
import DataTable from 'react-data-table-component';
import { DeliverableData } from '@/model/reports.props';

interface DeliverableTableProps {
   deliverables: DeliverableData[];
  onRowSelected: (deliverables: DeliverableData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}
const DeliverableTable: React.FC<DeliverableTableProps > = ({ deliverables, onRowSelected, onRowDeselected, onSearch }) => {
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
      width: '15em',
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
  ];

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
              color: '#374151', // Cambia el color del texto del encabezado
              fontWeight: 'bold', // Negrita
            },
          },
        }}
      />
    </div>
  );
};

export default DeliverableTable;

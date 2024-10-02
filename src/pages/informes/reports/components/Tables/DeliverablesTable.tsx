import React from 'react';
import DataTable from 'react-data-table-component';
import { DeliverableData } from '../../model/reports.props';

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

  const handleRowSelected = async (deliverables: DeliverableData) => {
    onRowSelected(deliverables);
        
    await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliverables),
      });
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={deliverables}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={({ selectedRows }) => {
          if (selectedRows.length > 0) {
            handleRowSelected(selectedRows[0]);
          } else {
            onRowDeselected();
          }
        }}
        subHeader
        subHeaderComponent={
          <div></div>
          /* <input
             type="text"
             placeholder="Buscar"
             className="w-full p-2 border border-gray-300 rounded"
             onChange={(e) => onSearch(e.target.value)}
           />*/
        }
      />
    </div>
  );
};

export default DeliverableTable;

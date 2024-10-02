import React from 'react';
import DataTable from 'react-data-table-component';
import { AnnexData } from '../../model/reports.props';

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

  const handleRowSelected = async (report: AnnexData) => {
    onRowSelected(report);
        
    await fetch('/api/annexes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={annexes}
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

export default annexesesTable;
